import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_EVENTS } from '../data/events';

// Import CSS locally for this island (Astro handles CSS imports natively)
import '../styles/index.css';
import '../styles/agenda.css';

export interface Translations {
  title: string;
  filter_label: string;
  filter_locations: string[];
  read_more: string;
  months: string[];
  days_desktop: string[];
  days_mobile: string[];
}

export default function AgendaCalendarIsland({ translations }: { translations: Translations }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const toggleLocation = (loc: string) => {
    setSelectedLocation(prev => prev === loc ? null : loc);
  };

  const filteredEvents = MOCK_EVENTS.filter(event => 
    !selectedLocation || event.location.toLowerCase() === selectedLocation.toLowerCase()
  );

  const showPrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const showNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const scrollToDate = (e: React.MouseEvent, dateId: string) => {
    e.stopPropagation();
    const element = document.getElementById(dateId);
    if (!element) return;
    
    // Close the calendar first
    setShowCalendar(false);

    // If the calendar was open, wait for the collapse animation (0.3s) before scrolling 
    // to prevent the height shrinkage from interfering with smooth scroll destination.
    const waitTime = showCalendar ? 350 : 0;
    
    setTimeout(() => {
      const navigation = document.getElementById('navigation');
      const navOffset = navigation ? navigation.offsetHeight - 1 : 64; 

      const targetY = element.getBoundingClientRect().top + window.pageYOffset - navOffset;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }, waitTime);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthDays = getDaysInMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  const monthNames = translations.months.map(m => m.toLowerCase());
  const monthNameStr = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push({ date: prevMonthDays - firstDay + i + 1, isTrailing: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ date: i, isTrailing: false });
  }
  const totalDays = daysArray.length;
  const rows = Math.ceil(totalDays / 7);
  const remainder = (rows * 7) - totalDays;
  for(let i = 1; i <= remainder; i++) {
     daysArray.push({ date: i, isTrailing: true });
  }

  return (
    <>
      <main className="marginTop5 paddingBottom2" style={{ backgroundColor: '#fff', width: '100%' }}>
        <div
          className="week_head___84Qt fontSize4 paddingRight5 paddingBottom8 paddingLeft5"
        >
          <h1 className="week_title__2biB_ paddingRight7">{translations.title}</h1>
        </div>
        <div
          className="week_subhead__FqVXI week_head___84Qt fontSize4 marginTop5 paddingRight5 paddingLeft5"
        >
          <div className="paddingTop6 paddingBottom6" onClick={() => setShowCalendar(!showCalendar)} style={{ cursor: 'pointer' }}>
            <div className="week_subtitle__qlbh7">
              <div className="week_subtitleText__sjICp">{monthNameStr}</div>
            </div>
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="week_calendarModal__TRwHI paddingRight5 paddingLeft5 week_calendarModalActive___BpoQ" 
                  style={{ overflow: 'hidden', zIndex: 10 }}
                >
                  <div className="calendar_calendar__VcnSk">
                    <div style={{ backgroundColor: "#eaac73", color: "#000" }}>
                      <div
                        className="calendar_navigation__W6iZD paddingTop6 paddingRight5 paddingBottom6 paddingLeft5"
                      >
                        <div className="paddingRight8 paddingLeft8">
                          <div
                            className="calendar_arrowPrev__fv_PU calendar_arrow__Rv44m"
                            onClick={showPrevMonth}
                          ></div>
                          <div className="calendar_month__Jmpav fontSize4">
                            {monthNameStr}
                          </div>
                          <div
                            className="calendar_arrowNext__Urmv8 calendar_arrow__Rv44m"
                            onClick={showNextMonth}
                          ></div>
                        </div>
                      </div>
                      <div className="calendar_days__BoSW1 fontSize6">
                        {translations.days_mobile.slice(1).concat(translations.days_mobile[0]).map((day, i) => (
                          <div key={i} className="calendar_day__zu_gD paddingTop5 paddingBottom5">
                            {day}
                          </div>
                        ))}
                      </div>
                      {daysArray.map((day, idx) => {
                        const dateStr = String(day.date).padStart(2, '0');
                        const isCurrentMonth = !day.isTrailing;
                        
                        let curMonth = currentDate.getMonth();
                        let curYear = currentDate.getFullYear();
                        if (!isCurrentMonth) {
                           if (day.date > 15) {
                             curMonth -= 1;
                           } else {
                             curMonth += 1;
                           }
                           if (curMonth < 0) { curMonth = 11; curYear -= 1; }
                           if (curMonth > 11) { curMonth = 0; curYear += 1; }
                        }
                        
                        const hasEvent = filteredEvents.some(e => e.date.getDate() === day.date && e.date.getMonth() === curMonth && e.date.getFullYear() === curYear);
                        
                        const disabledClass = !hasEvent ? 'calendar_dateDisabled__U_sgS' : '';
                        const dateId = `date${dateStr}${String(curMonth + 1).padStart(2, '0')}${curYear}`;

                        return (
                          <div
                            key={idx}
                            onClick={(e) => hasEvent ? scrollToDate(e, dateId) : undefined}
                            className={`calendar_date__vvteL ${disabledClass} ${day.isTrailing ? 'calendar_dateHide__dnBRj' : ''} paddingTop6 paddingBottom6 fontSize4`}
                            style={{ cursor: hasEvent ? 'pointer' : 'default' }}
                          >
                            <span>{day.date.toString().padStart(2, '0')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="week_calendar__S5zLO paddingRight5 paddingLeft5">
          <div style={{ display: 'flex' }}>
            {[18, 19, 20, 21, 22, 23, 24].map((dateNum) => {
              const weekDate = new Date(2026, 4, dateNum); // May is index 4
              const hasEvent = filteredEvents.some(e => 
                e.date.getDate() === weekDate.getDate() && 
                e.date.getMonth() === weekDate.getMonth() && 
                e.date.getFullYear() === weekDate.getFullYear()
              );
              const disabledClass = !hasEvent ? 'week_dateDisabled__nwJBB' : '';
              const dayNamesDesktop = translations.days_desktop;
              const dayNamesMobile = translations.days_mobile;
              const dayIdx = weekDate.getDay();
              
              const dateStr = String(weekDate.getDate()).padStart(2, '0');
              const monthStr = String(weekDate.getMonth() + 1).padStart(2, '0');
              const yearStr = weekDate.getFullYear();
              const dateId = `date${dateStr}${monthStr}${yearStr}`;
              
              return (
                <div
                  key={dateNum}
                  onClick={(e) => hasEvent ? scrollToDate(e, dateId) : undefined}
                  className={`week_date__r_nnE ${disabledClass} paddingTop4 paddingRight4 paddingBottom4 paddingLeft4 fontSize4`}
                  style={{ cursor: hasEvent ? 'pointer' : 'default', opacity: hasEvent ? 1 : 0.4, transition: 'opacity 0.2s ease' }}
                >
                  <div className="week_dateString__PPp_x fontSize6 marginBottom5">
                    <span className="desktop">{dayNamesDesktop[dayIdx]}</span>
                    <span className="mobile">{dayNamesMobile[dayIdx]}</span>
                  </div>
                  <span>{String(dateNum).padStart(2, '0')}</span> <br />
                  <span className="desktop">{translations.months[weekDate.getMonth()].toLowerCase()}</span>
                  <span className="mobile">{translations.months[weekDate.getMonth()].toLowerCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="posts_container__O6KN_">
          <div
            className="posts_filter__mm335 fontSize6 marginTop4 paddingRight5 paddingLeft5"
          >
            <div
              className="posts_filterLabel__LJWy8 paddingTop5 paddingBottom5 marginRight5"
            >
              {translations.filter_label}
            </div>
            {translations.filter_locations.map((loc) => (
              <div
                key={loc}
                onClick={() => toggleLocation(loc)}
                className={`posts_filterItem__BfVel paddingTop5 paddingRight5 paddingBottom5 paddingLeft5`}
                style={{
                  borderLeftColor: selectedLocation?.toLowerCase() === loc.toLowerCase() ? '#000' : 'transparent',
                  borderRightColor: selectedLocation?.toLowerCase() === loc.toLowerCase() ? '#000' : 'transparent',
                }}
              >
                {loc}
              </div>
            ))}
          </div>
          <div className="posts_grid__sGVYW paddingRight7 paddingLeft7">
            {filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event, i, arr) => {
              const dateStr = String(event.date.getDate()).padStart(2, '0');
              const monthStr = String(event.date.getMonth() + 1).padStart(2, '0');
              const yearStr = event.date.getFullYear();
              const dateId = `date${dateStr}${monthStr}${yearStr}`;
              
              const monthNamesLong = translations.months;
              const formattedDate = `${dateStr} ${monthNamesLong[event.date.getMonth()]} ${yearStr}`;

              const showDateTitle = i === 0 || event.date.getTime() !== arr[i - 1].date.getTime();

              return (
                <React.Fragment key={event.id}>
                  {showDateTitle && (
                    <div id={dateId} className="posts_dataTitle__IIil_ paddingTop4 fontSize1" style={{ width: '100%', fontFamily: 'Inter, sans-serif' }}>
                      {formattedDate}
                    </div>
                  )}
                  <div className="posts_post__dmrHG marginTop2 paddingRight7 paddingLeft7">
                    <div>
                      <div className="posts_image__E5Ter paddingRight7">
                        <a href="#">
                          <div className="posts_imageContainer__HMp2b" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60%' }}>
                            <img src={event.image} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt={event.title} />
                          </div>
                        </a>
                      </div>
                      <div className="posts_text__b9l88 paddingLeft7">
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                          <div className="posts_textTop__5NuIK">
                            <div className="posts_head__CXGOg fontSize6 marginBottom5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="posts_location__Zxh6D paddingRight1" style={{ textTransform: 'uppercase' }}>{event.location}</div>
                              <a href="#" className="posts_cta__yKs5u" style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                                <span>{translations.read_more}</span>
                                <svg width="40" height="10" viewBox="0 0 40 10" fill="none" style={{ width: '4.688vw', minWidth: '40px', overflow: 'visible' }}>
                                  <path d="M0 5H39M39 5L35 1M39 5L35 9" stroke="currentColor" strokeWidth="1" />
                                </svg>
                              </a>
                            </div>
                            <a href="#">
                              <h3 className="posts_title__e153c fontSize2" style={{ textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>{event.title}</h3>
                            </a>
                          </div>
                          <div className="posts_textBottom__QBQIo marginTop5">
                            <div className="posts_date__4zLo0 fontSize4">
                              {event.time && `${event.time} - `}{formattedDate}
                              <br />
                              Combo {event.location}
                            </div>
                            <div className="posts_categories__R6NeN marginTop4 fontSize6" style={{ display: 'flex', gap: '10px', textTransform: 'uppercase', flexWrap: 'wrap' }}>
                              {event.tags.map((tag, i) => (
                                <div key={i} className="posts_tag__VGHh0 paddingTop8 paddingRight7 paddingBottom8 paddingLeft7">
                                  #{tag}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
