import { useTranslations } from "../../../i18n/utils";

export function buildBookingTranslations(lang: string) {
  const tCommon = useTranslations(lang, "common");

  return {
    title: tCommon("bookingForm.title") as string,
    guestDetail: tCommon("bookingForm.guestDetail") as string,
    fullName: tCommon("bookingForm.fullName") as string,
    email: tCommon("bookingForm.email") as string,
    groupSize: tCommon("bookingForm.groupSize") as string,
    packageDetail: tCommon("bookingForm.packageDetail") as string,
    duration: tCommon("bookingForm.duration") as string,
    route: tCommon("bookingForm.route") as string,
    packageName: tCommon("bookingForm.packageName") as string,
    note: tCommon("bookingForm.note") as string,
    tourDate: tCommon("bookingForm.tourDate") as string,
    dd: tCommon("bookingForm.dd") as string,
    mm: tCommon("bookingForm.mm") as string,
    yyyy: tCommon("bookingForm.yyyy") as string,
    sendInquiry: tCommon("bookingForm.sendInquiry") as string,
    whatsapp: tCommon("bookingForm.whatsapp") as string,
    sendEmail: tCommon("bookingForm.sendEmail") as string,
    durations: {
      "2d1n": tCommon("bookingForm.durations.2d1n") as string,
      "3d2n": tCommon("bookingForm.durations.3d2n") as string,
      "4d3n": tCommon("bookingForm.durations.4d3n") as string,
    },
    routes: {
      sembalun: tCommon("bookingForm.routes.sembalun") as string,
      senaru: tCommon("bookingForm.routes.senaru") as string,
    },
  };
}
