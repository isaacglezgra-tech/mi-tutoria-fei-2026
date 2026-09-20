import { differenceInCalendarDays, parseISO } from "date-fns";
import type { MsgKey } from "./i18n";
import type { AppState } from "./types";
import { isoDate } from "./utils";

export interface Notice {
  id: string;
  textKey: MsgKey;
  detail: string;
  to: string;
}

export function getNotices(state: Pick<AppState, "tasks" | "sessions" | "moods">): Notice[] {
  const today = isoDate();
  const out: Notice[] = [];

  if (!state.moods.some((m) => m.date === today)) {
    out.push({ id: "mood", textKey: "noticeMood", detail: "", to: "/bienestar" });
  }

  for (const task of state.tasks) {
    if (task.done || !task.due) continue;
    const diff = differenceInCalendarDays(parseISO(task.due), parseISO(today));
    if (diff === 0) out.push({ id: `due-${task.id}`, textKey: "dueToday", detail: task.title, to: "/pendientes" });
    else if (diff > 0 && diff <= 2)
      out.push({ id: `soon-${task.id}`, textKey: "dueSoon", detail: task.title, to: "/pendientes" });
  }

  for (const s of state.sessions.filter((s) => s.status === "upcoming")) {
    const diff = differenceInCalendarDays(parseISO(s.date), parseISO(today));
    if (diff >= 0 && diff <= 2)
      out.push({ id: `ses-${s.id}`, textKey: "sessionTomorrow", detail: s.topic, to: "/tutoria" });
  }

  return out;
}
