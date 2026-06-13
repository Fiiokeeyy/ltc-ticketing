"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // In milliseconds
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Hanya memicu isVisible=true jika masuk viewport, dan false jika keluar
        // threshold 0.1 berarti 10% elemen harus terlihat
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Set translation based on direction
  let translateClass = "";
  if (!isVisible) {
    switch (direction) {
      case "up":
        translateClass = "translate-y-12";
        break;
      case "down":
        translateClass = "-translate-y-12";
        break;
      case "left":
        translateClass = "translate-x-12";
        break;
      case "right":
        translateClass = "-translate-x-12";
        break;
      case "none":
        translateClass = "scale-95";
        break;
    }
  } else {
    translateClass = "translate-y-0 translate-x-0 scale-100";
  }

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${translateClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
