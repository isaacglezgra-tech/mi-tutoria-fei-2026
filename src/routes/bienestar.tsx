import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format, startOfWeek, type Locale } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Dumbbell, Eye, Footprints, HeartHandshake, Pause, Play, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { Mood } from "@/lib/types";
import { cn, isoDate } from "@/lib/utils";

export const Route = createFileRoute("/bienestar")({ component: WellbeingPage });

const moods: { id: Mood; key: "moodGreat" | "moodGood" | "moodNeutral" | "moodChallenge" | "moodSupport"; ring: string; face: string }[] = [
  { id: "great", key: "moodGreat", ring: "bg-ok/15 text-ok", face: "M9 14c1.2 2 2.8 3 5 3s3.8-1 5-3 M9 9.5h.01M15 9.5h.01" },
  { id: "good", key: "moodGood", ring: "bg-teal-soft text-teal", face: "M9 13.5c1 1.4 2.4 2.2 5 2.2s4-0.8 5-2.2 M9 9.5h.01M15 9.5h.01" },
  { id: "neutral", key: "moodNeutral", ring: "bg-gold-soft text-gold-deep", face: "M9 14h6 M9 9.5h.01M15 9.5h.01" },
  { id: "challenging", key: "moodChallenge", ring: "bg-paper-2 text-navy-soft", face: "M9 15c1-1.4 2.4-2 5-2s4 0.6 5 2 M9 9.5h.01M15 9.5h.01" },
  { id: "support", key: "moodSupport", ring: "bg-rose-soft text-rose", face: "M9 15.5c1.2-2 2.8-3 5-3s3.8 1 5 3 M9 9.5h.01M15 9.5h.01" },
];

function Face({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d={d} strokeLinecap="round" />
    </svg>
  );
}

function WellbeingPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const [tab, setTab] = useState<"today" | "week" | "resources">("today");
  const moodsLog = useApp((s) => s.moods);
  const setMood = useApp((s) => s.setMood);
  const today = isoDate();
  const todayMood = moodsLog.find((m) => m.date === today);
  const [note, setNote] = useState(todayMood?.note ?? "");

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  return (
    <main className="flex-1">
      <PageHeader title={t("wellbeing")} subtitle={t("mentalYear")} />
      <div className="px-4 pb-8">
        <div className="flex gap-1 p-1 rounded-full bg-paper-2 mb-5">
          {(
            [
              ["today", t("today")],
              ["week", t("weekTab")],
              ["resources", t("resourcesTab")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 h-10 rounded-full text-sm font-medium",
                tab === id ? "bg-navy text-cream" : "text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "today" ? (
          <div className="space-y-5">
            <section className="rounded-xl bg-cream p-4 fei-shadow">
              <h2 className="font-display text-xl text-navy">{t("howFeel")}</h2>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {moods.map((m) => {
                  const active = todayMood?.mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMood(m.id, note);
                        toast.success(t("moodSaved"));
                        if (m.id === "support") toast.message(t("seeSupport"));
                      }}
                      className={cn(
                        "rounded-lg py-2 px-1 flex flex-col items-center gap-1 min-h-20",
                        m.ring,
                        active && "ring-2 ring-navy",
                      )}
                    >
                      <Face d={m.face} className="size-8" />
                      <span className="text-xs leading-tight text-center">{t(m.key)}</span>
                    </button>
                  );
                })}
              </div>
              <Textarea
                className="mt-3"
                placeholder={t("moodNote")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={() => todayMood && setMood(todayMood.mood, note)}
              />
              <p className="text-sm text-muted mt-3 italic">“{t("wellnessQuote")}”</p>
            </section>

            <Breaks />
            <HabitsWeek weekDays={weekDays} locale={locale} />
          </div>
        ) : null}

        {tab === "week" ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-navy">{t("weekMood")}</h2>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((d) => {
                const key = isoDate(d);
                const entry = moodsLog.find((m) => m.date === key);
                const spec = moods.find((m) => m.id === entry?.mood);
                return (
                  <div key={key} className="rounded-lg bg-cream p-2 fei-shadow text-center min-h-24">
                    <p className="text-[10px] uppercase text-muted">{format(d, "EEE", { locale })}</p>
                    {spec ? (
                      <Face d={spec.face} className={cn("size-8 mx-auto mt-2", spec.ring.split(" ").pop())} />
                    ) : (
                      <p className="text-muted text-lg mt-3">·</p>
                    )}
                  </div>
                );
              })}
            </div>
            <HabitsWeek weekDays={weekDays} locale={locale} />
          </div>
        ) : null}

        {tab === "resources" ? (
          <div className="space-y-3">
            <StressPanel />
            <Link to="/apoyo" className="block rounded-xl bg-rose-soft text-rose p-4">
              <HeartHandshake className="size-6 mb-2" />
              <p className="font-display text-lg">{t("support")}</p>
              <p className="text-sm opacity-80">{t("crisisBody")}</p>
            </Link>
            <article className="rounded-xl bg-cream p-4 fei-shadow">
              <p className="font-display text-lg text-navy">{t("supportRes")}</p>
              <p className="text-sm text-muted mt-1">{t("emotionalHelpBody")}</p>
            </article>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function HabitsWeek({ weekDays, locale }: { weekDays: Date[]; locale: Locale }) {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const habits = useApp((s) => s.habits);
  const toggleHabit = useApp((s) => s.toggleHabit);

  return (
    <section className="rounded-xl bg-cream p-4 fei-shadow">
      <h3 className="font-display text-lg text-navy">{t("habits")}</h3>
      <p className="text-xs text-muted mb-3">{t("habitStreak")}</p>
      <ul className="space-y-3">
        {habits.map((h) => (
          <li key={h.id}>
            <p className="text-sm font-medium text-navy mb-1">{lang === "es" ? h.titleEs : h.titleEn}</p>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((d) => {
                const key = isoDate(d);
                const on = !!h.checks[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleHabit(h.id, key)}
                    className={cn(
                      "h-9 rounded-md text-[10px] tabular-nums",
                      on ? "bg-teal text-cream" : "bg-paper-2 text-muted",
                    )}
                    aria-pressed={on}
                    aria-label={`${format(d, "EEE d", { locale })}`}
                  >
                    {format(d, "d")}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Breaks() {
  const t = useT();
  const items = [
    { id: "stretch", mins: 3, Icon: Dumbbell, title: t("stretch"), hint: t("stretchHint") },
    { id: "walk", mins: 5, Icon: Footprints, title: t("walk"), hint: t("walkHint") },
    { id: "eyes", mins: 1, Icon: Eye, title: t("eyes"), hint: t("eyesHint") },
    { id: "shoulders", mins: 2, Icon: Wind, title: t("shoulders"), hint: t("shouldersHint") },
  ];
  const [active, setActive] = useState<string | null>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!active || left <= 0) return;
    const id = window.setInterval(() => setLeft((n) => n - 1), 1000);
    return () => window.clearInterval(id);
  }, [active, left]);

  return (
    <section className="rounded-xl bg-cream p-4 fei-shadow">
      <h3 className="font-display text-lg text-navy">{t("breaks")}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => {
          const running = active === it.id && left > 0;
          return (
            <li key={it.id} className="rounded-lg bg-paper p-3">
              <div className="flex items-center gap-3">
                <it.Icon className="size-5 text-teal" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy">{it.title}</p>
                  <p className="text-xs text-muted">{it.mins} {t("min")}</p>
                </div>
                <Button
                  size="sm"
                  variant={running ? "outline" : "soft"}
                  onClick={() => {
                    if (running) {
                      setActive(null);
                      setLeft(0);
                    } else {
                      setActive(it.id);
                      setLeft(it.mins * 60);
                    }
                  }}
                >
                  {running ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : t("startTimer")}
                </Button>
              </div>
              <p className="text-sm text-muted mt-2">{it.hint}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StressPanel() {
  const t = useT();
  const phases = [t("inhale"), t("hold"), t("exhale"), t("hold")];
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => {
      setPhase((p) => {
        const next = (p + 1) % 4;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, [on]);

  return (
    <section className="rounded-xl bg-navy text-cream p-5">
      <h3 className="font-display text-xl">{t("breatheTitle")}</h3>
      <p className="text-cream/70 text-sm mt-1">{t("breatheHint")}</p>
      <div className="grid place-items-center py-8">
        <div
          className={cn(
            "size-32 rounded-full bg-gold/80 grid place-items-center text-navy font-display text-lg",
            on && "breath-orb",
          )}
        >
          {on ? phases[phase] : t("startBreath")}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gold-soft tabular-nums">
          {t("cycle")} {cycle}
        </p>
        <Button
          variant="gold"
          size="sm"
          onClick={() => {
            setOn((v) => !v);
            if (on) {
              setPhase(0);
              setCycle(1);
            }
          }}
        >
          {on ? <Pause className="size-4" /> : <Play className="size-4" />}
          {on ? t("stopBreath") : t("startBreath")}
        </Button>
      </div>
      <div className="mt-5 border-t border-cream/15 pt-4">
        <p className="font-display text-lg">{t("groundTitle")}</p>
        <ol className="mt-2 space-y-1 text-sm text-cream/80 list-decimal pl-4">
          <li>{t("ground5")}</li>
          <li>{t("ground4")}</li>
          <li>{t("ground3")}</li>
          <li>{t("ground2")}</li>
          <li>{t("ground1")}</li>
        </ol>
      </div>
    </section>
  );
}
