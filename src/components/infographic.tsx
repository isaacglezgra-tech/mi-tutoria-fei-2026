import { Link } from "@tanstack/react-router";
import { CalendarDays, Compass, Heart, Target } from "lucide-react";
import { BrandLockup } from "@/components/fei-mark";
import { infographicSteps, loc, pillars } from "@/lib/guide";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const pillarClass: Record<(typeof pillars)[number]["tone"], string> = {
  organiza: "bg-violet-soft text-violet",
  avanza: "bg-gold-soft text-gold-deep",
  cuidate: "bg-rose-soft text-rose",
  trasciende: "bg-sky-soft text-sky",
};

const pillarIcon = {
  organiza: CalendarDays,
  avanza: Target,
  cuidate: Heart,
  trasciende: Compass,
} as const;

export function InfographicPoster() {
  const t = useT();
  const lang = useApp((s) => s.lang);

  return (
    <article
      id="infografia"
      className="overflow-hidden rounded-xl bg-cream text-ink fei-shadow print:shadow-none print:rounded-none"
    >
      <header className="relative overflow-hidden bg-navy text-cream px-5 pt-5 pb-6">
        <img
          src="/hero-earth.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-navy/70 to-navy-deep" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <BrandLockup variant="dark" />
            <p className="text-gold-soft text-xs font-semibold tracking-[0.16em] uppercase pt-1">
              {t("appYear")}
            </p>
          </div>
          <p className="mt-5 text-gold-soft text-xs uppercase tracking-[0.16em] font-semibold">
            {t("guideKicker")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl mt-1 leading-tight">{t("guideHero")}</h2>
          <p className="mt-2 text-cream/80 text-sm max-w-md">{t("tagline")}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-paper-2">
        {pillars.map((p) => {
          const Icon = pillarIcon[p.tone];
          return (
            <div
              key={p.tone}
              className={cn("rounded-lg px-3 py-3 min-h-[92px] flex flex-col justify-between", pillarClass[p.tone])}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              <div>
                <p className="font-display text-base leading-tight">{loc(p, lang)}</p>
                <p className="text-xs mt-0.5 opacity-80">{lang === "es" ? p.hintEs : p.hintEn}</p>
              </div>
            </div>
          );
        })}
      </div>

      <ol className="grid md:grid-cols-2 gap-px bg-line">
        {infographicSteps.map((step) => {
          return (
            <li key={step.n} className="bg-cream">
              <Link
                to={step.to}
                className="flex gap-3 p-4 min-h-[108px] hover:bg-paper transition-colors"
              >
                <span className="size-9 shrink-0 rounded-full bg-navy text-gold-soft grid place-items-center font-display text-lg">
                  {step.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-navy leading-tight">{loc(step.title, lang)}</p>
                  <p className="text-sm text-muted mt-1">{loc(step.body, lang)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <footer className="bg-navy text-cream px-5 py-4">
        <p className="text-sm text-cream/85">{t("guidePrivacy")}</p>
        <p className="font-display text-gold-soft mt-2">{t("motto")}</p>
        <p className="text-xs text-cream/80 mt-2 leading-relaxed">{t("authorsLine")}</p>
        <p className="text-xs text-cream/55 mt-1">{t("feiShort")} · {t("appYear")}</p>
      </footer>
    </article>
  );
}
