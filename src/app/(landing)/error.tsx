"use client";

import { Button } from "@/components/ui/button";

export default function LandingError({ reset }: { reset: () => void }) {
  return (
    <section className="wrapper flex min-h-screen items-center justify-center py-12">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">تعذر تحميل الصفحة الرئيسية</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          نعتذر، تعذر تحميل محتوى الصفحة الرئيسية. يرجى المحاولة مرة أخرى
          لاحقًا.
        </p>
        <Button className="mt-6" onClick={reset}>
          إعادة المحاولة
        </Button>
      </div>
    </section>
  );
}
