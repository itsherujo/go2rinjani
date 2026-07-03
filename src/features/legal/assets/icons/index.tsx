export const PrevIcon = ({ className = "size-3" }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 6H6V7H5V6Z" fill="currentColor"></path>
    <path d="M5 7H6V8H5V7Z" fill="currentColor"></path>
    <path d="M6 8H7V9H6V8Z" fill="currentColor"></path>
    <path d="M7 9H8V10H7V9Z" fill="currentColor"></path>
    <path d="M8 10H9V11H8V10Z" fill="currentColor"></path>
    <path d="M6 5H7V6H6V5Z" fill="currentColor"></path>
    <path d="M7 4H8V5H7V4Z" fill="currentColor"></path>
    <path d="M8 3H9V4H8V3Z" fill="currentColor"></path>
  </svg>
);

export const NextIcon = ({ className = "size-3" }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6H8V7H9V6Z" fill="currentColor"></path>
    <path d="M9 7H8V8H9V7Z" fill="currentColor"></path>
    <path d="M8 8H7V9H8V8Z" fill="currentColor"></path>
    <path d="M7 9H6V10H7V9Z" fill="currentColor"></path>
    <path d="M6 10H5V11H6V10Z" fill="currentColor"></path>
    <path d="M8 5H7V6H8V5Z" fill="currentColor"></path>
    <path d="M7 4H6V5H7V4Z" fill="currentColor"></path>
    <path d="M6 3H5V4H6V3Z" fill="currentColor"></path>
  </svg>
);

export const ExpandIcon = ({ className = "size-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 5H19V6H18V5Z" fill="currentColor"></path>
    <path d="M5 5H6V6H5V5Z" fill="currentColor"></path>
    <path d="M18 18H19V19H18V18Z" fill="currentColor"></path>
    <path d="M5 18H6V19H5V18Z" fill="currentColor"></path>
    <path d="M9 17H8V7H9V17Z" fill="currentColor"></path>
    <path d="M20 6H19V18H20V6Z" fill="currentColor"></path>
    <path d="M18 5V4H6V5H18Z" fill="currentColor"></path>
    <path d="M6 19V20H18V19H6Z" fill="currentColor"></path>
    <path d="M5 6H4V18H5V6Z" fill="currentColor"></path>
  </svg>
);

export const ReadingModeIcon = ({
  className = "size-6",
  readingMode,
}: {
  className?: string;
  readingMode: boolean;
}) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 15V16H21V15H15Z" fill="currentColor"></path>
    <path d="M22 9H21V15H22V9Z" fill="currentColor"></path>
    <path d="M15 8V9H21V8H15Z" fill="currentColor"></path>
    <path d="M10 10H14V15H15V9H9V15H10V10Z" fill="currentColor"></path>
    <path d="M3 8V9H9V8H3Z" fill="currentColor"></path>
    <path d="M3 9H2V15H3V9Z" fill="currentColor"></path>
    <path d="M3 15V16H9V15H3Z" fill="currentColor"></path>
    <path key={`right-lens-${readingMode ? 'on' : 'off'}`} d="M15 9V15H21V9H15Z" fill="currentColor" opacity="0">
      {readingMode ? (
        <>
          <animateTransform attributeName="transform" type="translate" from="0 -4" to="0 0" dur="0.15s" fill="freeze" />
          <animate attributeName="opacity" from="0" to="1" dur="0.15s" fill="freeze" />
        </>
      ) : (
        <>
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -4" dur="0.15s" fill="freeze" />
          <animate attributeName="opacity" from="1" to="0" dur="0.15s" fill="freeze" />
        </>
      )}
    </path>
    <path key={`left-lens-${readingMode ? 'on' : 'off'}`} d="M3 15H9V9H3V15Z" fill="currentColor" opacity="0">
      {readingMode ? (
        <>
          <animateTransform attributeName="transform" type="translate" from="0 -4" to="0 0" dur="0.15s" fill="freeze" />
          <animate attributeName="opacity" from="0" to="1" dur="0.15s" fill="freeze" />
        </>
      ) : (
        <>
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -4" dur="0.15s" fill="freeze" />
          <animate attributeName="opacity" from="1" to="0" dur="0.15s" fill="freeze" />
        </>
      )}
    </path>
  </svg>
);

