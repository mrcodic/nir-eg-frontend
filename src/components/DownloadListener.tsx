'use client';

import { useDownload } from "@/hooks/useDownload";

export default function DownloadListener() {
  useDownload();
  return null;
}
