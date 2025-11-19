"use client";

import { useEffect, useRef, useCallback } from "react";
import { postTamperAttempt } from "./api";

function DevToolsDetector({ videoSrc }) {
  const debouncedLogRef = useRef(null);

  const detectionState = useRef({
    isDevToolsOpen: false,
    detectionCount: 0,
    lastDetectionTime: 0,
    baselineWidth: window.innerWidth,
    baselineHeight: window.innerHeight,
  });

  const logDetection = useCallback(
    async (method, confidence, details) => {
      const now = Date.now();

      // Debounce logging to avoid spamming
      if (debouncedLogRef.current && now - debouncedLogRef.current < 3000) {
        return;
      }

      // Avoid spam logging - only log if significant time has passed or high confidence
      if (
        confidence > 0.8 ||
        now - detectionState.current.lastDetectionTime > 5000
      ) {
        detectionState.current.lastDetectionTime = now;
        detectionState.current.detectionCount++;

        // Log to server
        const message = `🚨 DevTools Detection: ${method}, ${details}`;

        const timestamp = new Date().toISOString();
        console.log(message);

        // await postTamperAttempt({
        //   message,
        //   timestamp,
        // });

        debouncedLogRef.current = Date.now();

        console.warn();
      }
    },
    [videoSrc]
  );

  useEffect(() => {
    // PRIMARY METHOD: Enhanced Debugger Detection (95% reliability)
    const debuggerDetection = () => {
      try {
        const threshold = 100; // milliseconds
        let devtoolsOpen = false;

        // Method 1: Direct debugger timing
        const start1 = performance.now();
        debugger;
        const time1 = performance.now() - start1;

        if (time1 > threshold) {
          devtoolsOpen = true;
        }

        // Method 2: Function constructor debugger (harder to detect/bypass)
        const start2 = performance.now();
        const debugFunc = new Function("debugger")();
        const time2 = performance.now() - start2;

        if (time2 > threshold) {
          devtoolsOpen = true;
        }

        // Method 3: Eval debugger (another layer)
        const start3 = performance.now();
        eval("debugger");
        const time3 = performance.now() - start3;

        if (time3 > threshold) {
          devtoolsOpen = true;
        }

        if (devtoolsOpen) {
          const totalTime = time1 + time2 + time3;
          logDetection(
            "debugger_detection",
            0.95,
            `DevTools paused execution for ${totalTime.toFixed(2)}ms`
          );

          // Set flag to avoid repeated detections
          if (!detectionState.current.isDevToolsOpen) {
            detectionState.current.isDevToolsOpen = true;
          }
        } else {
          // Reset flag if DevTools appears to be closed
          detectionState.current.isDevToolsOpen = false;
        }
      } catch (e) {
        // Debugger statements might throw in some contexts
      }
    };

    // KEYBOARD SHORTCUT PREVENTION AND DETECTION
    const handleKeyDown = (e) => {
      const devToolsShortcuts = [
        { key: "F12", name: "F12" },
        {
          ctrlKey: true,
          shiftKey: true,
          key: "I",
          name: "Ctrl+Shift+I (Inspect)",
        },
        {
          ctrlKey: true,
          shiftKey: true,
          key: "C",
          name: "Ctrl+Shift+C (Select Element)",
        },
        {
          ctrlKey: true,
          shiftKey: true,
          key: "J",
          name: "Ctrl+Shift+J (Console)",
        },
        {
          ctrlKey: true,
          shiftKey: true,
          key: "K",
          name: "Ctrl+Shift+K (Console Firefox)",
        },
        { ctrlKey: true, key: "U", name: "Ctrl+U (View Source)" },
        { key: "F1", name: "F1 (Help - can open DevTools)" },
      ];

      devToolsShortcuts.forEach((shortcut) => {
        const matches =
          (!shortcut.ctrlKey || e.ctrlKey) &&
          (!shortcut.shiftKey || e.shiftKey) &&
          (!shortcut.altKey || e.altKey) &&
          shortcut.key === e.key;

        if (matches) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          logDetection(
            "blocked_shortcut",
            0.95,
            `Blocked DevTools shortcut: ${shortcut.name}`
          );

          // Trigger immediate debugger detection after shortcut attempt
          setTimeout(debuggerDetection, 100);

          return false;
        }
      });
    };

    // Context menu detection and prevention
    const handleContextMenu = (e) => {
      // Log context menu attempts
      logDetection(
        "context_menu_attempt",
        0.6,
        `Context menu at: (${e.clientX}, ${e.clientY})`
      );

      // Prevent context menu (optional - might hurt UX)
      // e.preventDefault();

      // Trigger debugger detection after context menu
      setTimeout(debuggerDetection, 200);
    };

    // Detect focus changes that might indicate DevTools opening
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTimeout(() => {
          debuggerDetection();
        }, 100);
      }
    };

    // Set up detection intervals
    const debuggerInterval = setInterval(debuggerDetection, 1000); // Check every second

    // Add event listeners with capture phase for better control
    document.addEventListener("keydown", handleKeyDown, true);
    // document.addEventListener("keyup", handleKeyDown, true); // Also capture keyup
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Disable right-click selection text (optional)
    document.addEventListener("selectstart", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    });

    // Initial detection
    setTimeout(debuggerDetection, 500);

    // Anti-tamper: Check if our detection is being interfered with
    const antiTamperCheck = () => {
      // Check if our intervals are still running
      if (!debuggerInterval._destroyed) {
        // Interval is still active
      } else {
        logDetection(
          "tampering_detected",
          0.9,
          "Detection interval was destroyed"
        );
      }
    };

    const antiTamperInterval = setInterval(antiTamperCheck, 5000);

    // Cleanup function
    return () => {
      clearInterval(debuggerInterval);
      clearInterval(antiTamperInterval);

      document.removeEventListener("keydown", handleKeyDown, true);
      // document.removeEventListener("keyup", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("selectstart", (e) => {
        if (e.ctrlKey) e.preventDefault();
      });
    };
  }, [logDetection]);

  return null;
}

export default DevToolsDetector;
