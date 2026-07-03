import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "motion/react";
import { $isBookingOpen, $bookingPackageData, closeBooking } from "../../stores/booking";
import { COMPANY_INFO } from "../../constants/company";

export interface BookingFormTranslations {
  title: string;
  guestDetail: string;
  fullName: string;
  email: string;
  groupSize: string;
  packageDetail: string;
  duration: string;
  route: string;
  packageName: string;
  note: string;
  tourDate: string;
  dd: string;
  mm: string;
  yyyy: string;
  sendInquiry: string;
  whatsapp: string;
  sendEmail: string;
  durations: {
    "2d1n": string;
    "3d2n": string;
    "4d3n": string;
  };
  routes: {
    sembalun: string;
    senaru: string;
  };
}

interface Props {
  translations: BookingFormTranslations;
}

export default function BookingFormIsland({ translations: t }: Props) {
  const isOpen = useStore($isBookingOpen);
  const packageData = useStore($bookingPackageData);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [route, setRoute] = useState("");
  const [packageName, setPackageName] = useState("");
  const [note, setNote] = useState("");
  const [dd, setDd] = useState("");
  const [mm, setMm] = useState("");
  const [yyyy, setYyyy] = useState("");

  // Sync packageData into form fields when modal opens
  useEffect(() => {
    if (isOpen && packageData) {
      setDuration(packageData.duration || "");
      setRoute(packageData.route || "");
      setPackageName(packageData.packageName || "");
    }
  }, [isOpen, packageData]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const buildMessageBody = () => {
    const lines: string[] = [];
    lines.push(`Hi Go2Rinjani! I'd like to book a trek.`);
    lines.push("");
    if (fullName) lines.push(`Name: ${fullName}`);
    if (email) lines.push(`Email: ${email}`);
    if (groupSize) lines.push(`Group Size: ${groupSize}`);
    if (duration) lines.push(`Duration: ${duration}`);
    if (route) lines.push(`Route: ${route}`);
    if (packageName) lines.push(`Package: ${packageName}`);
    if (dd && mm && yyyy) lines.push(`Preferred Date: ${dd}/${mm}/${yyyy}`);
    if (note) {
      lines.push("");
      lines.push(`Note: ${note}`);
    }
    return lines.join("\n");
  };

  const handleWhatsApp = () => {
    const phone = COMPANY_INFO.socials.whatsapp.replace(/\+/g, "");
    const message = encodeURIComponent(buildMessageBody());
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    const emailAddr = "go2rinjani@gmail.com";
    const subject = encodeURIComponent(
      `Trek Booking Inquiry${packageName ? ` — ${packageName}` : ""}`
    );
    const body = encodeURIComponent(buildMessageBody());
    window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
  };

  const handleClose = () => {
    closeBooking();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-background w-full lg:max-w-2xl lg:border-2 border-slate-950 shadow-2xl flex flex-col h-dvh lg:h-auto lg:max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 shrink-0">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {t.title}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-black/5 active:bg-black/10 rounded-full transition-colors group"
                aria-label="Close booking form"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-6 mb-4">
              <div className="w-full h-px bg-black"></div>
            </div>

            {/* Form Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0 flex flex-col gap-8">
              {/* Guest Detail */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest block -mb-1">
                  {t.guestDetail}
                </label>
                <input
                  type="text"
                  placeholder={t.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                />
                <input
                  type="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                />
                <input
                  type="text"
                  placeholder={t.groupSize}
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                />
              </div>

              {/* Package Detail */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest block -mb-1">
                  {t.packageDetail}
                </label>

                {!packageData?.hideOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="relative">
                      <select
                        className="w-full sm:p-3 p-2 border border-black bg-transparent appearance-none focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="" disabled>
                          {t.duration}
                        </option>
                        <option value="2D1N">{t.durations["2d1n"]}</option>
                        <option value="3D2N">{t.durations["3d2n"]}</option>
                        <option value="4D3N">{t.durations["4d3n"]}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        className="w-full sm:p-3 p-2 border border-black bg-transparent appearance-none focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                      >
                        <option value="" disabled>
                          {t.route}
                        </option>
                        <option value="sembalun">{t.routes.sembalun}</option>
                        <option value="senaru">{t.routes.senaru}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  placeholder={t.packageName}
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base"
                />
              </div>

              {/* Note */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest block">
                  {t.note}
                </label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded-none text-base resize-none"
                ></textarea>
              </div>

              {/* Tour Date */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest block">
                  {t.tourDate}
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-2">
                  <input
                    type="text"
                    placeholder={t.dd}
                    maxLength={2}
                    value={dd}
                    onChange={(e) => setDd(e.target.value)}
                    className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black text-center rounded-none text-base"
                  />
                  <input
                    type="text"
                    placeholder={t.mm}
                    maxLength={2}
                    value={mm}
                    onChange={(e) => setMm(e.target.value)}
                    className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black text-center rounded-none text-base"
                  />
                  <input
                    type="text"
                    placeholder={t.yyyy}
                    maxLength={4}
                    value={yyyy}
                    onChange={(e) => setYyyy(e.target.value)}
                    className="w-full sm:p-3 p-2 border border-black bg-transparent focus:outline-none focus:ring-1 focus:ring-black text-center rounded-none text-base"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 p-4 border-t-[1.5px] border-black bg-background mt-auto">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest block">
                  {t.sendInquiry}
                </label>
                <div className="flex flex-row gap-2 mt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-whatsapp-primary text-white py-2 sm:py-3 px-2 sm:px-6 hover:bg-whatsapp-hover transition-colors flex justify-center items-center gap-2 group font-medium text-sm sm:text-base whitespace-nowrap"
                    aria-label="Send booking inquiry via WhatsApp"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-90 group-hover:opacity-100 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {t.whatsapp}
                  </button>
                  <button
                    onClick={handleEmail}
                    className="flex-1 bg-black text-white py-4 sm:py-3 px-2 sm:px-6 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 group font-medium text-sm sm:text-base whitespace-nowrap"
                    aria-label="Send booking inquiry via Email"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-90 group-hover:opacity-100 shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    {t.sendEmail}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
