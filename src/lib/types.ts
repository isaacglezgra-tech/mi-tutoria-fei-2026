export type Lang = "es" | "en";

export type TaskCategory = "academic" | "mentoring" | "wellbeing" | "personal" | "fei";
export type TaskPriority = "low" | "med" | "high";
export type EventType = "class" | "tutoring" | "deadline" | "wellbeing" | "fei";
export type GoalArea = "academic" | "personal" | "wellbeing" | "global";
export type Mood = "great" | "good" | "neutral" | "challenging" | "support";
export type SessionStatus = "upcoming" | "done" | "missed";
export type Program = "lei" | "lni";
export type Campus = "parral" | "chihuahua";
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Task {
  id: string;
  title: string;
  notes: string;
  category: TaskCategory;
  priority: TaskPriority;
  due: string | null;
  done: boolean;
  createdAt: string;
}

export interface CalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  type: EventType;
  place: string;
  notes: string;
}

export interface Goal {
  id: string;
  title: string;
  area: GoalArea;
  progress: number;
  notes: string;
}

export interface MentoringSession {
  id: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
  status: SessionStatus;
}

export interface MoodEntry {
  date: string;
  mood: Mood;
  note: string;
}

export interface Habit {
  id: string;
  titleEs: string;
  titleEn: string;
  checks: Record<string, boolean>;
}

export interface WeekBlock {
  id: string;
  weekday: Weekday;
  start: string;
  end: string;
  title: string;
  place: string;
  type: EventType;
}

export interface Profile {
  name: string;
  studentId: string;
  program: Program;
  semester: number;
  campus: Campus;
  tutorName: string;
  tutorEmail: string;
  tutorOffice: string;
  tutorHours: string;
}

export interface AppState {
  lang: Lang;
  onboarded: boolean;
  profile: Profile;
  tasks: Task[];
  events: CalEvent[];
  goals: Goal[];
  sessions: MentoringSession[];
  moods: MoodEntry[];
  habits: Habit[];
  weekBlocks: WeekBlock[];
  agenda: string;
  supportNotes: string[];
}
