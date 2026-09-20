import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LanguageToggle({ light }: { light?: boolean }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const base = light ? "text-cream/70" : "text-muted";
  const active = light ? "bg-cream/15 text-cream" : "bg-navy text-cream";

  return (
    <div
      className={cn(
        "inline-flex rounded-full p-1 text-xs font-semibold tracking-wide",
        light ? "bg-cream/10" : "bg-paper-2",
      )}
      role="group"
      aria-label="Language"
    >
      <button
        className={cn("h-8 px-3 rounded-full transition-colors", lang === "es" ? active : base)}
        onClick={() => setLang("es")}
        type="button"
      >
        ES
      </button>
      <button
        className={cn("h-8 px-3 rounded-full transition-colors", lang === "en" ? active : base)}
        onClick={() => setLang("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
