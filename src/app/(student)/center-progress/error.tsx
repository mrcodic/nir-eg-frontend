"use client";

import Empty from "@/components/shared/Empty";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className="wrapper mt-28 mb-10 lg:mt-32" role="alert">
      <Empty isError text="تعذر تحميل بيانات الحضور والتقييمات">
        <Button onClick={reset}>إعادة المحاولة</Button>
      </Empty>
    </section>
  );
}
