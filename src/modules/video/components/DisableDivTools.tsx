"use client";

import { useEffect } from "react";

const DisableDevTools: React.FC = () => {
  useEffect(() => {
    const disableContextMenu = (e: Event) => e.preventDefault();
    const disableKeyShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") e.preventDefault();

      // Ctrl+Shift+I / J / C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
      }

      // Ctrl+U
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    // Attach to document
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeyShortcuts);

    // Attach to all iframes (same-origin only)
    const protectIframes = () => {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        try {
          const doc = iframe.contentDocument;
          if (doc) {
            doc.addEventListener("contextmenu", disableContextMenu);
            doc.addEventListener("keydown", disableKeyShortcuts);
          }
        } catch {
          // cross-origin iframe, cannot access
        }
      });
    };

    protectIframes();

    // Watch for dynamically added iframes/shadow DOM
    const observer = new MutationObserver(() => protectIframes());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeyShortcuts);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default DisableDevTools;
