"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DateTime } from "luxon";
import { postTamperAttempt } from "./api";

interface VideoWrapperProps {
  children: ReactNode;
  text?: string;
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
  const lastTamperRef = useRef<string>("");
  const animationIdRef = useRef<number | null>(null);

  const [student] = useState(() => {
    return localStorage.getItem("student")
      ? JSON.parse(localStorage.getItem("student") as string)
      : null;
  });

  const overlayText = text || student?.id;

  const logTamperAttempt = useCallback(async (message: string) => {
    if (
      debouncedLogRef.current &&
      Date.now() - debouncedLogRef.current < 5000
    ) {
      return;
    }
    if (lastTamperRef.current !== message) {
      const timestamp = DateTime.utc().toMillis();
      // console.log(`[TAMPER DETECTED] ${timestamp}: ${message}`);
      lastTamperRef.current = message;

      await postTamperAttempt({
        message,
        timestamp,
        userAgent: navigator?.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
      });

      debouncedLogRef.current = Date.now();
    }
  }, []);

  const restartOverlay = useCallback(
    (tamperMessage: string) => {
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

      setRestartKey((prev) => prev + 1);
      setTimeout(() => {
        lastTamperRef.current = "";
      }, 2000);
    },
    [logTamperAttempt]
  );

  const createShadowOverlay = useCallback(() => {
    const shadowHost = shadowHostRef.current;
    const wrapper = wrapperRef.current;
    if (!shadowHost || !wrapper) return;

    // Check if shadow root already exists
    if (shadowRootRef.current) {
      console.log("Shadow root already exists, skipping creation");
      return;
    }

    // Try to reuse existing shadow root if it exists
    let shadowRoot = shadowRootRef.current;

    if (!shadowRoot) {
      try {
        shadowRoot = shadowHost.attachShadow({ mode: "closed" });
        shadowRootRef.current = shadowRoot;
      } catch (error) {
        // Shadow root already exists (shouldn't happen with our check, but just in case)
        console.error("Failed to attach shadow-sm root:", error);
        return;
      }
    }

    // Clear any existing content
    shadowRoot.innerHTML = "";

    // Container
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

    // Primary overlay
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

    // Secondary overlay
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

    // Watch for tampering inside the shadow root
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
            restartOverlay("Container element removed from shadow-sm root");
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
            // Allow transform changes on primary overlay
            const currentStyle = target.style.cssText;
            const cleanedStyle = currentStyle
              .replace(/transform:[^;]+;?\s*/, "")
              .trim();
            if (cleanedStyle !== initialStylesRef.current?.overlay) {
              restartOverlay("Primary overlay inline style tampered");
            }
          } else if (mutation.attributeName === "style") {
            restartOverlay(
              `Style attribute changed on ${target.tagName.toLowerCase()}`
            );
          } else {
            restartOverlay(
              `Attribute ${
                mutation.attributeName
              } changed on ${target.tagName.toLowerCase()}`
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
        nextMoveDelay
      );
    };
    animationIdRef.current = window.setTimeout(moveToRandomPosition, 1500);
  }, [getRandomPosition]);

  const checkOverlayIntegrity = useCallback(() => {
    const wrapper = wrapperRef.current;
    const shadowHost = shadowHostRef.current;
    const shadowRoot = shadowRootRef.current;
    if (!wrapper || !shadowHost || !shadowRoot) {
      restartOverlay("Wrapper, shadow-sm DOM, or host element missing");
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
      restartOverlay("Container detached from shadow-sm root");
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

    if (
      primaryOverlay.textContent !== `${overlayText}` ||
      secondaryOverlay.textContent !== `${overlayText}`
    ) {
      restartOverlay("Overlay text content tampered");
      return false;
    }

    const wrapperStyle = window.getComputedStyle(wrapper);
    if (
      wrapperStyle.display === "none" ||
      wrapperStyle.visibility === "hidden" ||
      parseFloat(wrapperStyle.opacity) < 1 ||
      wrapperStyle.transform !== "none"
    ) {
      restartOverlay("Wrapper hidden or transformed via CSS");
      return false;
    }

    const hostStyle = window.getComputedStyle(shadowHost);

    if (
      hostStyle.display === "none" ||
      hostStyle.visibility === "hidden" ||
      parseFloat(hostStyle.opacity) < 1 ||
      hostStyle.transform !== "none"
    ) {
      restartOverlay("Shadow host hidden or transformed via CSS");
      return false;
    }

    // Check for inherited CSS properties that might affect visibility or transform
    const containerComputed = window.getComputedStyle(container);
    if (
      containerComputed.display === "none" ||
      containerComputed.visibility === "hidden" ||
      parseFloat(containerComputed.opacity) < 1 ||
      containerComputed.transform !== "none"
    ) {
      restartOverlay("Container hidden or transformed via inherited CSS");
      return false;
    }

    return true;
  }, [overlayText, restartOverlay]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const shadowHost = shadowHostRef.current;

    if (!wrapper || !shadowHost) return;

    createShadowOverlay();

    // Observer on wrapper (external tampering)
    const wrapperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Check if added nodes are Grammarly-related
          // const isGrammarlyAddition = Array.from(mutation.addedNodes).every(
          //   (node) =>
          //     node instanceof HTMLElement &&
          //     (node.tagName.toLowerCase() === "grammarly-extension" ||
          //       node.classList.contains("dnXmp"))
          // );

          // Ignore Grammarly additions
          if (mutation.addedNodes.length > 0) {
            let addedNodeStr = "";

            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                addedNodeStr += node.tagName.toLowerCase();
              } else if (node instanceof Text) {
                addedNodeStr += node.textContent;
              }
            });

            logTamperAttempt(
              "Wrapper content tampered via DOM manipulation (nodes added)" +
                addedNodeStr
            );
            return;
          }

          // Trigger tampering if any nodes were removed (e.g., shadow host)
          if (mutation.removedNodes.length > 0) {
            restartOverlay(
              "Wrapper content tampered via DOM manipulation (nodes removed)"
            );
            return;
          }
        } else if (mutation.type === "attributes") {
          restartOverlay(
            `Wrapper attribute tampered: ${mutation.attributeName}`
          );
        }
      });
    });

    wrapperObserver.observe(wrapper, {
      attributes: true,
      childList: true,
    });

    wrapperObserverRef.current = wrapperObserver;

    // Observer on shadowHost itself (external tampering)
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
      if (animationIdRef.current) clearTimeout(animationIdRef.current);
    };
  }, [
    restartKey,
    createShadowOverlay,
    checkOverlayIntegrity,
    restartOverlay,
    startRandomMovement,
  ]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: "520px",
        overflow: "hidden",
      }}
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
