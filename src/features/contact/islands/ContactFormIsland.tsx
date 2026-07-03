import { useState } from "react";
import { toastManager } from "../../../stores/toastManager";
import { actions } from "astro:actions";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function ContactFormIsland({
  translations,
  locale = "en",
}: {
  translations: Record<string, string>;
  locale?: string;
}) {
  // ─── Form state ─────────────────────────────────────────────
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  // ─── Real-time validation ─────────────────────────────────
  const isEmailValid = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = phone.trim() === "" || isValidPhoneNumber(phone);

  const isFormFilled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    termsAccepted &&
    formComplete;

  const isValid =
    isFormFilled &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    isValidPhoneNumber(phone);

  const isDisabled = formState === "loading";

  // ─── Form submission ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "loading") return;

    if (!termsAccepted || !formComplete) {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Error",
        description: translations["form.errorTerms"] || "You must accept the terms to submit.",
      });
      return;
    }

    if (!isValid) {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Validation Error",
        description: translations["form.errorRequired"] || "Please ensure all fields are filled correctly.",
      });
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const { data, error } = await actions.contact.submit({
        firstName,
        lastName,
        phone,
        email,
        message,
        termsAccepted,
        formComplete,
        locale,
      });

      if (error) {
        setFormState("error");
        if (error.message.includes("Failed to validate")) {
          toastManager.add({
            type: "error",
            title: "Validation Error",
            description: translations["form.errorRequired"] || "Please check your inputs. All required fields must be filled.",
          });
        } else {
          toastManager.add({
            type: "error",
            title: "Error",
            description: error.message || translations["form.errorGeneric"] || "Validation failed.",
          });
        }
        return;
      }

      if (data && !data.success) {
        setFormState("error");
        toastManager.add({
          type: "error",
          title: "Error",
          description: translations["form.errorGeneric"] || "Something went wrong. Please try again.",
        });
        return;
      }

      setFormState("success");
      toastManager.add({
        type: "success",
        title: "Success",
        description: translations["form.success"] || "Thank you! Your message has been sent. We'll respond within 24 hours.",
      });

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormState("idle");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setTermsAccepted(false);
        setFormComplete(false);
      }, 5000);
    } catch {
      setFormState("error");
      toastManager.add({
        type: "error",
        title: "Error",
        description: translations["form.errorNetwork"] || "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="w-full border border-black mb-12">
      {/* ─── Header ──────────────────────────────────── */}
      <div className="flex justify-between items-center border-b border-black max-sm:p-4 p-6">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold uppercase tracking-tight leading-none">
          {translations["form.header"]}
        </h2>
        <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-black rounded-full shrink-0 ml-4"></div>
      </div>

      {/* ─── Form Body ───────────────────────────────── */}
      <div className="max-sm:p-4 p-6">
        <p className="text-lg md:text-xl font-medium mb-12 max-w-3xl leading-snug">
          {translations["form.description"]}
        </p>

        <form id="contact-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Your Details */}
          <div>
            <h3 className="text-xl md:text-2xl font-normal mb-6 tracking-wide">
              {translations["form.yourDetails"]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">{translations["form.firstName"]}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isDisabled}
                  placeholder={translations["form.firstNamePlaceholder"]}
                  className="px-3 py-2 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">{translations["form.lastName"]}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isDisabled}
                  placeholder={translations["form.lastNamePlaceholder"]}
                  className="px-3 py-2 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">
                  {translations["form.phone"]}
                  {!isPhoneValid && (
                    <span className="text-red-500 text-sm ml-2 font-normal">
                      Invalid phone format
                    </span>
                  )}
                </label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={(val) => setPhone(val || "")}
                  disabled={isDisabled}
                  placeholder={translations["form.phonePlaceholder"]}
                  className={`px-3 py-2 bg-transparent border ${!isPhoneValid ? 'border-red-500 ring-1 ring-red-500' : 'border-black focus-within:ring-1 focus-within:ring-black'} transition-colors disabled:opacity-50`}
                  numberInputProps={{
                    className: "bg-transparent border-none focus:outline-none w-full ml-2 text-base",
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium">
                  {translations["form.email"]}
                  {!isEmailValid && (
                    <span className="text-red-500 text-sm ml-2 font-normal">
                      Invalid email format
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDisabled}
                  placeholder={translations["form.emailPlaceholder"]}
                  className={`px-3 py-2 bg-transparent border ${!isEmailValid ? 'border-red-500 ring-1 ring-red-500' : 'border-black focus:ring-1 focus:ring-black'} focus:outline-none transition-colors disabled:opacity-50`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mt-8">
            <h3 className="text-xl md:text-2xl font-normal mb-6 tracking-wide">
              {translations["form.message"]}
            </h3>
            <textarea
              rows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isDisabled}
              placeholder={translations["form.messagePlaceholder"]}
              className="w-full px-3 py-2 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors resize-none disabled:opacity-50"
            ></textarea>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-1 mt-4">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-start pt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isDisabled}
                  className="w-6 h-6 border border-black appearance-none checked:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-sm md:text-base text-black leading-snug">
                {translations["form.termsAgree"]}
              </span>
            </label>
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-start pt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={formComplete}
                  onChange={(e) => setFormComplete(e.target.checked)}
                  disabled={isDisabled}
                  className="w-6 h-6 border border-black appearance-none checked:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-sm md:text-base text-black leading-snug">
                {translations["form.formComplete"]}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="contact-submit"
            disabled={!isValid || isDisabled}
            className="w-full py-5 mt-2 bg-black text-white text-base tracking-widest uppercase font-bold hover:bg-black/90 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:active:scale-100 flex items-center justify-center gap-3"
          >
            {formState === "loading" ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>{translations["form.sending"] || "Sending..."}</span>
              </>
            ) : (
              translations["form.submit"]
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
