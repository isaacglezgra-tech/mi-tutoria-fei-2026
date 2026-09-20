import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckSquare,
  Heart,
  LifeBuoy,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BrandLockup } from "@/components/fei-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useT } from "@/lib/hooks";
import { getNotices } from "@/lib/notices";
import { displayName, useApp } from "@/lib/store";
import { isoDate } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function greetingKey(hour: number) {
  if (hour < 12) return "morning" as const;
  if (hour < 19) return "afternoon" as const;
  return "evening" as const;
}

const tiles = [
  { to: "/semana", key: "week" as const, Icon: CalendarDays, className: "bg-violet-soft text-violet" },
  { to: "/pendientes", key: "tasks" as const, Icon: CheckSquare, className: "bg-teal-soft text-teal" },
  { to: "/calendario", key: "calendar" as const, Icon: Calendar, className: "bg-sky-soft text-sky" },
  { to: "/tutoria", key: "mentoring" as const, Icon: Users, className: "bg-sky-soft text-sky" },
  { to: "/metas", key: "goals" as const, Icon: Target, className: "bg-gold-soft text-gold-deep" },
  { to: "/bienestar", key: "wellbeing" as const, Icon: Heart, className: "bg-rose-soft text-rose" },
  { to: "/recursos", key: "resources" as const, Icon: BookOpen, className: "bg-navy text-cream" },
  { to: "/apoyo", key: "support" as const, Icon: LifeBuoy, className: "bg-sky-soft text-sky" },
];

function Home() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const tasks = useApp((s) => s.tasks);
  const moods = useApp((s) => s.moods);
  const sessions = useApp((s) => s.sessions);
  const [open, setOpen] = useState(false);
  const hour = new Date().getHours();
  const notices = useMemo(() => getNotices({ tasks, moods, sessions }), [tasks, moods, sessions]);
  const todayMood = moods.find((m) => m.date === isoDate());

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-navy text-cream min-h-[280px] md:min-h-[320px]">
        <img
          src="/hero-earth.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/30 via-navy/55 to-navy-deep/90" />
        <div className="relative px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <BrandLockup variant="dark" />
            </div>
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <LanguageToggle light />
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative size-11 rounded-md grid place-items-center bg-cream/10 hover:bg-cream/16"
                aria-label={t("notifications")}
              >
                <Bell className="size-5" />
                {notices.length > 0 ? (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-gold" />
                ) : null}
              </button>
            </div>
          </div>

          <p className="mt-8 text-gold-soft text-sm">
            {t(greetingKey(hour))}, {displayName(profile, lang)}
          </p>
          <h1 className="font-display text-3xl md:text-4xl mt-1 max-w-md">{t("heroLine")}</h1>
          <p className="mt-3 text-cream/75 text-sm max-w-sm">{t("tagline")}</p>
        </div>
      </section>

      <section className="px-4 -mt-5 pb-8">
        <div className="grid grid-cols-2 gap-3 stagger-in">
          {tiles.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className={`${tile.className} rounded-xl min-h-[118px] p-4 fei-shadow flex flex-col justify-between transition-transform active:scale-[0.98]`}
            >
              <tile.Icon className="size-7" strokeWidth={1.75} />
              <span className="font-display text-lg leading-tight">{t(tile.key)}</span>
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-cream p-4 fei-shadow">
          <p className="text-xs uppercase tracking-[0.14em] text-gold-deep font-semibold">{t("mentalYear")}</p>
          <p className="font-display text-lg text-navy mt-1">“{t("wellnessQuote")}”</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/bienestar">
              <Button size="sm" variant="gold">
                {t("wellToday")}
              </Button>
            </Link>
            {todayMood ? null : (
              <Link to="/apoyo">
                <Button size="sm" variant="outline">
                  {t("seeSupport")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen} title={t("notifications")}>
        {notices.length === 0 ? (
          <p className="text-muted">{t("noNotices")}</p>
        ) : (
          <ul className="space-y-2">
            {notices.map((n) => (
              <li key={n.id}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-cream p-3 fei-shadow"
                >
                  <p className="text-sm font-medium text-navy">{t(n.textKey)}</p>
                  {n.detail ? <p className="text-sm text-muted mt-0.5">{n.detail}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Dialog>
    </main>
  );
}
