import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO, subDays } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { Mood } from "@/lib/types";
import { isoDate } from "@/lib/utils";

export const Route = createFileRoute("/progreso")({ component: ProgressPage });

const moodScore: Record<Mood, number> = {
  great: 5,
  good: 4,
  neutral: 3,
  challenging: 2,
  support: 1,
};

function ProgressPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const tasks = useApp((s) => s.tasks);
  const goals = useApp((s) => s.goals);
  const moods = useApp((s) => s.moods);
  const habits = useApp((s) => s.habits);

  const done = tasks.filter((x) => x.done).length;
  const goalAvg = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => isoDate(subDays(new Date(), 6 - i)));
  const moodData = last7.map((d) => {
    const entry = moods.find((m) => m.date === d);
    return {
      day: format(parseISO(d), "EE", { locale }),
      score: entry ? moodScore[entry.mood] : 0,
    };
  });

  const habitHits = last7.reduce((acc, d) => acc + habits.filter((h) => h.checks[d]).length, 0);
  const habitTotal = habits.length * 7;
  const weekMoods = moods.filter((m) => last7.includes(m.date));
  const moodAvg = weekMoods.length
    ? (weekMoods.reduce((a, m) => a + moodScore[m.mood], 0) / weekMoods.length).toFixed(1)
    : "—";

  const stats = [
    { label: t("tasksDone"), value: `${done} / ${tasks.length}` },
    { label: t("moodAvg"), value: String(moodAvg) },
    { label: t("goalsAvg"), value: `${goalAvg}%` },
    { label: t("habitsWeek"), value: `${habitHits} / ${habitTotal}` },
  ];

  return (
    <main className="flex-1">
      <PageHeader title={t("progress")} subtitle={t("thisMonth")} />
      <div className="px-4 pb-8">
        <p className="text-muted mb-4">{t("statsIntro")}</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((s) => (
            <article key={s.label} className="rounded-xl bg-cream p-4 fei-shadow">
              <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
              <p className="font-display text-2xl text-navy tabular-nums mt-1">{s.value}</p>
            </article>
          ))}
        </div>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h2 className="font-display text-lg text-navy mb-3">{t("weekMood")}</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData}>
                <CartesianGrid stroke="#E8E2D6" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip
                  cursor={{ fill: "rgba(11,33,64,0.06)" }}
                  contentStyle={{ borderRadius: 12, border: "none", background: "#FFFAF2" }}
                />
                <Bar dataKey="score" fill="#0B2140" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-4 space-y-3">
          {goals.map((g) => (
            <article key={g.id} className="rounded-xl bg-cream p-4 fei-shadow">
              <div className="flex justify-between gap-3">
                <p className="font-medium text-navy">{g.title}</p>
                <p className="tabular-nums text-sm text-muted">{g.progress}%</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-paper-2 overflow-hidden">
                <div className="h-full bg-gold-deep" style={{ width: `${g.progress}%` }} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
