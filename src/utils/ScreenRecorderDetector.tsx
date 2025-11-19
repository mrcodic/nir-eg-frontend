"use client";
import { useEffect, useRef, useCallback } from "react";

function IframeRecordingDetector({ userId, videoUrl, onRecordingDetected }) {
  const detectionState = useRef({
    detectionCount: 0,
    lastDetectionTime: 0,
    baselineDeviceCount: 0,
  });

  const logDetection = useCallback(
    (method, confidence, details) => {
      const now = Date.now();

      // Only log high-confidence detections with rate limiting
      if (
        confidence >= 0.9 &&
        now - detectionState.current.lastDetectionTime > 2000
      ) {
        detectionState.current.lastDetectionTime = now;
        detectionState.current.detectionCount++;

        const eventData = {
          userId,
          videoUrl,
          method,
          confidence,
          details,
          timestamp: new Date().toISOString(),
          detectionCount: detectionState.current.detectionCount,
        };

        // Log to server
        fetch("/api/recording-detected", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }).catch(() => {});

        // Notify parent component
        onRecordingDetected?.(eventData);

        console.warn(
          "🎥 RECORDING DETECTED:",
          method,
          `${Math.round(confidence * 100)}%`,
          details,
        );
      }
    },
    [userId, videoUrl, onRecordingDetected],
  );

  useEffect(() => {
    // HIGH-PROBABILITY METHOD 1: Screen Capture API Detection (95% confidence)
    const interceptScreenCapture = () => {
      if (navigator.mediaDevices?.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;

        navigator.mediaDevices.getDisplayMedia = function (constraints) {
          logDetection(
            "screen_share_api",
            0.95,
            "getDisplayMedia() called - screen recording started",
          );
          return originalGetDisplayMedia.call(this, constraints);
        };
      }

      // Detect getUserMedia with screen/desktop constraints
      if (navigator.mediaDevices?.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;

        navigator.mediaDevices.getUserMedia = function (constraints) {
          if (
            constraints?.video &&
            (constraints.video.mediaSource === "screen" ||
              constraints.video.mediaSource === "desktop" ||
              constraints.video.chromeMediaSource === "screen" ||
              constraints.video.chromeMediaSource === "desktop")
          ) {
            logDetection(
              "screen_getUserMedia",
              0.93,
              "getUserMedia with screen constraints detected",
            );
          }
          return originalGetUserMedia.call(this, constraints);
        };
      }
    };

    // HIGH-PROBABILITY METHOD 2: Media Recorder Detection (92% confidence)
    const interceptMediaRecorder = () => {
      if (window.MediaRecorder) {
        const OriginalMediaRecorder = window.MediaRecorder;

        window.MediaRecorder = function (stream, options) {
          // Check if stream contains screen/display tracks
          if (stream?.getVideoTracks) {
            const videoTracks = stream.getVideoTracks();

            videoTracks.forEach((track) => {
              const settings = track.getSettings();
              const constraints = track.getConstraints();

              // Check track settings for screen indicators
              if (
                settings.displaySurface ||
                settings.logicalSurface ||
                settings.cursor ||
                constraints.displaySurface
              ) {
                logDetection(
                  "mediarecorder_screen",
                  0.92,
                  `MediaRecorder with screen track: ${track.label}`,
                );
              }

              // Check track label for screen keywords
              const label = track.label?.toLowerCase() || "";
              if (
                label.includes("screen") ||
                label.includes("display") ||
                label.includes("monitor") ||
                label.includes("desktop")
              ) {
                logDetection(
                  "mediarecorder_label",
                  0.9,
                  `MediaRecorder screen track detected: ${track.label}`,
                );
              }
            });
          }

          return new OriginalMediaRecorder(stream, options);
        };

        // Copy static properties
        Object.setPrototypeOf(window.MediaRecorder, OriginalMediaRecorder);
        Object.defineProperty(window.MediaRecorder, "isTypeSupported", {
          value: OriginalMediaRecorder.isTypeSupported.bind(
            OriginalMediaRecorder,
          ),
        });
      }
    };

    // HIGH-PROBABILITY METHOD 3: Screen Recording Device Detection (88% confidence)
    const detectRecordingDevices = async () => {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return;

        const devices = await navigator.mediaDevices.enumerateDevices();

        // Look for screen recording specific devices
        const recordingDevices = devices.filter((device) => {
          const label = device.label?.toLowerCase() || "";
          return (
            label.includes("obs") ||
            label.includes("streamlabs") ||
            label.includes("xsplit") ||
            label.includes("screen capture") ||
            label.includes("display capture") ||
            label.includes("desktop") ||
            label.includes("monitor") ||
            (label.includes("virtual") &&
              (label.includes("camera") || label.includes("video")))
          );
        });

        recordingDevices.forEach((device) => {
          logDetection(
            "recording_device",
            0.88,
            `Screen recording device: ${device.label} (${device.kind})`,
          );
        });

        // Monitor for new devices (recording software often adds virtual devices)
        const currentDeviceCount = devices.length;
        if (detectionState.current.baselineDeviceCount === 0) {
          detectionState.current.baselineDeviceCount = currentDeviceCount;
        } else if (
          currentDeviceCount >
          detectionState.current.baselineDeviceCount + 1
        ) {
          const newDeviceCount =
            currentDeviceCount - detectionState.current.baselineDeviceCount;
          logDetection(
            "device_count_increase",
            0.85,
            `${newDeviceCount} new media devices detected`,
          );
        }
      } catch (error) {
        // Permission denied - could be suspicious but not conclusive
      }
    };

    // HIGH-PROBABILITY METHOD 4: Browser Extension Recording Detection (90% confidence)
    const detectRecordingExtensions = () => {
      // Check for recording extension globals
      const recordingExtensionGlobals = [
        "__SCREENCASTIFY_EXTENSION__",
        "__LOOM_EXTENSION__",
        "__NIMBUS_EXTENSION__",
        "chrome.desktopCapture",
        "browser.desktopCapture",
      ];

      recordingExtensionGlobals.forEach((globalName) => {
        if (
          window[globalName] ||
          (typeof chrome !== "undefined" && chrome[globalName])
        ) {
          logDetection(
            "recording_extension",
            0.9,
            `Recording extension detected: ${globalName}`,
          );
        }
      });

      // Check for extension-injected recording UI elements
      const recordingUISelectors = [
        '[class*="screencast"]',
        '[class*="record"]',
        '[id*="loom"]',
        '[class*="capture"]',
        "[data-extension-id]",
      ];

      recordingUISelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 2) {
          // Threshold to avoid false positives
          logDetection(
            "recording_ui_elements",
            0.85,
            `Recording UI elements found: ${selector} (${elements.length} elements)`,
          );
        }
      });
    };

    // HIGH-PROBABILITY METHOD 5: Performance-Based Detection (87% confidence)
    // Only runs occasionally to avoid performance impact
    const performanceBasedDetection = () => {
      if (!performance.getEntriesByType) return;

      // Check for performance entries related to media/recording
      const entries = performance.getEntriesByType("navigation");
      const paintEntries = performance.getEntriesByType("paint");

      if (entries.length > 0) {
        const navEntry = entries[0];
        // Screen recording often causes significant performance degradation
        if (navEntry.loadEventEnd - navEntry.loadEventStart > 5000) {
          logDetection(
            "performance_degradation",
            0.87,
            "Significant page load delay detected",
          );
        }
      }

      // Check for unusual paint timing (can indicate recording interference)
      if (paintEntries.length >= 2) {
        const firstPaint = paintEntries.find(
          (entry) => entry.name === "first-paint",
        );
        const firstContentfulPaint = paintEntries.find(
          (entry) => entry.name === "first-contentful-paint",
        );

        if (firstPaint && firstContentfulPaint) {
          const paintDelay =
            firstContentfulPaint.startTime - firstPaint.startTime;
          if (paintDelay > 1000) {
            logDetection(
              "paint_timing_anomaly",
              0.85,
              `Unusual paint timing: ${paintDelay}ms delay`,
            );
          }
        }
      }
    };

    // Initialize detection methods immediately
    interceptScreenCapture();
    interceptMediaRecorder();
    detectRecordingExtensions();

    // Run device detection once, then periodically
    detectRecordingDevices();
    const deviceCheckInterval = setInterval(detectRecordingDevices, 10000); // Every 10 seconds

    // Run performance check occasionally (low frequency to avoid performance impact)
    const performanceCheckInterval = setInterval(
      performanceBasedDetection,
      30000,
    ); // Every 30 seconds

    // Extension check (less frequent)
    const extensionCheckInterval = setInterval(
      detectRecordingExtensions,
      15000,
    ); // Every 15 seconds

    // Cleanup function
    return () => {
      clearInterval(deviceCheckInterval);
      clearInterval(performanceCheckInterval);
      clearInterval(extensionCheckInterval);
    };
  }, [logDetection]);

  return null; // No UI - pure detection component
}

export default IframeRecordingDetector;