export const MutedIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11H17V12H16V11Z"></path>
    <path d="M17 12H18V13H17V12Z"></path>
    <path d="M18 13H19V14H18V13Z"></path>
    <path d="M19 14H20V15H19V14Z"></path>
    <path d="M15 10H16V11H15V10Z"></path>
    <path d="M18 11H19V12H18V11Z"></path>
    <path d="M17 12H18V13H17V12Z"></path>
    <path d="M16 13H17V14H16V13Z"></path>
    <path d="M15 14H16V15H15V14Z"></path>
    <path d="M19 10H20V11H19V10Z"></path>
    <path d="M10 6H11V7H10V6Z"></path>
    <path d="M10 17H11V18H10V17Z"></path>
    <path d="M3 15H4V9H3V15Z"></path>
    <path d="M8 16V17H10V16H8Z"></path>
    <path d="M8 16V15H4V16H8Z"></path>
    <path d="M4 8V9H8V8H4Z"></path>
    <path d="M10 8V7H8V8H10Z"></path>
    <path d="M12 5H11V6H12V18H11V19H12V20H13V4H12V5Z"></path>
  </svg>
);

export const UnmutedIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 10H16V11H15V10Z"></path>
    <path d="M15 13H16V14H15V13Z"></path>
    <path d="M17 7H18V8H17V7Z"></path>
    <path d="M17 16H18V17H17V16Z"></path>
    <path d="M19 14H18V16H19V14Z"></path>
    <path d="M20 10H19V14H20V10Z"></path>
    <path d="M19 8H18V10H19V8Z"></path>
    <path d="M17 11H16V13H17V11Z"></path>
    <path d="M11 5H12V4H13V20H12V19H11V18H10V17H8V16H4V15H3V9H4V8H8V7H10V6H11V5Z"></path>
  </svg>
);

export const TocIcon = ({ className = "size-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.5 18.5L9 18.5M13.5 15.5L9 15.5M13.5 9L9 9M13.5 6L9 6M16.5 12.25L6 12.25" stroke="currentColor" strokeLinecap="square"></path>
  </svg>
);

export const SettingsIcon = ({ className = "size-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 9H12V10H11V9Z"></path>
    <path d="M8 9H9V10H8V9Z"></path>
    <path d="M8 6H9V7H8V6Z"></path>
    <path d="M11 6H12V7H11V6Z"></path>
    <path d="M16 17H17V18H16V17Z"></path>
    <path d="M13 17H14V18H13V17Z"></path>
    <path d="M13 14H14V15H13V14Z"></path>
    <path d="M16 14H17V15H16V14Z"></path>
    <path d="M20 9V8H13V7H12V9H20Z"></path>
    <path d="M10 5H9V6H10H11V5H10Z"></path>
    <path d="M11 11V10H9V11H11Z"></path>
    <path d="M4 8V9H8V8V7H7V8H4Z"></path>
    <path d="M20 17V16H18V15H17V17H20Z"></path>
    <path d="M14 13V14H16V13H14Z"></path>
    <path d="M4 16V17H13V15H12V16H4Z"></path>
    <path d="M16 19V18H14V19H16Z"></path>
  </svg>
);

export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7H17V8H16V7Z"></path>
    <path d="M15 8H16V9H15V8Z"></path>
    <path d="M14 9H15V10H14V9Z"></path>
    <path d="M13 10H14V11H13V10Z"></path>
    <path d="M10 13H11V14H10V13Z"></path>
    <path d="M9 14H10V15H9V14Z"></path>
    <path d="M8 15H9V16H8V15Z"></path>
    <path d="M7 16H8V17H7V16Z"></path>
    <path d="M17 6H18V7H17V6Z"></path>
    <path d="M6 17H7V18H6V17Z"></path>
    <path d="M7 7H8V8H7V7Z"></path>
    <path d="M8 8H9V9H8V8Z"></path>
    <path d="M9 9H10V10H9V9Z"></path>
    <path d="M10 10H11V11H10V10Z"></path>
    <path d="M13 13H14V14H13V13Z"></path>
    <path d="M14 14H15V15H14V14Z"></path>
    <path d="M15 15H16V16H15V15Z"></path>
    <path d="M16 16H17V17H16V16Z"></path>
    <path d="M6 6H7V7H6V6Z"></path>
    <path d="M17 17H18V18H17V17Z"></path>
    <path d="M13 11H11V13H13V11Z"></path>
  </svg>
);
