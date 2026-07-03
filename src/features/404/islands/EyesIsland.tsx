import React, { useEffect, useRef } from 'react';

const EyesIsland = () => {
  const eyeLeftRef = useRef<HTMLDivElement>(null);
  const eyeRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rotEye = (eyeRef: React.RefObject<HTMLDivElement | null>, x: number, y: number) => {
        if (!eyeRef.current) return;
        const rect = eyeRef.current.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const rad = Math.atan2(x - eyeX, y - eyeY);
        // The pupils need to point towards the mouse.
        // We'll calculate the rotation required.
        const rot = (rad * (180 / Math.PI) * -1) + 180;
        eyeRef.current.style.transform = `rotate(${rot}deg)`;
      };
      
      rotEye(eyeLeftRef, event.clientX, event.clientY);
      rotEye(eyeRightRef, event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="eyes">
      <div className="wrapper">
        <svg fill="none" height="45" viewBox="0 0 137 45" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.27532 43.9941C12.2006 43.9941 14.0559 43.348 16.5885 41.0677C31.215 27.8987 48.7667 20.5827 67.7811 20.5827C86.7955 20.5827 105.81 27.8987 118.974 41.0677C123.362 45.4573 129.212 45.4573 133.6 41.0677C137.988 36.678 137.988 30.8252 133.6 26.4355C116.048 10.3402 92.6461 0.0976562 67.7811 0.0976562C42.9161 0.0976562 19.5138 10.3402 3.42474 27.8987C-0.963194 32.2884 -0.963194 38.1413 3.42474 42.5309C4.88738 43.9941 7.81267 43.9941 9.27532 43.9941Z" fill="black"></path>
        </svg>
        <div className="eye" ref={eyeLeftRef} style={{ transform: "rotate(0deg)" }}></div>
      </div>
      <div className="wrapper">
        <svg fill="none" height="45" viewBox="0 0 137 45" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.27532 43.9941C12.2006 43.9941 14.0559 43.348 16.5885 41.0677C31.215 27.8987 48.7667 20.5827 67.7811 20.5827C86.7955 20.5827 105.81 27.8987 118.974 41.0677C123.362 45.4573 129.212 45.4573 133.6 41.0677C137.988 36.678 137.988 30.8252 133.6 26.4355C116.048 10.3402 92.6461 0.0976562 67.7811 0.0976562C42.9161 0.0976562 19.5138 10.3402 3.42474 27.8987C-0.963194 32.2884 -0.963194 38.1413 3.42474 42.5309C4.88738 43.9941 7.81267 43.9941 9.27532 43.9941Z" fill="black"></path>
        </svg>
        <div className="eye" ref={eyeRightRef} style={{ transform: "rotate(0deg)" }}></div>
      </div>
    </div>
  );
};

export default EyesIsland;
