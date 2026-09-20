import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, getISODay, startOfWeek, subDays } from "date-fns";
import { isoDate } from "./utils";
import type {
  AppState,
  CalEvent,
  Goal,
  Habit,
  Lang,
  MentoringSession,
  Mood,
  Profile,
  Task,
  WeekBlock,
} from "./types";

function seed(now = new Date()): Omit<AppState, "lang" | "onboarded"> {
  const today = isoDate(now);
  const mon = startOfWeek(now, { weekStartsOn: 1 });
  const d = (offset: number) => isoDate(addDays(mon, offset));
  const past = (n: number) => isoDate(subDays(now, n));
  let n = 0;
  const id = () => `seed-${++n}`;

  const profile: Profile = {
    name: "",
    studentId: "",
    program: "lei",
    semester: 5,
    campus: "parral",
    tutorName: "Mtra. Carolina Moriel Seáñez",
    tutorEmail: "academico.fei@uach.mx",
    tutorOffice: "Cubículo FEI",
    tutorHours: "Mar y Jue 10:00–12:00",
  };

  const weekBlocks: WeekBlock[] = [
    { id: id(), weekday: 1, start: "08:00", end: "09:30", title: "Econometría I", place: "Aula 12", type: "class" },
    { id: id(), weekday: 1, start: "10:00", end: "11:30", title: "Inglés V", place: "Lab. idiomas", type: "class" },
    { id: id(), weekday: 2, start: "09:00", end: "10:30", title: "Economía internacional", place: "Aula 8", type: "class" },
    { id: id(), weekday: 2, start: "11:00", end: "12:00", title: "Tutoría", place: "Cubículo FEI", type: "tutoring" },
    { id: id(), weekday: 3, start: "08:00", end: "09:30", title: "Introducción a las finanzas", place: "Aula 12", type: "class" },
    { id: id(), weekday: 3, start: "12:00", end: "13:30", title: "Macroeconomía II", place: "Aula 4", type: "class" },
    { id: id(), weekday: 4, start: "09:00", end: "10:30", title: "Economía internacional", place: "Aula 8", type: "class" },
    { id: id(), weekday: 4, start: "16:00", end: "16:20", title: "Pausa activa", place: "Patio", type: "wellbeing" },
    { id: id(), weekday: 5, start: "08:00", end: "09:30", title: "Econometría I", place: "Aula 12", type: "class" },
    { id: id(), weekday: 5, start: "10:00", end: "11:30", title: "Macroeconomía II", place: "Aula 4", type: "class" },
  ];

  const tasks: Task[] = [
    {
      id: id(),
      title: "Entregar práctica 3 de Econometría",
      notes: "Regresión múltiple, archivo .do y PDF.",
      category: "academic",
      priority: "high",
      due: d(3),
      done: false,
      createdAt: today,
    },
    {
      id: id(),
      title: "Leer cap. 4 de Krugman — comercio",
      notes: "Preparar 3 preguntas para clase.",
      category: "academic",
      priority: "med",
      due: d(1),
      done: false,
      createdAt: today,
    },
    {
      id: id(),
      title: "Completar ficha de diagnóstico SEGA",
      notes: "sega.uach.mx · apartado tutorías",
      category: "mentoring",
      priority: "high",
      due: d(4),
      done: false,
      createdAt: today,
    },
    {
      id: id(),
      title: "Revisar convocatoria de movilidad",
      notes: "Destinos Asia-Pacífico y Europa.",
      category: "fei",
      priority: "med",
      due: d(8),
      done: false,
      createdAt: today,
    },
    {
      id: id(),
      title: "Pausa de 10 minutos entre clases",
      notes: "Caminar el patio, sin celular.",
      category: "wellbeing",
      priority: "low",
      due: today,
      done: false,
      createdAt: today,
    },
    {
      id: id(),
      title: "Subir ensayo de inglés V",
      notes: "Moodle · 800 palabras",
      category: "academic",
      priority: "med",
      due: past(2),
      done: true,
      createdAt: past(6),
    },
  ];

  const events: CalEvent[] = [
    {
      id: id(),
      title: "Sesión de tutoría",
      date: d(1),
      time: "11:00",
      endTime: "12:00",
      type: "tutoring",
      place: "Cubículo FEI",
      notes: "Seguimiento de materias y carga.",
    },
    {
      id: id(),
      title: "Examen parcial — Econometría I",
      date: d(9),
      time: "08:00",
      endTime: "09:30",
      type: "deadline",
      place: "Aula 12",
      notes: "Temas 1 a 4.",
    },
    {
      id: id(),
      title: "Círculo de lectura FEI",
      date: d(3),
      time: "17:00",
      endTime: "18:30",
      type: "fei",
      place: "Sala de usos múltiples",
      notes: "Economía y bien común.",
    },
    {
      id: id(),
      title: "Taller de respiración y enfoque",
      date: d(2),
      time: "13:30",
      endTime: "14:00",
      type: "wellbeing",
      place: "Aula 2",
      notes: "Año de la salud mental UACH.",
    },
  ];

  const goals: Goal[] = [
    { id: id(), title: "Promedio 8.8 este semestre", area: "academic", progress: 62, notes: "Econometría pide más práctica." },
    { id: id(), title: "Certificar inglés B2", area: "global", progress: 40, notes: "Simulacro en noviembre." },
    { id: id(), title: "Asistir a todas las tutorías", area: "academic", progress: 75, notes: "Una sesión ya realizada." },
    { id: id(), title: "Dormir 7 horas al menos 5 noches", area: "wellbeing", progress: 48, notes: "Cerrar pantallas a las 23:00." },
  ];

  const tue = getISODay(now) <= 2 ? d(1) : isoDate(addDays(now, ((2 - getISODay(now) + 7) % 7) || 7));

  const sessions: MentoringSession[] = [
    {
      id: id(),
      date: past(12),
      time: "11:00",
      topic: "Diagnóstico inicial y carga académica",
      notes: "Identificar Econometría como materia de mayor esfuerzo.",
      status: "done",
    },
    {
      id: id(),
      date: tue,
      time: "11:00",
      topic: "Seguimiento de materias y bienestar",
      notes: "",
      status: "upcoming",
    },
  ];

  const moodCycle: Mood[] = ["good", "great", "neutral", "good", "challenging", "good", "neutral", "great", "good", "support"];
  const moods = moodCycle.map((mood, i) => ({
    date: past(moodCycle.length - 1 - i),
    mood,
    note: "",
  }));

  const habits: Habit[] = [
    { id: id(), titleEs: "Agua durante el día", titleEn: "Water through the day", checks: {} },
    { id: id(), titleEs: "Caminar 20 minutos", titleEn: "Walk 20 minutes", checks: {} },
    { id: id(), titleEs: "Lectura académica 30 min", titleEn: "Academic reading 30 min", checks: {} },
    { id: id(), titleEs: "Sin pantallas 30 min antes de dormir", titleEn: "Screens off 30 min before sleep", checks: {} },
    { id: id(), titleEs: "Hablar con alguien de confianza", titleEn: "Talk with someone you trust", checks: {} },
  ].map((h, idx) => {
    const checks: Record<string, boolean> = {};
    for (let i = 6; i >= 0; i--) {
      const day = past(i);
      checks[day] = (idx + i) % 3 !== 0;
    }
    return { ...h, checks };
  });

  return {
    profile,
    tasks,
    events,
    goals,
    sessions,
    moods,
    habits,
    weekBlocks,
    agenda: "Dudas de la práctica 3 · cómo organizar el parcial · sueño irregular",
    supportNotes: [],
  };
}

