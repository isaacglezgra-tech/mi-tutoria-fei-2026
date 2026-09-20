import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { Goal, GoalArea } from "@/lib/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/metas")({ component: GoalsPage });

function GoalsPage() {
  const t = useT();
  const goals = useApp((s) => s.goals);
  const upsertGoal = useApp((s) => s.upsertGoal);
  const removeGoal = useApp((s) => s.removeGoal);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  return (
    <main className="flex-1">
      <PageHeader
        title={t("goals")}
        action={
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("addGoal")}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-5" />
          </Button>
        }
      />
      <div className="px-4 pb-8 space-y-3">
        {goals.length === 0 ? (
          <p className="text-muted rounded-xl bg-cream p-5 fei-shadow">{t("emptyGoals")}</p>
        ) : (
          goals.map((g) => (
            <article key={g.id} className="rounded-xl bg-cream p-4 fei-shadow">
              <p className="text-xs uppercase tracking-wide text-gold-deep">{areaLabel(t, g.area)}</p>
              <h2 className="font-display text-xl text-navy mt-0.5">{g.title}</h2>
              {g.notes ? <p className="text-sm text-muted mt-1">{g.notes}</p> : null}
              <div className="mt-3 h-2 rounded-full bg-paper-2 overflow-hidden">
                <div
                  className="h-full bg-navy rounded-full transition-[width] duration-300"
                  style={{ width: `${g.progress}%` }}
                />
              </div>
              <p className="text-sm tabular-nums text-muted mt-1">
                {t("progressLabel")} {g.progress}%
              </p>
              <input
                type="range"
                min={0}
                max={100}
                value={g.progress}
                onChange={(e) => upsertGoal({ ...g, progress: Number(e.target.value) })}
                className="w-full mt-2 accent-navy"
                aria-label={t("progressLabel")}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(g);
                    setOpen(true);
                  }}
                >
                  {t("edit")}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeGoal(g.id)}>
                  {t("delete")}
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editing ? t("edit") : t("addGoal")}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            upsertGoal({
              id: editing?.id ?? uid(),
              title: String(fd.get("title")),
              area: String(fd.get("area")) as GoalArea,
              progress: Number(fd.get("progress") || 0),
              notes: String(fd.get("notes")),
            });
            setOpen(false);
          }}
        >
          <Field label={t("title")}>
            <Input name="title" required defaultValue={editing?.title ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("category")}>
              <NativeSelect name="area" defaultValue={editing?.area ?? "academic"}>
                <option value="academic">{t("areaAcademic")}</option>
                <option value="personal">{t("areaPersonal")}</option>
                <option value="wellbeing">{t("areaWellbeing")}</option>
                <option value="global">{t("areaGlobal")}</option>
              </NativeSelect>
            </Field>
            <Field label={`${t("progressLabel")} %`}>
              <Input name="progress" type="number" min={0} max={100} defaultValue={editing?.progress ?? 0} />
            </Field>
          </div>
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

function areaLabel(t: ReturnType<typeof useT>, a: GoalArea) {
  return {
    academic: t("areaAcademic"),
    personal: t("areaPersonal"),
    wellbeing: t("areaWellbeing"),
    global: t("areaGlobal"),
  }[a];
}
