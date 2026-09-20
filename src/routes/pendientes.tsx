import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { Task, TaskCategory, TaskPriority } from "@/lib/types";
import { isoDate, uid } from "@/lib/utils";

export const Route = createFileRoute("/pendientes")({ component: TasksPage });

function TasksPage() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const locale = lang === "es" ? es : enUS;
  const tasks = useApp((s) => s.tasks);
  const upsertTask = useApp((s) => s.upsertTask);
  const toggleTask = useApp((s) => s.toggleTask);
  const removeTask = useApp((s) => s.removeTask);
  const clearDoneTasks = useApp((s) => s.clearDoneTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("pending");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const list = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === "pending") return !task.done;
      if (filter === "done") return task.done;
      return true;
    });
    return filtered.slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (a.due ?? "9999").localeCompare(b.due ?? "9999");
    });
  }, [tasks, filter]);

  const openCount = tasks.filter((task) => !task.done).length;

  return (
    <main className="flex-1">
      <PageHeader
        title={t("tasks")}
        subtitle={`${openCount} ${t("openTasks")}`}
        action={
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("addTask")}
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
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(["pending", "all", "done"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-9 px-3 rounded-full text-sm whitespace-nowrap ${
                filter === f ? "bg-navy text-cream" : "bg-cream text-ink fei-shadow"
              }`}
            >
              {t(f === "pending" ? "pending" : f === "done" ? "done" : "all")}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="text-muted rounded-xl bg-cream p-5 fei-shadow">{t("emptyTasks")}</p>
        ) : (
          <ul className="space-y-2">
            {list.map((task) => (
              <li key={task.id} className="rounded-xl bg-cream p-4 fei-shadow">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 size-6 rounded-full border-2 shrink-0 ${
                      task.done ? "bg-teal border-teal" : "border-line bg-paper"
                    }`}
                    aria-label={task.done ? t("restore") : t("complete")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-navy ${task.done ? "line-through opacity-60" : ""}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-muted mt-0.5">
                      {catLabel(t, task.category)} · {priLabel(t, task.priority)}
                      {task.due ? ` · ${format(parseISO(task.due), "d MMM", { locale })}` : ""}
                    </p>
                    {task.notes ? <p className="text-sm text-ink/80 mt-2">{task.notes}</p> : null}
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditing(task);
                          setOpen(true);
                        }}
                      >
                        {t("edit")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeTask(task.id)}>
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tasks.some((task) => task.done) ? (
          <Button variant="outline" className="mt-4 w-full" onClick={clearDoneTasks}>
            {t("clearDone")}
          </Button>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editing ? t("edit") : t("addTask")}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            upsertTask({
              id: editing?.id ?? uid(),
              title: String(fd.get("title")),
              notes: String(fd.get("notes")),
              category: String(fd.get("category")) as TaskCategory,
              priority: String(fd.get("priority")) as TaskPriority,
              due: String(fd.get("due") || "") || null,
              done: editing?.done ?? false,
              createdAt: editing?.createdAt ?? isoDate(),
            });
            setOpen(false);
          }}
        >
          <Field label={t("title")}>
            <Input name="title" required defaultValue={editing?.title ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("category")}>
              <NativeSelect name="category" defaultValue={editing?.category ?? "academic"}>
                <option value="academic">{t("catAcademic")}</option>
                <option value="mentoring">{t("catMentoring")}</option>
                <option value="wellbeing">{t("catWellbeing")}</option>
                <option value="personal">{t("catPersonal")}</option>
                <option value="fei">{t("catFei")}</option>
              </NativeSelect>
            </Field>
            <Field label={t("priority")}>
              <NativeSelect name="priority" defaultValue={editing?.priority ?? "med"}>
                <option value="high">{t("priHigh")}</option>
                <option value="med">{t("priMed")}</option>
                <option value="low">{t("priLow")}</option>
              </NativeSelect>
            </Field>
          </div>
          <Field label={t("due")}>
            <Input name="due" type="date" defaultValue={editing?.due ?? ""} />
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

function catLabel(t: ReturnType<typeof useT>, c: TaskCategory) {
  return {
    academic: t("catAcademic"),
    mentoring: t("catMentoring"),
    wellbeing: t("catWellbeing"),
    personal: t("catPersonal"),
    fei: t("catFei"),
  }[c];
}

function priLabel(t: ReturnType<typeof useT>, p: TaskPriority) {
  return { high: t("priHigh"), med: t("priMed"), low: t("priLow") }[p];
}
