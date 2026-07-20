import { Button } from "@/components/ui/button";
import { Headphones, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SummaryTemplateContent } from "@/types/summary-template.types";

function SummaryHero({ hero }: { hero: SummaryTemplateContent["hero"] }) {
  return (
    <section
      id="summary-home"
      className="scroll-mt-28 pt-36 pb-16 sm:pt-40 lg:pb-24"
    >
      <div className="wrapper grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="text-center lg:text-right">
          <span className="bg-secondary/15 text-secondary inline-flex rounded-full px-3 py-1 text-sm font-bold">
            {hero.eyebrow}
          </span>

          <h1 className="mt-5 text-4xl leading-[1.15] font-extrabold tracking-tight text-[#12304b] sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-500 lg:mx-0">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button asChild className="h-12 rounded-xl px-7 text-base">
              <Link href={hero.primaryAction.href}>
                <Rocket aria-hidden />
                {hero.primaryAction.label}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl px-7 text-base"
            >
              <Link href={hero.secondaryAction.href}>
                <Headphones aria-hidden />
                {hero.secondaryAction.label}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={hero.image}
              alt="طالبة تحمل جهازًا لوحيًا"
              fill
              priority
              className="object-contain"
              sizes="(min-width: 1024px) 32vw, 85vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SummaryHero;