const seeded = seed();

interface Actions {
  setLang: (lang: Lang) => void;
  setOnboarded: () => void;
  setProfile: (profile: Profile) => void;
  upsertTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearDoneTasks: () => void;
  upsertEvent: (event: CalEvent) => void;
  removeEvent: (id: string) => void;
  upsertGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  upsertSession: (session: MentoringSession) => void;
  removeSession: (id: string) => void;
  setAgenda: (agenda: string) => void;
  setMood: (mood: Mood, note: string) => void;
  toggleHabit: (id: string, date: string) => void;
  upsertBlock: (block: WeekBlock) => void;
  removeBlock: (id: string) => void;
  addSupportNote: (note: string) => void;
  removeSupportNote: (index: number) => void;
  importAll: (data: AppState) => void;
  reset: () => void;
}

export const useApp = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      lang: "es",
      onboarded: true,
      ...seeded,
      setLang: (lang) => set({ lang }),
      setOnboarded: () => set({ onboarded: true }),
      setProfile: (profile) => set({ profile }),
      upsertTask: (task) =>
        set({
          tasks: get().tasks.some((t) => t.id === task.id)
            ? get().tasks.map((t) => (t.id === task.id ? task : t))
            : [task, ...get().tasks],
        }),
      removeTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        }),
      clearDoneTasks: () => set({ tasks: get().tasks.filter((t) => !t.done) }),
      upsertEvent: (event) =>
        set({
          events: get().events.some((e) => e.id === event.id)
            ? get().events.map((e) => (e.id === event.id ? event : e))
            : [event, ...get().events],
        }),
      removeEvent: (id) => set({ events: get().events.filter((e) => e.id !== id) }),
      upsertGoal: (goal) =>
        set({
          goals: get().goals.some((g) => g.id === goal.id)
            ? get().goals.map((g) => (g.id === goal.id ? goal : g))
            : [goal, ...get().goals],
        }),
      removeGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),
      upsertSession: (session) =>
        set({
          sessions: get().sessions.some((s) => s.id === session.id)
            ? get().sessions.map((s) => (s.id === session.id ? session : s))
            : [session, ...get().sessions],
        }),
      removeSession: (id) => set({ sessions: get().sessions.filter((s) => s.id !== id) }),
      setAgenda: (agenda) => set({ agenda }),
      setMood: (mood, note) => {
        const date = isoDate();
        const rest = get().moods.filter((m) => m.date !== date);
        set({ moods: [...rest, { date, mood, note }] });
      },
      toggleHabit: (id, date) =>
        set({
          habits: get().habits.map((h) =>
            h.id === id ? { ...h, checks: { ...h.checks, [date]: !h.checks[date] } } : h,
          ),
        }),
      upsertBlock: (block) =>
        set({
          weekBlocks: get().weekBlocks.some((b) => b.id === block.id)
            ? get().weekBlocks.map((b) => (b.id === block.id ? block : b))
            : [...get().weekBlocks, block],
        }),
      removeBlock: (id) => set({ weekBlocks: get().weekBlocks.filter((b) => b.id !== id) }),
      addSupportNote: (note) => set({ supportNotes: [note, ...get().supportNotes].slice(0, 20) }),
      removeSupportNote: (index) =>
        set({ supportNotes: get().supportNotes.filter((_, i) => i !== index) }),
      importAll: (data) => set({ ...data }),
      reset: () => set({ lang: get().lang, onboarded: true, ...seed() }),
    }),
    { name: "fei-tutoria-2026", skipHydration: true },
  ),
);

export function useLang() {
  return useApp((s) => s.lang);
}

export function displayName(profile: Profile, lang: Lang) {
  if (profile.name.trim()) return profile.name.trim();
  return lang === "es" ? "Estudiante FEI" : "FEI student";
}
