import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { Mic, Pause, Play, StopCircle, Trash } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useVoiceVisualizer } from "react-voice-visualizer";

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
      className="text-customGray shrink-0 text-xs"
      role="timer"
      aria-label={`Duration: ${minutes} minutes and ${seconds} seconds`}
    >
      {formattedTime}
    </div>
  );
};

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

  const toggleStartStop = async () => {
    if (isRecordingInProgress) {
      stopRecording();
    } else {
      // Check for an available audio input device before starting
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some((d) => d.kind === "audioinput");
        if (!hasMic) {
          toast({
            description: "لم يتم العثور على جهاز تسجيل صوتي",
            icon: "error",
          });
          return;
        }
      } catch {
        toast({
          description: "تعذّر الوصول إلى أجهزة الوسائط",
          icon: "error",
        });
        return;
      }

      toggleRecorder(true);
      clearCanvas();
      startRecording();

      // Pause whichever video provider is currently active (VdoCipher or Bunny)
      useVideoPlayerStore.getState().pause();
    }
  };

  const handleDelete = useCallback(() => {
    stopRecording();
    clearCanvas();
    setAudios([]);
    toggleRecorder(false);
  }, [clearCanvas, setAudios, stopRecording, toggleRecorder]);

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
          description: "تم رفض الإذن بالوصول إلى الميكروفون",
          icon: "error",
        });
        break;
      case "NotFoundError":
        toast({
          description: "لم يتم العثور على جهاز تسجيل صوتي",
          icon: "error",
        });
        break;
      case "NotReadableError":
        toast({
          description: "تعذّر قراءة بيانات الجهاز، يرجى التحقق منه",
          icon: "error",
        });
        break;
      case "OverconstrainedError":
        toast({
          description: "لا يستوفي الجهاز المتطلبات المطلوبة",
          icon: "error",
        });
        break;
      case "NotSupportedError":
        toast({
          description: "الجهاز غير مدعوم في هذا المتصفح",
          icon: "error",
        });
        break;
      case "SecurityError":
        toast({
          description: "تم حظر الوصول لأسباب أمنية",
          icon: "error",
        });
        break;
      case "UnknownError":
        toast({
          description: "حدث خطأ غير معروف، يرجى المحاولة مرة أخرى",
          icon: "error",
        });
        break;
      default:
        break;
    }
  }, [error, setAudios, toast, toggleRecorder]);

  // delete audio when isRecorder is false
  useEffect(() => {
    if (!isRecorder && recordedBlob) {
      handleDelete();
    }
  }, [handleDelete, isRecorder, recordedBlob]);

  return (
    <div className="flex items-center gap-2">
      {/* <div className="voice-recorder-container flex grow items-center gap-4 empty:hidden max-sm:flex-wrap-reverse">
        <div
          id="waveform"
          className="hidden grow items-center justify-center rounded-xl"
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
      </div> */}

      {(isRecordingInProgress || isAvailableRecordedAudio) && (
        <Timer
          duration={isRecordingInProgress ? recordingTime : duration * 1000}
        />
      )}

      <div className="flex justify-between gap-2">
        <button
          className={cn(
            "flex size-8 items-center justify-center rounded-xl bg-white",
            {
              "animate-pulse": isRecordingInProgress && !isPausedRecording,
            },
          )}
          onClick={toggleStartStop}
          aria-label={
            isRecordingInProgress ? "Stop recording" : "Start recording"
          }
        >
          {isRecordingInProgress ? (
            <StopCircle className="stroke-red-500" />
          ) : (
            <Mic className="stroke-primary-800" />
          )}
        </button>

        {(isRecordingInProgress || isAvailableRecordedAudio) && (
          <button
            onClick={handleDelete}
            className="flex size-8 items-center justify-center rounded-xl bg-white"
            aria-label="Delete recording"
          >
            <Trash className="stroke-customGray size-6" />
          </button>
        )}

        {showPlaybackControls && (
          <button
            className="flex size-8 items-center justify-center rounded-xl bg-white"
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
  );
};

export default VoiceMessageRecorder;
