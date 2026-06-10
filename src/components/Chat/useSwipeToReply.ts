"use client";

import { useRef, useCallback } from "react";

const SWIPE_THRESHOLD = 64; // px to trigger reply
const SWIPE_MAX = 80;       // max px the bubble moves

export function useSwipeToReply(onReply: () => void) {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const isSwipingRef = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startXRef.current === null || startYRef.current === null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    const dy = e.touches[0].clientY - startYRef.current;

    // Only handle right swipes that are more horizontal than vertical
    if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) return;

    isSwipingRef.current = true;
    const clamped = Math.min(dx, SWIPE_MAX);
    const progress = clamped / SWIPE_THRESHOLD;

    if (bubbleRef.current) {
      bubbleRef.current.style.transform = `translateX(${clamped}px)`;
      bubbleRef.current.style.transition = "none";
    }
    if (iconRef.current) {
      iconRef.current.style.opacity = String(Math.min(progress, 1));
      iconRef.current.style.transform = `scale(${0.6 + 0.4 * Math.min(progress, 1)})`;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;

    const dx = startXRef.current !== null
      ? e.changedTouches[0].clientX - startXRef.current
      : 0;

    // Snap back
    if (bubbleRef.current) {
      bubbleRef.current.style.transition = "transform 0.2s ease";
      bubbleRef.current.style.transform = "translateX(0)";
    }
    if (iconRef.current) {
      iconRef.current.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      iconRef.current.style.opacity = "0";
      iconRef.current.style.transform = "scale(0.6)";
    }

    if (dx >= SWIPE_THRESHOLD) {
      // Small haptic if available
      if (navigator.vibrate) navigator.vibrate(30);
      onReply();
    }

    startXRef.current = null;
    startYRef.current = null;
    isSwipingRef.current = false;
  }, [onReply]);

  return { bubbleRef, iconRef, onTouchStart, onTouchMove, onTouchEnd };
}
