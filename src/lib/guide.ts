import type { Lang } from "./types";

export const letterMeta = {
  kicker: {
    es: "Una carta a las y los tutorados de la FEI",
    en: "A letter to FEI mentees",
  },
  from: "Isaac González Granados",
  role: {
    es: "Facultad de Economía Internacional · UACH",
    en: "School of International Economics · UACH",
  },
  with: {
    es: "Junto con Mtra. Carolina Moriel Seáñez",
    en: "Together with Mtra. Carolina Moriel Seáñez",
  },
  signoff: { es: "Ahí nos vemos,", en: "See you around," },
  year: "2026",
} as const;

/** First-person letter in Isaac’s voice. Keep it short on purpose. */
export const letterParagraphs: { es: string; en: string }[] = [
  {
    es: "Soy Isaac González Granados. Esta app la diseñamos Carolina Moriel Seáñez y yo, en la Facultad de Economía Internacional. No es un adorno digital. Es un cuaderno de tutoría que cabe en el celular.",
    en: "I’m Isaac González Granados. Carolina Moriel Seáñez and I designed this app at the School of International Economics. It isn’t digital decoration. It’s a mentoring notebook that fits in your phone.",
  },
  {
    es: "¿Por qué la hicimos? Porque la tutoría en la FEI ya existe: hay cubículo, hay horario, hay ficha en SEGA. Lo que a veces falta es un lugar sencillo donde organices la semana, prepares lo que quieres platicar y no se te olvide que estudiar también es cuidarte. 2026 es el Año de la salud mental en la UACH. Nos tomamos eso en serio. Tu bienestar también forma parte de tu éxito.",
    en: "Why did we make it? Mentoring at FEI already exists: there is an office, office hours, a form in SEGA. What is sometimes missing is a simple place to organize the week, prepare what you want to talk about, and remember that studying also means taking care of yourself. 2026 is UACH’s Year of Mental Health. We take that seriously. Your well-being is also part of your success.",
  },
  {
    es: "¿Con base en qué? En el Programa de Tutorías y Asesorías de la Facultad. En la ficha de diagnóstico de SEGA. En lo que vemos semestre con semestre: entregas que se amontonan, materias en riesgo, dudas que se quedan para “luego”, y días en los que el ánimo no alcanza. Y en una idea que para nosotros no es eslogan: grandes profesionistas, mejores personas. Más que una carrera, una visión del mundo.",
    en: "What is it based on? The Faculty’s Mentoring and Advising Program. The SEGA diagnostic form. What we see every semester: deadlines piling up, courses at risk, questions left for “later,” and days when your energy just isn’t there. And an idea that, for us, is not a slogan: great professionals, better people. More than a degree, a global vision.",
  },
  {
    es: "Esto no sustituye a tu tutor o tutora. No califica. No se reporta a la Facultad. Te acompaña entre una sesión y la siguiente.",
    en: "This does not replace your mentor. It does not grade you. It is not reported to the Faculty. It walks with you between one session and the next.",
  },
  {
    es: "¿Cómo se usa? Entras. Si quieres, escribes tu nombre. No hay cuenta ni contraseña. En Perfil anotas matrícula, programa, campus y los datos de tu tutor —aparecen en SEGA, abajo de tu horario; si no están, ve a Coordinación de Tutorías. Arma Mi semana y tus Pendientes. El Calendario junta clases, entregas y la próxima tutoría. Antes de ir al cubículo, abre Mi tutoría: deja los temas, registra la sesión, anota lo que quedó. Pon una o dos metas. El rumbo importa más que la prisa. Si te nace, registra cómo te sientes. Hay pausas, respiración y, si el día pesa, un botón de apoyo con números reales: Línea de la Vida, SAPTEL, emergencias.",
    en: "How do you use it? You go in. If you want, you write your name. There is no account or password. In Profile you add student ID, program, campus, and your mentor’s details — they appear in SEGA, at the bottom of your schedule; if they’re missing, go to Mentoring Coordination. Build My Week and your Tasks. Calendar brings together classes, deadlines, and the next mentoring session. Before you go to the office, open My Mentoring: leave the topics, log the session, note what remains. Set one or two goals. Direction matters more than speed. If it feels right, log how you feel. There are breaks, breathing, and, if the day is heavy, a support button with real numbers: Línea de la Vida, SAPTEL, emergency services.",
  },
  {
    es: "Todo se queda en este dispositivo. Puedes exportarlo o borrarlo cuando quieras. Nadie en la FEI lo ve si tú no lo compartes.",
    en: "Everything stays on this device. You can export it or erase it whenever you want. Nobody at FEI sees it unless you share it.",
  },
  {
    es: "Organiza. Avanza. Cuídate. Trasciende.",
    en: "Organize. Progress. Take care. Make an impact.",
  },
];

