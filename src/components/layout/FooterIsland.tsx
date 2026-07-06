import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toastManager } from "../../stores/toastManager";
import { getLocalizedPath } from "../../utils/localizedPath";
import { actions } from "astro:actions";
import type { SocialItem, NavItem, LicenseItem } from "../../types";

export default function FooterIsland({
  translations,
  destinations,
  newsletterTypes,
  socialItems,
  navItems,
  licenseItems,
  locale = "en",
}: {
  translations: Record<string, string>;
  destinations: string[];
  newsletterTypes: string[];
  socialItems: SocialItem[];
  navItems: NavItem[];
  licenseItems: LicenseItem[];
  locale?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // ─── Form state ─────────────────────────────────────────────
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // ─── Checkbox toggle helpers ────────────────────────────────
  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // ─── Form submission ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "loading") return;

    // Client-side validation for better UX
    if (!privacyAccepted) {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Error",
        description: "You must accept the privacy policy to subscribe.",
      });
      return;
    }
    if (!name || !email) {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Name and email are required.",
      });
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const { data, error } = await actions.newsletter.subscribe({
        name,
        email,
        destinations: selectedDestinations,
        newsletterTypes: selectedTypes,
        privacyAccepted,
        locale,
      });

      if (error) {
        setFormState("error");
        // Astro Action Zod errors are sometimes stringified JSON
        if (error.message.includes("Failed to validate")) {
          toastManager.add({
            type: "error",
            title: "Validation Error",
            description: "Please check your inputs. Name and valid email are required.",
          });
        } else {
          toastManager.add({
            type: "error",
            title: "Error",
            description: error.message || "Validation failed.",
          });
        }
        return;
      }

      if (data && !data.success) {
        setFormState("error");
        toastManager.add({
          type: "error",
          title: "Error",
          description: data.error === "already_subscribed"
            ? "This email is already subscribed!"
            : "Something went wrong. Please try again.",
        });
        return;
      }

      setFormState("success");
      toastManager.add({
        type: "success",
        title: "Success",
        description: "Thank you for subscribing! Check your inbox.",
      });

      // Reset form after 4 seconds
      setTimeout(() => {
        setFormState("idle");
        setName("");
        setEmail("");
        setSelectedDestinations([]);
        setSelectedTypes([]);
        setPrivacyAccepted(false);
      }, 4000);
    } catch {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <footer className="w-full bg-black text-white p-4 md:p-6 lg:pt-12 lg:pb-6 lg:px-4">
      <div className="max-w-9xl mx-auto">
        <h2 className="text-2xl md:text-4xl lg:text-[3.8rem] font-normal tracking-tight mb-8 md:mb-12">
          {translations['newsletter.title']}
        </h2>

        <div className="mb-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex justify-between items-start md:items-center text-left w-full md:w-auto md:justify-start gap-6 text-xs md:text-base lg:text-lg tracking-[0.09em] uppercase mb-4 md:mb-10 hover:text-gray-300 active:text-gray-300 transition-colors"
          >
            <span className="max-w-[85%] md:max-w-none">
              {translations['newsletter.subtitle']}
            </span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-0.5 md:mt-0 shrink-0"
            >
              ↓
            </motion.span>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-12 flex flex-col gap-8">
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-4 uppercase tracking-widest">
                      {translations['newsletter.destinations.label']}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-6">
                      {destinations.map((dest) => (
                        <label
                          key={dest}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDestinations.includes(dest)}
                            onChange={() => toggleDestination(dest)}
                            disabled={formState === "loading"}
                            className="w-4 h-4 md:w-5 md:h-5 bg-transparent border border-white appearance-none checked:bg-white cursor-pointer group-hover:bg-white/20 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-xs md:text-sm tracking-widest uppercase">
                            {dest}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-4 uppercase tracking-widest">
                      {translations['newsletter.newsletter_type.label']}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-6">
                      {newsletterTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            disabled={formState === "loading"}
                            className="w-4 h-4 md:w-5 md:h-5 bg-transparent border border-white appearance-none checked:bg-white cursor-pointer group-hover:bg-white/20 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-xs md:text-sm tracking-widest uppercase">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="w-full max-w-7xl">
            <div className="flex flex-col md:flex-row gap-5 items-end w-full">
              <div className="w-full md:w-1/3">
                <input
                  type="text"
                  id="newsletter-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formState === "loading"}
                  placeholder={translations['newsletter.form.name_placeholder']}
                  className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder:text-gray-500 placeholder:tracking-widest placeholder:uppercase text-xs md:text-base lg:text-lg focus:outline-none focus:border-white transition-colors disabled:opacity-50 autofill:shadow-[inset_0_0_0px_1000px_rgb(0,0,0)] autofill:[-webkit-text-fill-color:white]"
                />
              </div>

              <div className="w-full md:w-2/3">
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "loading"}
                  placeholder={translations['newsletter.form.email_placeholder']}
                  className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder:text-gray-500 placeholder:tracking-widest placeholder:uppercase text-xs md:text-base lg:text-lg focus:outline-none focus:border-white transition-colors disabled:opacity-50 autofill:shadow-[inset_0_0_0px_1000px_rgb(0,0,0)] autofill:[-webkit-text-fill-color:white]"
                />
              </div>

              <button
                type="submit"
                disabled={formState === "loading"}
                className="hidden md:flex items-center gap-2 text-sm md:text-base lg:text-lg tracking-widest uppercase hover:text-gray-300 active:text-gray-300 transition-colors pb-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "loading" ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  translations['newsletter.form.submit_label']
                )}
              </button>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col-reverse md:flex-row items-start md:items-center justify-between md:justify-start w-full gap-8 md:gap-3">
              <button
                type="submit"
                disabled={formState === "loading"}
                className="md:hidden text-xs tracking-widest uppercase hover:text-gray-300 active:text-gray-300 transition-colors shrink-0 pb-1 border-b border-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {formState === "loading" ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  translations['newsletter.form.submit_label']
                )}
              </button>
              <div className="flex items-start md:items-center gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  disabled={formState === "loading"}
                  className="w-4 h-4 md:w-5 md:h-5 bg-transparent border border-white appearance-none checked:bg-white cursor-pointer shrink-0 mt-0.5 md:mt-0 relative disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="privacy"
                  className="text-xs md:text-base lg:text-lg tracking-widest uppercase cursor-pointer leading-tight md:leading-normal"
                >
                  {translations['newsletter.form.privacy_label']}
                </label>
              </div>
            </div>

            {/* ─── Success / Error Toast removed (handled globally) ─────────────────────────── */}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pt-12 md:pt-16 border-t border-gray-800">
          
          {/* Col 1: Social */}
          <div className="flex flex-col gap-4 text-xs lg:text-sm tracking-widest uppercase lg:justify-end">
            <h3 className="text-gray-400 mb-2">{translations['social.title']}</h3>
            <div className="flex flex-col gap-2">
              {socialItems.map((link, idx) => (
                <a
                  key={idx}
                  href={getLocalizedPath(link.url, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 active:text-gray-300 transition-colors"
                >
                  <span className="font-medium">{link.platform}</span>
                  <span className="text-gray-400 ml-2 normal-case tracking-normal">({link.handle})</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-4 text-xs lg:text-sm tracking-widest uppercase lg:justify-end">
            <h3 className="text-gray-400 mb-2">Links</h3>
            <div className="flex flex-col gap-2">
              {navItems.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="hover:text-gray-300 active:text-gray-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Contact Info */}
          <div className="flex flex-col gap-6 text-xs lg:text-sm tracking-widest uppercase">
            <div>
              <h3 className="text-gray-400 mb-4">{translations['contact.title']}</h3>
              <a 
                href={translations['contact.maps_url']} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors leading-relaxed block max-w-xs"
              >
                {translations['contact.address']}
              </a>
            </div>
            
            <div>
              <h3 className="text-gray-400 mb-4">{translations['contact.hours.title']}</h3>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="block text-gray-400 mb-1">{translations['contact.hours.online.label']}</span>
                  <span className="normal-case tracking-wide text-gray-300">{translations['contact.hours.online.value']}</span>
                </p>
                <p className="mt-2">
                  <span className="block text-gray-400 mb-1">{translations['contact.hours.offline.label']}</span>
                  <span className="normal-case tracking-wide text-gray-300">{translations['contact.hours.offline.value']}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: License & Copyright */}
          <div className="flex flex-col justify-between gap-8 text-xs lg:text-sm tracking-widest uppercase">
            <div className="flex flex-col gap-2">
              <h3 className="text-gray-400 mb-2">{translations['license.title']}</h3>
              <p className="text-gray-300 normal-case tracking-wide mb-2">{translations['license.subtitle']}</p>
              
              <div className="flex flex-col gap-1 text-gray-400">
                {licenseItems.map((item, idx) => (
                  <p key={idx}>
                    <span className="font-medium text-white">{item.label}:</span> <span className="normal-case tracking-wide">{item.value}</span>
                  </p>
                ))}
              </div>
            </div>
            
            <div className="text-gray-400">
              <p>{translations['copyright']}</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
