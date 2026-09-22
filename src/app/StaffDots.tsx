"use client";

import { useEffect, useRef } from "react";

type Dot = { top: number; left: number; size: number; color: string; jitter: number; delay: number };

const DOTS: Dot[] = [
  { top: 4, left: 60, size: 10, color: "#ffffff", jitter: 40, delay: 0 },
  { top: 11, left: 24, size: 7, color: "#a8d4ef", jitter: -55, delay: 0.4 },
  { top: 19, left: 88, size: 12, color: "#5da8df", jitter: 30, delay: 0.8 },
  { top: 28, left: 40, size: 8, color: "#ffffff", jitter: -35, delay: 1.2 },
  { top: 38, left: 70, size: 14, color: "#a8d4ef", jitter: 60, delay: 0.2 },
  { top: 49, left: 20, size: 9, color: "#5da8df", jitter: -50, delay: 0.6 },
  { top: 60, left: 55, size: 11, color: "#ffffff", jitter: 45, delay: 1 },
  { top: 71, left: 30, size: 7, color: "#a8d4ef", jitter: -30, delay: 1.4 },
  { top: 82, left: 75, size: 13, color: "#5da8df", jitter: 35, delay: 0.3 },
  { top: 91, left: 45, size: 9, color: "#ffffff", jitter: -40, delay: 0.9 },
];

export function StaffDots() {
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const fraction = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
        const scatter = Math.sin(fraction * Math.PI);
        dotRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.transform = `translateX(${DOTS[i].jitter * scatter}px)`;
        });
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden overflow-hidden sm:block" aria-hidden="true">
      {DOTS.map((dot, i) => (
        <div
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          style={{ position: "absolute", top: `${dot.top}%`, left: `${dot.left}px` }}
        >
          <span
            className="staff-dot block rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              animation: `staff-dot-float 6s ease-in-out ${dot.delay}s infinite`,
              boxShadow: "0 0 0 1px rgba(15, 36, 56, 0.06)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
