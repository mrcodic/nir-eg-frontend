"use client";

import WavesurferPlayer from "@wavesurfer/react";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
// import { useMediaQuery } from "usehooks-ts";
import WaveSurfer from "wavesurfer.js";

const AudioMessage = ({ audioUrl }: { audioUrl: string }) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //   const isDesktop = useMediaQuery("(min-width: 768px)", {});

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause()!;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative flex w-full items-center gap-4">
        <button className="min-w-10" onClick={onPlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <div
          //   key={isDesktop ? 1 : 2}
          id="waveform"
          className="h-10 min-h-0 w-full md:h-20"
        >
          <WavesurferPlayer
            waveColor={"#4E4C4B"}
            progressColor={"#E88A60"}
            url={`/api/proxy?url=${audioUrl}`}
            onReady={(ws) => onReady(ws)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            barGap={2}
            barWidth={3}
            barHeight={5}
            normalize
            height={80}
            // height={isDesktop ? 80 : 40}
          />
        </div>
      </div>
      <span className="ms-auto h-4 text-tiny text-customGray">
        {((wavesurfer?.getDuration() || 0) / 100)?.toFixed(2) || "00.00"}
      </span>
    </div>
  );
};

export default AudioMessage;
