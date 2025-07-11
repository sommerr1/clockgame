import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Time } from '../types.ts';
import { CLOCK_SIZE, CENTER, CLOCK_RADIUS, HOUR_HAND_LENGTH, MINUTE_HAND_LENGTH, NUMBER_RADIUS } from '../constants.ts';

interface AnalogClockProps {
  time: Time;
  onTimeUpdate: (newTime: Time) => void;
  draggable?: boolean;
}

type DraggableHand = 'hour' | 'minute' | null;

const AnalogClock: React.FC<AnalogClockProps> = ({ time, onTimeUpdate, draggable = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingHand, setDraggingHand] = useState<DraggableHand>(null);

  const calculateAngle = useCallback((event: MouseEvent | TouchEvent) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return 0; // Or handle as an error/default
    }

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const deltaX = mouseX - CENTER;
    const deltaY = mouseY - CENTER;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle % 360;
  }, []);

  const handlePointerMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!draggingHand || !draggable) return;

    const angle = calculateAngle(event);
    let newHour = time.hour;
    let newMinute = time.minute;

    if (draggingHand === 'hour') {
      newHour = Math.round(angle / 30) % 12;
    } else if (draggingHand === 'minute') {
      newMinute = Math.round(angle / 6) % 60;
    }
    onTimeUpdate({ hour: newHour, minute: newMinute });
  }, [draggingHand, time, onTimeUpdate, calculateAngle, draggable]);

  const handlePointerUp = useCallback(() => {
    setDraggingHand(null);
  }, []);

  useEffect(() => {
    const currentSvgRef = svgRef.current; // Capture ref value

    const handleMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e);
    const handleUp = () => handlePointerUp();

    if (draggingHand && draggable && currentSvgRef) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove, { passive: false }); // passive: false if preventDefault is called
      document.addEventListener('touchend', handleUp);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [draggingHand, handlePointerMove, handlePointerUp, draggable]);

  const handlePointerDown = (hand: DraggableHand, event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable || !hand) return;
    // For touch events, prevent default to avoid scrolling or other gestures.
    if (event.type === 'touchstart') {
        // e.preventDefault(); // Uncomment if you experience issues with page scroll on touch
    }
    setDraggingHand(hand);
  };


  const hourAngle = (time.hour % 12 + time.minute / 60) * 30;
  const minuteAngle = time.minute * 6;

  return (
    <div className="flex justify-center items-center p-4 select-none touch-none"> {/* Added touch-none */}
      <svg 
        ref={svgRef} 
        width={CLOCK_SIZE} 
        height={CLOCK_SIZE} 
        viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`} 
        className="rounded-full shadow-lg bg-white"
        onTouchStart={(e) => e.preventDefault()} // Prevents page scroll when interacting with SVG on touch
      >
        <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS} fill="white" stroke="#334155" strokeWidth="8" /> {/* strokeWidth increased from 6 to 8 */}
        <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS * 0.95} fill="white" stroke="#e2e8f0" strokeWidth="1.5" /> {/* strokeWidth increased from 1 to 1.5 */}

        {Array.from({ length: 60 }).map((_, i) => {
          const isHourMark = i % 5 === 0;
          const angle = i * 6;
          // length parameter is half the visual length of the mark
          const markHalfVisualLength = isHourMark ? 15 : 7.5; // Scaled from 12:6
          const markStrokeW = isHourMark ? 4 : 2; // Scaled from 3:1.5
          const markCenterOffset = isHourMark ? 2.5 : 0; // Scaled from 2:0. Offset from CLOCK_RADIUS towards center
          const color = isHourMark ? '#334155' : '#94a3b8';
          
          const yMarkCenter = CENTER - CLOCK_RADIUS + markCenterOffset;

          return (
            <line
              key={`mark-${i}`}
              x1={CENTER}
              y1={yMarkCenter + markHalfVisualLength} 
              x2={CENTER}
              y2={yMarkCenter - markHalfVisualLength}
              stroke={color}
              strokeWidth={markStrokeW}
              strokeLinecap="round"
              transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            />
          );
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const num = i + 1;
          const angleRad = (num * 30 - 90) * (Math.PI / 180);
          const x = CENTER + NUMBER_RADIUS * Math.cos(angleRad);
          const y = CENTER + NUMBER_RADIUS * Math.sin(angleRad);
          return (
            <text
              key={`num-${num}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={NUMBER_RADIUS * 0.22} // Scales with NUMBER_RADIUS
              fill="#1e293b"
              className="font-semibold pointer-events-none"
            >
              {num}
            </text>
          );
        })}

        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER}
          y2={CENTER - HOUR_HAND_LENGTH}
          stroke="#334155"
          strokeWidth="10" // Scaled from 8
          strokeLinecap="round"
          transform={`rotate(${hourAngle} ${CENTER} ${CENTER})`}
          onMouseDown={(e) => handlePointerDown('hour', e)}
          onTouchStart={(e) => handlePointerDown('hour', e)}
          className={draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
        />

        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER}
          y2={CENTER - MINUTE_HAND_LENGTH}
          stroke="#475569"
          strokeWidth="8" // Scaled from 6
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} ${CENTER} ${CENTER})`}
          onMouseDown={(e) => handlePointerDown('minute', e)}
          onTouchStart={(e) => handlePointerDown('minute', e)}
          className={draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
        />

        <circle cx={CENTER} cy={CENTER} r="10" fill="#1e293b" /> {/* r scaled from 8 */}
        <circle cx={CENTER} cy={CENTER} r="5" fill="white" className="pointer-events-none" /> {/* r scaled from 4 */}
      </svg>
    </div>
  );
};

export default AnalogClock;