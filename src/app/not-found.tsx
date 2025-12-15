import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center bg-muted">
      <div className="wrapper">
        <div className="mx-auto max-w-xl rounded-xl bg-card p-8 shadow-lg text-center">
          <h1 className="text-4xl font-bold text-dark-radial mb-3">
            الصفحة غير موجودة
          </h1>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            الصفحة التي تحاول الوصول إليها غير متوفرة أو تم نقلها.
          </p>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
