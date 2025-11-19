import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Mic, Pause, Play, StopCircle, Trash } from "lucide-react";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import { useToast } from "@/hooks/use-toast";

const VoiceMessageRecorder = ({ toggleRecorder, setAudios, isRecorder }) => {
  const recorderControls = useVoiceVisualizer();
  const { toast } = useToast();
  const {
    togglePauseResume,
    isPausedRecordedAudio,
    isAvailableRecordedAudio,
    isPausedRecording,
    isRecordingInProgress,
    startRecording,
    stopRecording,
    recordedBlob,
    clearCanvas,
    duration,
    error,
    recordingTime,
  } = recorderControls;

  const isPausedRecorded = isAvailableRecordedAudio && isPausedRecordedAudio;
  const isPausedLive = isRecordingInProgress && isPausedRecording;
  const showPlaybackControls =
    isAvailableRecordedAudio || isRecordingInProgress;

  const toggleStartStop = () => {
    if (isRecordingInProgress) {
      stopRecording();
    } else {
      toggleRecorder(true);
      clearCanvas();
      startRecording();

      // stop iframe video
      const iframeRef = document.getElementById("vdocipher-iframe");
      if (!iframeRef) return;
      const player = window?.VdoPlayer?.getInstance(iframeRef);
      player?.video?.pause();
    }
  };

  const handleDelete = () => {
    stopRecording();
    clearCanvas();
    setAudios([]);
    toggleRecorder(false);
  };

  useEffect(() => {
    if (recordedBlob && recordedBlob.size > 0) {
      const file = new File([recordedBlob], `voiceNote_${Date.now()}.webm`, {
        type: recordedBlob.type || "audio/webm",
      });
      console.log("file", file);
      setAudios([file]);
      // setAudios((prev) => [...prev, file]);
    }
  }, [recordedBlob, setAudios]);

  useEffect(() => {
    const errorName = error?.name;
    if (errorName) {
      toggleRecorder(false);
      setAudios([]);
    }
    switch (errorName) {
      case "NotAllowedError":
        toast({
          description: "Permission denied",
          icon: "error",
        });
        break;
      case "NotFoundError":
        toast({
          description: "Device not found",
          icon: "error",
        });
        break;
      case "NotReadableError":
        toast({
          description: "Device not readable",
          icon: "error",
        });
        break;
      case "OverconstrainedError":
        toast({
          description: "Device not overconstrained",
          icon: "error",
        });
        break;
      case "NotSupportedError":
        toast({
          description: "Device not supported",
          icon: "error",
        });
        break;
      case "SecurityError":
        toast({
          description: "Device not secure",
          icon: "error",
        });
        break;
      case "UnknownError":
        toast({
          description: "Device not unknown",
          icon: "error",
        });
        break;
      default:
        break;
    }
  }, [error]);

  // delete audio when isRecorder is false
  useEffect(() => {
    if (!isRecorder && recordedBlob) {
      handleDelete();
    }
  }, [isRecorder, recordedBlob]);

  const Timer = ({ duration }) => {
    const totalSeconds =
      typeof duration === "number" && duration >= 0
        ? Math.floor(duration / 1000)
        : 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return (
      <div
        className="shrink-0 text-xs text-customGray"
        role="timer"
        aria-label={`Duration: ${minutes} minutes and ${seconds} seconds`}
      >
        {formattedTime}
      </div>
    );
  };

  return (
    <div className=" flex  w-full  items-center gap-5 border-t border-gray-medium  ">
      <div className="flex w-full  gap-2">
        <div className="voice-recorder-container flex items-center gap-4 max-sm:flex-wrap-reverse grow">
          <div
            id="waveform"
            className="flex   grow items-center justify-center rounded-xl bg-gray-light"
          >
            <VoiceVisualizer
              controls={recorderControls}
              secondaryBarColor="#25D366"
              mainBarColor="#333"
              mainContainerClassName="w-0 max-w-full"
              height={32}
              barWidth={4}
              width={0}
              // width={
              //   isRecordingInProgress || isAvailableRecordedAudio ? "100%" : 0
              // }
              isControlPanelShown={false}
            />
          </div>

          {(isRecordingInProgress || isAvailableRecordedAudio) && (
            <Timer
              duration={isRecordingInProgress ? recordingTime : duration * 1000}
            />
          )}
        </div>

        <div className="flex  justify-between">
          <button
            className={cn(
              "flex size-8 items-center justify-center rounded-xl bg-gray-light",
              {
                "animate-pulse": isRecordingInProgress && !isPausedRecording,
              }
            )}
            onClick={toggleStartStop}
            aria-label={
              isRecordingInProgress ? "Stop recording" : "Start recording"
            }
          >
            {isRecordingInProgress ? (
              <StopCircle className="stroke-red-500" />
            ) : (
              <Mic className="stroke-green-500" />
            )}
          </button>

          {(isRecordingInProgress || isAvailableRecordedAudio) && (
            <button
              onClick={handleDelete}
              className="flex size-8 items-center justify-center rounded-xl bg-gray-light"
              aria-label="Delete recording"
            >
              <Trash className="size-6 stroke-customGray" />
            </button>
          )}

          {showPlaybackControls && (
            <button
              className="flex size-8 items-center justify-center rounded-xl bg-gray-light"
              onClick={togglePauseResume}
              aria-label={isPausedRecorded || isPausedLive ? "Play" : "Pause"}
              disabled={!isAvailableRecordedAudio && !isRecordingInProgress}
            >
              {isPausedRecorded || isPausedLive ? (
                <Play className="stroke-green-500" />
              ) : (
                <Pause className="stroke-customOrange" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessageRecorder;
