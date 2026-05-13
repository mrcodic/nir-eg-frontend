"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { FileWarning } from "lucide-react";

type VideoBunnyProps = {
  response: {
    embed_url?: string;
    otp?: string;
    expires?: string | number;
  } | null;
  otpError: boolean;
  otpLoading: boolean;
};

export default function VideoBunny({
  response,
  otpError,
  otpLoading,
}: VideoBunnyProps) {
  const embedUrl = response?.embed_url;

  if (otpError) {
    return (
      <div className="bg-background flex min-h-[520px] items-center justify-center">
        <div className="flex items-center gap-2">
          <FileWarning className="stroke-red-500" />
          <p className="text-lg font-bold">حدث خطأ ما</p>
        </div>
      </div>
    );
  }

  if (otpLoading) {
    return <LoadingSpinner className="bg-primary-50 h-fit min-h-[520px]" />;
  }

  if (!embedUrl) {
    return (
      <div className="bg-background flex min-h-[520px] items-center justify-center">
        <div className="flex items-center gap-2">
          <FileWarning className="stroke-red-500" />
          <p className="text-lg font-bold">حدث خطأ ما</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embedUrl}
        loading="lazy"
        style={{ border: 0 }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title="Bunny Video"
      />
    </div>
  );
}
