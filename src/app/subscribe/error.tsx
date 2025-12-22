"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);
  return (
    <div className="flex items-center justify-center ">
      <main className="wrapper flex flex-col items-center">
        <div className="">
          <Image
            src="/error-ilustration.png"
            alt="error"
            width={500}
            height={281}
            className="max-w-full"
          />
        </div>

        <div className="text-center space-y-6">
          <h1 className="text-gradient-custom text-32 font-black">
            حدث خطأ ما!
          </h1>
          <p className="font-bold text-2xl">
            يمكنك المحاولة مرة أخرى، أو يمكنك التواصل معنا
          </p>
        </div>

        <div className="flex items-center gap-6 justify-center mt-10 flex-wrap">
          <Button onClick={reset}>حاول مرة أخرى</Button>

          <Link href="/" className="inline-block ">
            <Button
              variant="outline"
              className="border-gray-light text-gray-dark font-bold hover:bg-gray-dark hover:text-gray-light"
            >
              العودة إلى الرئيسية
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ErrorPage;
