import React, { useState } from "react";
import { ReactMic } from "react-mic";
import Player from "react-wavy-audio";

export default function Mic({ setAudio }) {
  const [record, setRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const onStop = async (recorded) => {
    const blob = recorded.blob;
    const type = blob.type || "audio/webm";
    const ext = type.includes("webm")
      ? "webm"
      : type.includes("wav")
      ? "wav"
      : "mp3";

    const file = new File([blob], `recording-${Date.now()}.${ext}`, { type });
    setAudio((prev) => [...prev, file]);
    setAudioUrl(URL.createObjectURL(file));
  };

  return (
    <div className="App">
      <ReactMic
        record={record}
        onStop={onStop}
        strokeColor="#ee3ec9"
        backgroundColor="#f8fafc"
        className="w-full"
        mimeType="audio/webm"
      />

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        {!record ? (
          <button
            onClick={() => setRecord(true)}
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            ابدأ التسجيل
          </button>
        ) : (
          <button
            onClick={() => setRecord(false)}
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            أوقف التسجيل
          </button>
        )}
      </div>

      {audioUrl && (
        <div style={{ marginTop: 16 }}>
          <Player
            imageUrl="https://pbs.twimg.com/media/A-lU5FnCcAA1Edi.jpg"
            audioUrl={audioUrl}
            waveStyles={{
              cursorWidth: 1,
              progressColor: "#D9B45C",
              responsive: true,
              waveColor: "#FBF6F0",
              cursorColor: "transparent",
              barWidth: 0,
            }}
            zoom={0}
          />
        </div>
      )}
    </div>
  );
}
