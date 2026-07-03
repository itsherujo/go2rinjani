import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { RESEND_API_KEY, NOTIFICATION_EMAIL } from 'astro:env/server';

export const server = {
  newsletter: {
    subscribe: defineAction({
      accept: 'json',
      input: z.object({
        name: z.string().min(1, { message: 'Name is required' }).max(100),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        destinations: z.array(z.string()).optional().default([]),
        newsletterTypes: z.array(z.string()).optional().default([]),
        privacyAccepted: z.boolean().refine((v) => v === true, {
          message: 'You must accept the privacy policy',
        }),
        locale: z.string().optional().default('en'),
      }),
      handler: async (input, context) => {
        // @ts-ignore - Astro 6 provides this virtual module for Cloudflare bindings
        const { env } = await import("cloudflare:workers");
        const db = env.DB;

        // 1. Check for duplicate email
        const existing = await db
          .prepare('SELECT id FROM subscribers WHERE email = ?')
          .bind(input.email)
          .first();

        if (existing) {
          return { success: false as const, error: 'already_subscribed' as const };
        }

        // 2. Insert new subscriber
        await db
          .prepare(
            `INSERT INTO subscribers (name, email, destinations, newsletter_types, privacy_accepted, locale)
             VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(
            input.name,
            input.email,
            JSON.stringify(input.destinations),
            JSON.stringify(input.newsletterTypes),
            input.privacyAccepted ? 1 : 0,
            input.locale
          )
          .run();

        // 3. Send email notification to business Gmail
        await sendNotificationEmail(input);

        return { success: true as const };
      },
    }),
  },

  contact: {
    submit: defineAction({
      accept: 'json',
      input: z.object({
        firstName: z.string().min(1, { message: 'First name is required' }).max(100),
        lastName: z.string().min(1, { message: 'Last name is required' }).max(100),
        phone: z.string().min(1, { message: 'Phone number is required' }).max(50).refine((val) => /^\+[1-9]\d{1,14}$/.test(val.replace(/[\s-]/g, '')), {
          message: 'Please enter a valid international phone number',
        }),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        message: z.string().optional().default(''),
        termsAccepted: z.boolean().refine((v) => v === true, {
          message: 'You must accept the terms',
        }),
        formComplete: z.boolean().refine((v) => v === true, {
          message: 'You must confirm the form is complete',
        }),
        locale: z.string().optional().default('en'),
      }),
      handler: async (input) => {
        // @ts-ignore - Astro 6 provides this virtual module for Cloudflare bindings
        const { env } = await import("cloudflare:workers");
        const db = env.DB;

        // 1. Persist the contact message to D1
        await db
          .prepare(
            `INSERT INTO contact_messages (first_name, last_name, email, phone, message, locale)
             VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(
            input.firstName,
            input.lastName,
            input.email,
            input.phone,
            input.message,
            input.locale
          )
          .run();

        // 2. Send notification email to business
        await sendContactNotificationEmail(input);

        // 3. Send auto-reply to the person who submitted the form
        await sendContactAutoReply(input);

        return { success: true as const };
      },
    }),
  },
};

// ─── Email Notification via Resend ────────────────────────────────────────────
async function sendNotificationEmail(subscriber: {
  name: string;
  email: string;
  destinations: string[];
  newsletterTypes: string[];
}) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Go2Rinjani <notifications@go2rinjani.com>',
        to: [NOTIFICATION_EMAIL],
        subject: `🏔️ New Subscriber: ${subscriber.name}`,
        html: buildNotificationHtml(subscriber),
      }),
    });

    if (!res.ok) {
      console.error('Resend email failed:', await res.text());
    }
  } catch (err) {
    // Log but don't block — the subscription is already saved to D1
    console.error('Email notification error:', err);
  }
}

