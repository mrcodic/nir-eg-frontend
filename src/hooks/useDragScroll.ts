"use client";

import { useRef, useCallback, useEffect } from "react";

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (!ref.current) return;

    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = ref.current.scrollLeft;

    ref.current.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !ref.current) return;

    e.preventDefault();

    const walk = e.clientX - startX.current;
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onPointerUp = useCallback((e: PointerEvent) => {
    isDragging.current = false;
    ref.current?.releasePointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  return { ref };
}
