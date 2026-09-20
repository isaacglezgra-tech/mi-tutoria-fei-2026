import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Mail, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { MentoringSession, SessionStatus } from "@/lib/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/tutoria")({ component: TutoriaPage });

function TutoriaPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const profile = useApp((s) => s.profile);
  const sessions = useApp((s) => s.sessions);
  const agenda = useApp((s) => s.agenda);
  const setAgenda = useApp((s) => s.setAgenda);
  const upsertSession = useApp((s) => s.upsertSession);
  const removeSession = useApp((s) => s.removeSession);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MentoringSession | null>(null);

  const next = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return sessions
      .filter((s) => s.status === "upcoming" && s.date >= today)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [sessions]);

  const ordered = sessions.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="flex-1">
      <PageHeader
        title={t("mentoring")}
        action={
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("addSession")}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-5" />
          </Button>
        }
      />
      <div className="px-4 pb-8 space-y-4">
        <section className="rounded-xl bg-navy text-cream p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-gold-soft">{t("tutor")}</p>
          <h2 className="font-display text-2xl mt-1">{profile.tutorName}</h2>
          <p className="text-cream/75 text-sm mt-2">
            {t("office")}: {profile.tutorOffice}
          </p>
          <p className="text-cream/75 text-sm">{t("hours")}: {profile.tutorHours}</p>
          <a href={`mailto:${profile.tutorEmail}`} className="inline-flex mt-4">
            <Button variant="gold" size="sm">
              <Mail className="size-4" />
              {t("writeTutor")}
            </Button>
          </a>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("nextSession")}</h3>
          {next ? (
            <p className="mt-1 text-ink">
              {format(parseISO(next.date), "EEEE d MMMM", { locale })} · {next.time}
              <span className="block text-muted text-sm mt-1">{next.topic}</span>
            </p>
          ) : (
            <p className="text-muted mt-1">{t("noNextSession")}</p>
          )}
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("agenda")}</h3>
          <p className="text-sm text-muted mb-2">{t("agendaHint")}</p>
          <Textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} />
        </section>

        <p className="text-sm text-muted">{t("findTutor")}</p>
        <p className="text-sm text-muted">{t("evalTutor")}</p>

        <section>
          <h3 className="font-display text-lg text-navy mb-2">{t("sessions")}</h3>
          <ul className="space-y-2">
            {ordered.map((s) => (
              <li key={s.id} className="rounded-xl bg-cream p-4 fei-shadow">
                <p className="text-xs uppercase tracking-wide text-gold-deep">{statusLabel(t, s.status)}</p>
                <p className="font-medium text-navy mt-0.5">{s.topic}</p>
                <p className="text-sm text-muted">
                  {format(parseISO(s.date), "d MMM yyyy", { locale })} · {s.time}
                </p>
                {s.notes ? <p className="text-sm mt-2">{s.notes}</p> : null}
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(s);
                      setOpen(true);
                    }}
                  >
                    {t("edit")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeSession(s.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editing ? t("edit") : t("addSession")}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            upsertSession({
              id: editing?.id ?? uid(),
              date: String(fd.get("date")),
              time: String(fd.get("time")),
              topic: String(fd.get("topic")),
              notes: String(fd.get("notes")),
              status: String(fd.get("status")) as SessionStatus,
            });
            setOpen(false);
          }}
        >
          <Field label={t("topic")}>
            <Input name="topic" required defaultValue={editing?.topic ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("due")}>
              <Input name="date" type="date" required defaultValue={editing?.date ?? ""} />
            </Field>
            <Field label={t("time")}>
              <Input name="time" type="time" defaultValue={editing?.time ?? "11:00"} />
            </Field>
          </div>
          <Field label={t("status")}>
            <NativeSelect name="status" defaultValue={editing?.status ?? "upcoming"}>
              <option value="upcoming">{t("upcoming")}</option>
              <option value="done">{t("completed")}</option>
              <option value="missed">{t("missed")}</option>
            </NativeSelect>
          </Field>
          <Field label={t("notes")}>
            <Textarea name="notes" defaultValue={editing?.notes ?? ""} />
          </Field>
          <Button type="submit" className="w-full">
            {t("save")}
          </Button>
        </form>
      </Dialog>
    </main>
  );
}

function statusLabel(t: ReturnType<typeof useT>, s: SessionStatus) {
  return { upcoming: t("upcoming"), done: t("completed"), missed: t("missed") }[s];
}
