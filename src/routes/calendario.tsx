import { createFileRoute } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
} from "date-fns";
import { enUS, es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { CalEvent, EventType } from "@/lib/types";
import { isoDate, uid } from "@/lib/utils";

export const Route = createFileRoute("/calendario")({ component: CalendarPage });

function CalendarPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const events = useApp((s) => s.events);
  const upsertEvent = useApp((s) => s.upsertEvent);
  const removeEvent = useApp((s) => s.removeEvent);
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalEvent | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedKey = isoDate(selected);
  const dayEvents = events
    .filter((e) => e.date === selectedKey)
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));

  const byDate = useMemo(() => {
    const map = new Set(events.map((e) => e.date));
    return map;
  }, [events]);

  const labels = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];

  return (
    <main className="flex-1">
      <PageHeader
        title={t("calendar")}
        subtitle={format(cursor, "MMMM yyyy", { locale })}
        action={
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("addEvent")}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-5" />
          </Button>
        }
      />
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <Button size="icon" variant="ghost" onClick={() => setCursor(subMonths(cursor, 1))} aria-label="prev">
            <ChevronLeft className="size-5" />
          </Button>
          <p className="font-display text-lg text-navy capitalize">{format(cursor, "MMMM yyyy", { locale })}</p>
          <Button size="icon" variant="ghost" onClick={() => setCursor(addMonths(cursor, 1))} aria-label="next">
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {labels.map((l) => (
            <div key={l} className="text-center text-[10px] uppercase tracking-wide text-muted py-1">
              {l}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 rounded-xl bg-cream p-2 fei-shadow">
          {days.map((day) => {
            const key = isoDate(day);
            const inMonth = isSameMonth(day, cursor);
            const active = isSameDay(day, selected);
            const today = isSameDay(day, new Date());
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={`aspect-square rounded-md text-sm tabular-nums relative ${
                  active ? "bg-navy text-cream" : inMonth ? "text-ink hover:bg-paper-2" : "text-muted/50"
                }`}
              >
                {format(day, "d")}
                {byDate.has(key) ? (
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full ${active ? "bg-gold" : "bg-gold-deep"}`} />
                ) : null}
                {today && !active ? (
                  <span className="absolute inset-0 rounded-md ring-1 ring-gold pointer-events-none" />
                ) : null}
              </button>
            );
          })}
        </div>

        <h2 className="font-display text-lg text-navy mt-5 mb-2">{t("selectedDay")}</h2>
        {dayEvents.length === 0 ? (
          <p className="text-muted rounded-xl bg-cream p-5 fei-shadow">{t("emptyEvents")}</p>
        ) : (
          <ul className="space-y-2">
            {dayEvents.map((ev) => (
              <li key={ev.id} className="rounded-xl bg-cream p-4 fei-shadow">
                <p className="text-xs uppercase tracking-wide text-gold-deep">{typeLabel(t, ev.type)}</p>
                <p className="font-medium text-navy mt-0.5">{ev.title}</p>
                <p className="text-sm text-muted">
                  {ev.time}
                  {ev.endTime ? ` – ${ev.endTime}` : ""} {ev.place ? `· ${ev.place}` : ""}
                </p>
                {ev.notes ? <p className="text-sm mt-2">{ev.notes}</p> : null}
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(ev);
                      setOpen(true);
                    }}
                  >
                    {t("edit")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeEvent(ev.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editing ? t("edit") : t("addEvent")}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            upsertEvent({
              id: editing?.id ?? uid(),
              title: String(fd.get("title")),
              date: String(fd.get("date")),
              time: String(fd.get("time")),
              endTime: String(fd.get("endTime")),
              type: String(fd.get("type")) as EventType,
              place: String(fd.get("place")),
              notes: String(fd.get("notes")),
            });
            setOpen(false);
          }}
        >
          <Field label={t("title")}>
            <Input name="title" required defaultValue={editing?.title ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("due")}>
              <Input name="date" type="date" required defaultValue={editing?.date ?? selectedKey} />
            </Field>
            <Field label={t("type")}>
              <NativeSelect name="type" defaultValue={editing?.type ?? "fei"}>
                <option value="class">{t("typeClass")}</option>
                <option value="tutoring">{t("typeTutoring")}</option>
                <option value="deadline">{t("typeDeadline")}</option>
                <option value="wellbeing">{t("typeWellbeing")}</option>
                <option value="fei">{t("typeFei")}</option>
              </NativeSelect>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("time")}>
              <Input name="time" type="time" defaultValue={editing?.time ?? "09:00"} />
            </Field>
            <Field label={t("fromTo")}>
              <Input name="endTime" type="time" defaultValue={editing?.endTime ?? "10:00"} />
            </Field>
          </div>
          <Field label={t("place")}>
            <Input name="place" defaultValue={editing?.place ?? ""} />
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

function typeLabel(
  t: ReturnType<typeof useT>,
  type: EventType,
) {
  return {
    class: t("typeClass"),
    tutoring: t("typeTutoring"),
    deadline: t("typeDeadline"),
    wellbeing: t("typeWellbeing"),
    fei: t("typeFei"),
  }[type];
}