export const pillars: {
  es: string;
  en: string;
  hintEs: string;
  hintEn: string;
  tone: "organiza" | "avanza" | "cuidate" | "trasciende";
}[] = [
  {
    es: "Organiza",
    en: "Organize",
    hintEs: "Semana, pendientes y calendario",
    hintEn: "Week, tasks, and calendar",
    tone: "organiza",
  },
  {
    es: "Avanza",
    en: "Progress",
    hintEs: "Tutoría, metas y bitácora",
    hintEn: "Mentoring, goals, and your log",
    tone: "avanza",
  },
  {
    es: "Cuídate",
    en: "Take care",
    hintEs: "Ánimo, pausas y apoyo",
    hintEn: "Mood, breaks, and support",
    tone: "cuidate",
  },
  {
    es: "Trasciende",
    en: "Make an impact",
    hintEs: "Recursos FEI y tu rumbo",
    hintEn: "FEI resources and your path",
    tone: "trasciende",
  },
];

export const infographicSteps: {
  n: number;
  to: "/" | "/perfil" | "/semana" | "/tutoria" | "/bienestar" | "/apoyo";
  title: { es: string; en: string };
  body: { es: string; en: string };
}[] = [
  {
    n: 1,
    to: "/",
    title: { es: "Entra. Sin cuenta.", en: "Go in. No account." },
    body: {
      es: "Escribe tu nombre si quieres. No hay contraseña. Esto es tuyo, en este celular.",
      en: "Write your name if you want. No password. This is yours, on this phone.",
    },
  },
  {
    n: 2,
    to: "/perfil",
    title: { es: "Pon tu tutor.", en: "Add your mentor." },
    body: {
      es: "Matrícula, programa y campus. El tutor aparece en SEGA, abajo de tu horario.",
      en: "Student ID, program, and campus. Your mentor is in SEGA, at the bottom of your schedule.",
    },
  },
  {
    n: 3,
    to: "/semana",
    title: { es: "Arma la semana.", en: "Build the week." },
    body: {
      es: "Horario, pendientes y calendario. Lo que vence se ve. Lo que no se anota, se olvida.",
      en: "Schedule, tasks, and calendar. What is due is visible. What isn’t written down gets lost.",
    },
  },
  {
    n: 4,
    to: "/tutoria",
    title: { es: "Prepara el cubículo.", en: "Prepare for office hours." },
    body: {
      es: "En Mi tutoría deja los temas, registra la sesión y anota lo que quedó para la próxima.",
      en: "In My Mentoring, leave topics, log the session, and note what is left for next time.",
    },
  },
  {
    n: 5,
    to: "/bienestar",
    title: { es: "Cuida el ánimo.", en: "Tend to how you feel." },
    body: {
      es: "Metas con rumbo, no con prisa. Un check de cómo te sientes. Pausas y respiración cuando el día aprieta.",
      en: "Goals with direction, not haste. A check-in on how you feel. Breaks and breathing when the day tightens.",
    },
  },
  {
    n: 6,
    to: "/apoyo",
    title: { es: "Si el día pesa.", en: "If the day is heavy." },
    body: {
      es: "Hay un botón de apoyo, recursos de la FEI y números reales: Línea de la Vida, SAPTEL, emergencias.",
      en: "There is a support button, FEI resources, and real numbers: Línea de la Vida, SAPTEL, emergency services.",
    },
  },
];

export function loc<T extends { es: string; en: string }>(item: T, lang: Lang): string {
  return item[lang];
}

export function letterPlain(lang: Lang): string {
  const lines = [
    loc(letterMeta.kicker, lang),
    "",
    ...letterParagraphs.map((p) => loc(p, lang)),
    "",
    loc(letterMeta.signoff, lang),
    letterMeta.from,
    loc(letterMeta.role, lang),
    loc(letterMeta.with, lang),
    letterMeta.year,
  ];
  return lines.join("\n");
}
