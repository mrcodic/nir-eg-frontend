"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <main className="flex items-center justify-center bg-muted">
      <div className="wrapper">
        <div className="mx-auto max-w-xl rounded-xl bg-card p-8 shadow-lg text-center">
          <h1 className="text-4xl font-bold text-dark-radial mb-3">حدث خطأ</h1>

          {/* Subtitle */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى، أو تحديث الصفحة.
          </p>

          {/* Error code (optional but helpful) */}
          {error?.message && (
            <p className="mb-6 text-xs text-muted-foreground">
              <span className="font-mono">{error.message}</span>
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset}>إعادة المحاولة</Button>

            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              تحديث الصفحة
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