// ─── Email HTML Template ──────────────────────────────────────────────────────
function buildNotificationHtml(subscriber: {
  name: string;
  email: string;
  destinations: string[];
  newsletterTypes: string[];
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background:#1a1a1a;padding:28px 32px;">
          <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">
            🏔️ New Newsletter Subscriber
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;width:140px;color:#111827;">Name</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">${subscriber.name}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;">Email</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
                <a href="mailto:${subscriber.email}" style="color:#2563eb;text-decoration:none;">${subscriber.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;">Destinations</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">${subscriber.destinations.length > 0 ? subscriber.destinations.join(', ') : '<span style="color:#9ca3af;">None selected</span>'}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#111827;">Newsletter Types</td>
              <td style="padding:12px 16px;">${subscriber.newsletterTypes.length > 0 ? subscriber.newsletterTypes.join(', ') : '<span style="color:#9ca3af;">None selected</span>'}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            Sent automatically by Go2Rinjani subscription system
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT FORM EMAILS
// ═══════════════════════════════════════════════════════════════════════════════

type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

// ─── Contact Notification to Business ─────────────────────────────────────────
async function sendContactNotificationEmail(contact: ContactInput) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Go2Rinjani <notifications@go2rinjani.com>',
        to: [NOTIFICATION_EMAIL],
        subject: `📩 New Contact Message from ${contact.firstName} ${contact.lastName}`,
        html: buildContactNotificationHtml(contact),
      }),
    });

    if (!res.ok) {
      console.error('Resend contact notification failed:', await res.text());
    }
  } catch (err) {
    console.error('Contact notification email error:', err);
  }
}

// ─── Auto-Reply to the Person Who Submitted ───────────────────────────────────
async function sendContactAutoReply(contact: ContactInput) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Go2Rinjani <notifications@go2rinjani.com>',
        to: [contact.email],
        subject: `Thank you for reaching out, ${contact.firstName}! 🏔️`,
        html: buildContactAutoReplyHtml(contact),
      }),
    });

    if (!res.ok) {
      console.error('Resend auto-reply failed:', await res.text());
    }
  } catch (err) {
    // Log but don't block — the contact message is already saved to D1
    console.error('Auto-reply email error:', err);
  }
}

// ─── Contact Notification HTML Template ───────────────────────────────────────
function buildContactNotificationHtml(contact: ContactInput): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background:#1a1a1a;padding:28px 32px;">
          <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">
            📩 New Contact Form Message
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;width:140px;color:#111827;">Name</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">${contact.firstName} ${contact.lastName}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;">Email</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
                <a href="mailto:${contact.email}" style="color:#2563eb;text-decoration:none;">${contact.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;">Phone</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
                <a href="tel:${contact.phone}" style="color:#2563eb;text-decoration:none;">${contact.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:600;color:#111827;vertical-align:top;">Message</td>
              <td style="padding:12px 16px;line-height:1.6;">${contact.message || '<span style="color:#9ca3af;">No message provided</span>'}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            Sent automatically by Go2Rinjani contact form
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Auto-Reply HTML Template ─────────────────────────────────────────────────
function buildContactAutoReplyHtml(contact: ContactInput): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background:#1a1a1a;padding:28px 32px;">
          <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">
            🏔️ Go2Rinjani
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <p style="font-size:16px;color:#111827;margin:0 0 16px;line-height:1.6;">
            Dear ${contact.firstName},
          </p>
          <p style="font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7;">
            Thank you for contacting Go2Rinjani. We've received your message and our team is currently reviewing it.
          </p>
          <p style="font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7;">
            We aim to respond to all enquiries within <strong>24 hours</strong>. In the meantime, feel free to explore our
            <a href="https://go2rinjani.com/tours" style="color:#2563eb;text-decoration:none;font-weight:500;">available treks</a>
            or check out our
            <a href="https://go2rinjani.com/faq" style="color:#2563eb;text-decoration:none;font-weight:500;">frequently asked questions</a>.
          </p>
          <p style="font-size:14px;color:#374151;margin:0 0 24px;line-height:1.7;">
            If your enquiry is urgent, you can also reach us directly via WhatsApp or by visiting our on-site office in Senaru, Lombok.
          </p>

          <!-- Divider -->
          <div style="border-top:1px solid #e5e7eb;margin:24px 0;"></div>

          <p style="font-size:14px;color:#374151;margin:0 0 4px;line-height:1.6;">
            Warm regards,
          </p>
          <p style="font-size:14px;color:#111827;margin:0;font-weight:600;line-height:1.6;">
            The Go2Rinjani Team
          </p>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

