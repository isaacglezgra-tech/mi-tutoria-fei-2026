import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageToggle } from "./language-toggle";
import { useT } from "@/lib/hooks";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const t = useT();
  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur-md no-print">
      <div className="flex items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <Link
          to="/"
          className="size-11 rounded-md grid place-items-center text-navy hover:bg-paper-2"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl text-navy truncate">{title}</h1>
          {subtitle ? <p className="text-xs text-muted truncate">{subtitle}</p> : null}
        </div>
        {action}
        <div className="md:hidden">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
