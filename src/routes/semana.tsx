import { createFileRoute } from "@tanstack/react-router";
import { addDays, format, getISODay, isSameDay, startOfWeek } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { EventType, WeekBlock, Weekday } from "@/lib/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/semana")({ component: SemanaPage });

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function SemanaPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const blocks = useApp((s) => s.weekBlocks);
  const upsertBlock = useApp((s) => s.upsertBlock);
  const removeBlock = useApp((s) => s.removeBlock);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WeekBlock | null>(null);
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const [selected, setSelected] = useState(() => getISODay(now) as Weekday);

  const selectedDate = days[selected - 1];
  const list = blocks
    .filter((b) => b.weekday === selected)
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <main className="flex-1">
      <PageHeader
        title={t("week")}
        subtitle={t("thisWeek")}
        action={
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("addToWeek")}
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
        <div className="grid grid-cols-7 gap-1 mb-5">
          {days.map((day, i) => {
            const wd = (i + 1) as Weekday;
            const active = wd === selected;
            const today = isSameDay(day, now);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelected(wd)}
                className={`rounded-lg py-2 text-center ${
                  active ? "bg-navy text-cream" : "bg-cream text-ink fei-shadow"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wide opacity-80">{t(dayKeys[i])}</span>
                <span className="block font-display text-lg tabular-nums">{format(day, "d")}</span>
                {today && !active ? <span className="mx-auto mt-0.5 block size-1 rounded-full bg-gold" /> : null}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-muted mb-3">
          {format(selectedDate, "EEEE d MMMM", { locale })}
        </p>

        {list.length === 0 ? (
          <p className="text-muted rounded-xl bg-cream p-5 fei-shadow">{t("noClasses")}</p>
        ) : (
          <ul className="space-y-2">
            {list.map((b) => (
              <li key={b.id} className="rounded-xl bg-cream p-4 fei-shadow flex gap-3">
                <div className="w-16 shrink-0 text-sm tabular-nums text-navy font-medium">
                  {b.start}
                  <span className="block text-muted font-normal">{b.end}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-navy">{b.title}</p>
                  <p className="text-sm text-muted">
                    {b.place} · {typeLabel(t, b.type)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditing(b);
                        setOpen(true);
                      }}
                    >
                      {t("edit")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeBlock(b.id)}>
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BlockDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        defaultDay={selected}
        onSave={(block) => {
          upsertBlock(block);
          setOpen(false);
        }}
      />
    </main>
  );
}

function typeLabel(t: (k: "typeClass" | "typeTutoring" | "typeDeadline" | "typeWellbeing" | "typeFei") => string, type: EventType) {
  const map = {
    class: "typeClass",
    tutoring: "typeTutoring",
    deadline: "typeDeadline",
    wellbeing: "typeWellbeing",
    fei: "typeFei",
  } as const;
  return t(map[type]);
}

function BlockDialog({
  open,
  onOpenChange,
  initial,
  defaultDay,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: WeekBlock | null;
  defaultDay: Weekday;
  onSave: (b: WeekBlock) => void;
}) {
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={initial ? t("edit") : t("addToWeek")}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            id: initial?.id ?? uid(),
            weekday: Number(fd.get("weekday")) as Weekday,
            start: String(fd.get("start")),
            end: String(fd.get("end")),
            title: String(fd.get("title")),
            place: String(fd.get("place")),
            type: String(fd.get("type")) as EventType,
          });
        }}
      >
        <Field label={t("title")}>
          <Input name="title" required defaultValue={initial?.title ?? ""} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("weekday")}>
            <NativeSelect name="weekday" defaultValue={initial?.weekday ?? defaultDay}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {t(dayKeys[d - 1])}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label={t("type")}>
            <NativeSelect name="type" defaultValue={initial?.type ?? "class"}>
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
            <Input name="start" type="time" required defaultValue={initial?.start ?? "08:00"} />
          </Field>
          <Field label={t("fromTo")}>
            <Input name="end" type="time" required defaultValue={initial?.end ?? "09:30"} />
          </Field>
        </div>
        <Field label={t("place")}>
          <Input name="place" defaultValue={initial?.place ?? ""} />
        </Field>
        <Button type="submit" className="w-full">
          {t("save")}
        </Button>
      </form>
    </Dialog>
  );
}
