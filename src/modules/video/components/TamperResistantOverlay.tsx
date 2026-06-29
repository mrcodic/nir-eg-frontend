"use client";

import { useAuthContext } from "@/context/auth-context";
import { DateTime } from "luxon";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { postTamperAttempt } from "../../../utils/api";

interface VideoWrapperProps {
  children: ReactNode;
  text?: string;
}

const WRAPPER_CLASS_NAME = "tamper-wrapper";
const WRAPPER_HEIGHT_TOLERANCE_PX = 10;

// Tampers that survive a React remount (stylesheet-based) → lockdown, don't loop-restart
const UNRESOLVABLE_TAMPER_PATTERNS = [
  "Wrapper height tampered",
  "Wrapper layout CSS tampered",
  "Wrapper hidden via clip-path/filter/scale",
  "Wrapper hidden or transformed via CSS",
  "Shadow host hidden",
  "Container hidden",
  "Primary overlay hidden",
  "Secondary overlay hidden",
  "Ancestor element hidden",
] as const;

function isUnresolvableTamper(message: string): boolean {
  return UNRESOLVABLE_TAMPER_PATTERNS.some((pattern) =>
    message.startsWith(pattern),
  );
}

const TamperResistantOverlay: React.FC<VideoWrapperProps> = ({
  children,
  text,
}) => {
  const debouncedLogRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const secondaryOverlayRef = useRef<HTMLDivElement | null>(null);
  const shadowObserverRef = useRef<MutationObserver | null>(null);
  const wrapperObserverRef = useRef<MutationObserver | null>(null);
  const initialStylesRef = useRef<{
    wrapper: string;
    container: string;
    overlay: string;
    secondary: string;
  } | null>(null);

  const [restartKey, setRestartKey] = useState(0);
  const [lockdownReason, setLockdownReason] = useState<string | null>(null);
  const isLockedDownRef = useRef(false);
  const lastTamperRef = useRef<string>("");
  const animationIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { profile } = useAuthContext();

  const overlayText = String(text || profile?.id);

  const getExpectedHeight = () => (window.innerWidth < 640 ? 300 : 520);

  // Restored to original working structure — only change is post-before-guard ordering
  const logTamperAttempt = useCallback(async (message: string) => {
    if (
      debouncedLogRef.current &&
      Date.now() - debouncedLogRef.current < 5000
    ) {
      return;
    }
    if (lastTamperRef.current === message) {
      return;
    }

    const timestamp = DateTime.utc().toMillis();
    lastTamperRef.current = message;

    try {
      await postTamperAttempt({
        message,
        timestamp,
        userAgent: navigator?.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
      });
      debouncedLogRef.current = Date.now();
    } catch {
      // reset on failure so next tick can retry
      lastTamperRef.current = "";
      debouncedLogRef.current = null;
    }
  }, []);

  const lockdown = useCallback(
    (reason: string) => {
      if (isLockedDownRef.current) return;
      isLockedDownRef.current = true;

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (animationIdRef.current) {
        clearTimeout(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (shadowObserverRef.current) {
        shadowObserverRef.current.disconnect();
        shadowObserverRef.current = null;
      }
      if (wrapperObserverRef.current) {
        wrapperObserverRef.current.disconnect();
        wrapperObserverRef.current = null;
      }

      // Call directly — logTamperAttempt is stable (empty dep array useCallback)
      logTamperAttempt(reason);

      setLockdownReason(reason);
    },
    [logTamperAttempt],
  );

  const restartOverlay = useCallback(
    (tamperMessage: string) => {
      if (isLockedDownRef.current) return;

      if (isUnresolvableTamper(tamperMessage)) {
        lockdown(tamperMessage);
        return;
      }

      logTamperAttempt(tamperMessage);

      if (animationIdRef.current) {
        clearTimeout(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (shadowRootRef.current) {
        shadowRootRef.current.innerHTML = "";
        shadowRootRef.current = null;
      }

      containerRef.current = null;
      overlayRef.current = null;
      secondaryOverlayRef.current = null;
      initialStylesRef.current = null;

      if (shadowObserverRef.current) {
        shadowObserverRef.current.disconnect();
        shadowObserverRef.current = null;
      }
      if (wrapperObserverRef.current) {
        wrapperObserverRef.current.disconnect();
        wrapperObserverRef.current = null;
      }

      // Clear lastTamper so the same message can fire again after remount
      lastTamperRef.current = "";

      setRestartKey((prev) => prev + 1);
    },
    [lockdown, logTamperAttempt],
  );

  const createShadowOverlay = useCallback(() => {
    const shadowHost = shadowHostRef.current;
    const wrapper = wrapperRef.current;
    if (!shadowHost || !wrapper) return;

    if (shadowRootRef.current) return;

    let shadowRoot = shadowRootRef.current;

    if (!shadowRoot) {
      try {
        shadowRoot = shadowHost.attachShadow({ mode: "closed" });
        shadowRootRef.current = shadowRoot;
      } catch (error) {
        console.error("Failed to attach shadow root:", error);
        return;
      }
    }

    shadowRoot.innerHTML = "";

    const container = document.createElement("div");
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    `;
    containerRef.current = container;

    const primaryOverlay = document.createElement("div");
    primaryOverlay.textContent = overlayText || "";
    primaryOverlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      color: rgba(255, 255, 255, 0.3);
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      left: 0;
      user-select: none;
      white-space: nowrap;
      transition: all 0.5s ease-in-out;
      font-family: Arial, sans-serif;
    `;
    overlayRef.current = primaryOverlay;

    const secondaryOverlay = document.createElement("div");
    secondaryOverlay.textContent = overlayText || "";
    secondaryOverlay.style.cssText = `
      position: absolute;
      bottom: -100px;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      color: rgba(255, 255, 255, 0.2);
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      user-select: none;
      font-family: Arial, sans-serif;
    `;
    secondaryOverlayRef.current = secondaryOverlay;

    container.appendChild(primaryOverlay);
    container.appendChild(secondaryOverlay);
    shadowRoot.appendChild(container);

    initialStylesRef.current = {
      wrapper: wrapper.style.cssText,
      container: container.style.cssText,
      overlay: primaryOverlay.style.cssText,
      secondary: secondaryOverlay.style.cssText,
    };

    if (shadowObserverRef.current) {
      shadowObserverRef.current.disconnect();
    }

    const shadowObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const container = containerRef.current;
          const overlay = overlayRef.current;
          const secondary = secondaryOverlayRef.current;

          if (!container || !shadowRoot.contains(container)) {
            restartOverlay("Container element removed from shadow root");
            break;
          }
          if (!overlay || !container.contains(overlay)) {
            restartOverlay("Primary overlay element removed from container");
            break;
          }
          if (!secondary || !container.contains(secondary)) {
            restartOverlay("Secondary overlay element removed from container");
            break;
          }
        } else if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          if (
            mutation.attributeName === "style" &&
            target === overlayRef.current
          ) {
            const currentStyle = target.style.cssText;
            const cleanedStyle = currentStyle
              .replace(/transform:[^;]+;?\s*/, "")
              .trim();
            if (cleanedStyle !== initialStylesRef.current?.overlay) {
              restartOverlay("Primary overlay inline style tampered");
            }
          } else if (mutation.attributeName === "style") {
            restartOverlay(
              `Style attribute changed on ${target.tagName.toLowerCase()}`,
            );
          } else {
            restartOverlay(
              `Attribute ${mutation.attributeName} changed on ${target.tagName.toLowerCase()}`,
            );
          }
        }
      }
    });

    shadowObserver.observe(shadowRoot, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    shadowObserverRef.current = shadowObserver;
  }, [overlayText, restartOverlay]);

  const getRandomPosition = useCallback(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;

    if (!wrapper || !overlay) return { x: 0, y: 0 };

    const wrapperRect = wrapper.getBoundingClientRect();
    const estimatedOverlayWidth = (overlayText?.length || 5) * 15;
    const estimatedOverlayHeight = 30;

    const maxX = Math.max(0, wrapperRect.width - estimatedOverlayWidth);
    const maxY = Math.max(0, wrapperRect.height - estimatedOverlayHeight);

    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    };
  }, [overlayText]);

  const startRandomMovement = useCallback(() => {
    const moveToRandomPosition = () => {
      const overlay = overlayRef.current;
      const wrapper = wrapperRef.current;
      if (!overlay || !wrapper) return;

      const newPosition = getRandomPosition();
      overlay.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;

      const nextMoveDelay = 2000 + Math.random() * 3000;
      animationIdRef.current = window.setTimeout(
        moveToRandomPosition,
        nextMoveDelay,
      );
    };
    animationIdRef.current = window.setTimeout(moveToRandomPosition, 1500);
  }, [getRandomPosition]);

  const checkOverlayIntegrity = useCallback(() => {
    if (isLockedDownRef.current) return false;

    const wrapper = wrapperRef.current;
    const shadowHost = shadowHostRef.current;
    const shadowRoot = shadowRootRef.current;

    // ── 1. Structural presence ──────────────────────────────────────────────
    if (!wrapper || !shadowHost || !shadowRoot) {
      restartOverlay("Wrapper, shadow DOM, or host element missing");
      return false;
    }
    if (!document.contains(wrapper)) {
      restartOverlay("Wrapper removed from DOM");
      return false;
    }
    if (!wrapper.contains(shadowHost)) {
      restartOverlay("Shadow host detached from wrapper");
      return false;
    }
    if (!document.contains(shadowHost)) {
      restartOverlay("Shadow host removed from DOM");
      return false;
    }
    if (shadowRoot.children.length === 0) {
      restartOverlay("Shadow root empty");
      return false;
    }

    const container = containerRef.current;
    const primaryOverlay = overlayRef.current;
    const secondaryOverlay = secondaryOverlayRef.current;

    if (!container || !primaryOverlay || !secondaryOverlay) {
      restartOverlay("Overlay structure missing");
      return false;
    }
    if (!shadowRoot.contains(container)) {
      restartOverlay("Container detached from shadow root");
      return false;
    }
    if (!container.contains(primaryOverlay)) {
      restartOverlay("Primary overlay detached from container");
      return false;
    }
    if (!container.contains(secondaryOverlay)) {
      restartOverlay("Secondary overlay detached from container");
      return false;
    }

    // ── 2. Inline style integrity ───────────────────────────────────────────
    if (initialStylesRef.current) {
      if (wrapper.style.cssText !== initialStylesRef.current.wrapper) {
        restartOverlay("Wrapper inline style tampered");
        return false;
      }
      if (container.style.cssText !== initialStylesRef.current.container) {
        restartOverlay("Container inline style tampered");
        return false;
      }
      if (
        secondaryOverlay.style.cssText !== initialStylesRef.current.secondary
      ) {
        restartOverlay("Secondary overlay inline style tampered");
        return false;
      }
      const currentPrimaryStyle = primaryOverlay.style.cssText;
      const cleanedPrimaryStyle = currentPrimaryStyle
        .replace(/transform:[^;]+;?\s*/, "")
        .trim();
      if (cleanedPrimaryStyle !== initialStylesRef.current.overlay) {
        restartOverlay("Primary overlay inline style tampered");
        return false;
      }
    }

    // ── 3. Text content integrity ───────────────────────────────────────────
    if (
      primaryOverlay.textContent !== overlayText ||
      secondaryOverlay.textContent !== overlayText
    ) {
      restartOverlay("Overlay text content tampered");
      return false;
    }

    // ── 4. Computed style checks — wrapper ──────────────────────────────────
    const wrapperStyle = window.getComputedStyle(wrapper);

    // Direct class attribute changes are DOM mutations, but also check here so a
    // missed observer event or a remount race cannot bypass the guard.
    if (
      !wrapper.classList.contains(WRAPPER_CLASS_NAME) ||
      wrapper.className.trim() !== WRAPPER_CLASS_NAME
    ) {
      restartOverlay(
        `Wrapper class tampered: expected "${WRAPPER_CLASS_NAME}", got "${wrapper.className}"`,
      );
      return false;
    }

    if (
      wrapperStyle.display === "none" ||
      wrapperStyle.visibility === "hidden" ||
      parseFloat(wrapperStyle.opacity) < 0.1 ||
      wrapperStyle.transform !== "none"
    ) {
      restartOverlay("Wrapper hidden or transformed via CSS");
      return false;
    }

    if (wrapperStyle.position !== "relative") {
      restartOverlay(
        `Wrapper layout CSS tampered: expected position relative, got ${wrapperStyle.position}`,
      );
      return false;
    }

    // Stylesheet edits do not trigger MutationObserver. This catches changes
    // like .tamper-wrapper { height: 200px } from DevTools Styles panel.
    const wrapperHeight = wrapper.getBoundingClientRect().height;
    const expectedHeight = getExpectedHeight();
    if (
      !Number.isFinite(wrapperHeight) ||
      Math.abs(wrapperHeight - expectedHeight) > WRAPPER_HEIGHT_TOLERANCE_PX
    ) {
      restartOverlay(
        `Wrapper height tampered: expected ~${expectedHeight}px, got ${Math.round(wrapperHeight)}px`,
      );
      return false;
    }

    if (
      wrapperStyle.clipPath !== "none" ||
      wrapperStyle.filter !== "none" ||
      parseFloat(wrapperStyle.scale ?? "1") === 0
    ) {
      restartOverlay("Wrapper hidden via clip-path/filter/scale");
      return false;
    }

    // ── 5. Computed style checks — shadow host ──────────────────────────────
    const hostStyle = window.getComputedStyle(shadowHost);

    if (
      hostStyle.display === "none" ||
      hostStyle.visibility === "hidden" ||
      parseFloat(hostStyle.opacity) < 0.1 ||
      hostStyle.transform !== "none"
    ) {
      restartOverlay("Shadow host hidden or transformed via CSS");
      return false;
    }

    if (
      hostStyle.clipPath !== "none" ||
      hostStyle.filter !== "none" ||
      parseFloat(hostStyle.scale ?? "1") === 0
    ) {
      restartOverlay("Shadow host hidden via clip-path/filter/scale");
      return false;
    }

    // ── 6. Computed style checks — container ────────────────────────────────
    const containerComputed = window.getComputedStyle(container);

    if (
      containerComputed.display === "none" ||
      containerComputed.visibility === "hidden" ||
      parseFloat(containerComputed.opacity) < 0.1 ||
      containerComputed.transform !== "none"
    ) {
      restartOverlay("Container hidden or transformed via inherited CSS");
      return false;
    }

    if (
      containerComputed.clipPath !== "none" ||
      containerComputed.filter !== "none" ||
      parseFloat(containerComputed.scale ?? "1") === 0
    ) {
      restartOverlay("Container hidden via clip-path/filter/scale");
      return false;
    }

    // ── 7. Computed style checks — primary & secondary overlays ────────────
    const primaryComputed = window.getComputedStyle(primaryOverlay);
    const secondaryComputed = window.getComputedStyle(secondaryOverlay);

    for (const [label, computed] of [
      ["Primary overlay", primaryComputed],
      ["Secondary overlay", secondaryComputed],
    ] as [string, CSSStyleDeclaration][]) {
      if (
        computed.display === "none" ||
        computed.visibility === "hidden" ||
        parseFloat(computed.opacity) < 0.1 ||
        computed.clipPath !== "none" ||
        computed.filter !== "none" ||
        parseFloat(computed.scale ?? "1") === 0
      ) {
        restartOverlay(`${label} hidden via computed CSS`);
        return false;
      }
    }

    // ── 8. Ancestor walk ────────────────────────────────────────────────────
    let ancestor = wrapper.parentElement;
    while (ancestor && ancestor !== document.body) {
      const ancestorStyle = window.getComputedStyle(ancestor);
      if (
        ancestorStyle.display === "none" ||
        ancestorStyle.visibility === "hidden" ||
        parseFloat(ancestorStyle.opacity) < 0.1
      ) {
        restartOverlay(
          `Ancestor element hidden: ${ancestor.tagName.toLowerCase()}${ancestor.id ? `#${ancestor.id}` : ""}`,
        );
        return false;
      }
      ancestor = ancestor.parentElement;
    }

    return true;
  }, [overlayText, restartOverlay]);

  useEffect(() => {
    if (isLockedDownRef.current) return;

    const wrapper = wrapperRef.current;
    const shadowHost = shadowHostRef.current;

    if (!wrapper || !shadowHost) return;

    createShadowOverlay();

    const wrapperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length > 0) {
            let addedNodeStr = "";
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                addedNodeStr += node.tagName.toLowerCase();
              } else if (node instanceof Text) {
                addedNodeStr += node.textContent;
              }
            });
            restartOverlay(
              "Wrapper content tampered via DOM manipulation (nodes added): " +
                addedNodeStr,
            );
            return;
          }
          if (mutation.removedNodes.length > 0) {
            restartOverlay(
              "Wrapper content tampered via DOM manipulation (nodes removed)",
            );
            return;
          }
        } else if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            restartOverlay(
              `Wrapper class tampered: expected "${WRAPPER_CLASS_NAME}", got "${wrapper.className}"`,
            );
            return;
          }

          restartOverlay(
            `Wrapper attribute tampered: ${mutation.attributeName}`,
          );
        }
      });
    });

    wrapperObserver.observe(wrapper, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
    });

    wrapperObserverRef.current = wrapperObserver;

    const hostObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          restartOverlay("Shadow host content tampered via DOM manipulation");
        } else if (mutation.type === "attributes") {
          restartOverlay(`Host attribute tampered: ${mutation.attributeName}`);
        }
      });
    });

    hostObserver.observe(shadowHost, {
      attributes: true,
      childList: true,
    });

    const intervalId = setInterval(checkOverlayIntegrity, 1000);
    intervalIdRef.current = intervalId;

    setTimeout(() => startRandomMovement(), 100);
    setTimeout(() => checkOverlayIntegrity(), 50);

    return () => {
      hostObserver.disconnect();
      if (wrapperObserverRef.current) {
        wrapperObserverRef.current.disconnect();
        wrapperObserverRef.current = null;
      }
      if (shadowObserverRef.current) {
        shadowObserverRef.current.disconnect();
        shadowObserverRef.current = null;
      }
      clearInterval(intervalId);
      intervalIdRef.current = null;
      if (animationIdRef.current) clearTimeout(animationIdRef.current);
    };
  }, [
    restartKey,
    createShadowOverlay,
    checkOverlayIntegrity,
    restartOverlay,
    startRandomMovement,
    logTamperAttempt,
  ]);

  // ── Lockdown screen ─────────────────────────────────────────────────────
  if (lockdownReason) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: window?.innerWidth < 640 ? 300 : 520,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
            margin: 0,
          }}
        >
          Video unavailable
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={WRAPPER_CLASS_NAME}
      key={`wrapper-${restartKey}`}
    >
      {children}
      <div
        ref={shadowHostRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 999999,
          overflow: "hidden",
        }}
        key={`shadow-host-${restartKey}`}
      />
    </div>
  );
};

export default TamperResistantOverlay;
