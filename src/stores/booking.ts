import { atom } from 'nanostores';

export interface PackageData {
  duration?: string;
  route?: string;
  packageName?: string;
  hideOptions?: boolean;
}

/** Whether the booking modal is visible */
export const $isBookingOpen = atom<boolean>(false);

/** Optional pre-fill data passed from a CTA or tour page */
export const $bookingPackageData = atom<PackageData | null>(null);

/** Page-level booking data set by tour detail pages (fallback when no explicit data is passed) */
export const $pageBookingData = atom<PackageData | null>(null);

/**
 * Open the booking modal.
 * @param data — optional package pre-fill (duration, route, name).
 *               Falls back to page-level booking data if not provided.
 */
export function openBooking(data?: PackageData) {
  if (data) {
    $bookingPackageData.set(data);
  } else if ($pageBookingData.get()) {
    $bookingPackageData.set($pageBookingData.get());
  } else if (typeof window !== 'undefined' && (window as any).__pageBookingData) {
    $bookingPackageData.set((window as any).__pageBookingData as PackageData);
  }
  $isBookingOpen.set(true);
}

/** Close the booking modal */
export function closeBooking() {
  $isBookingOpen.set(false);
}

/** Set page-level booking data (called from tour detail page scripts) */
export function setPageBookingData(data: PackageData | null) {
  $pageBookingData.set(data);
}
