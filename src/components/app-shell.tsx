import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Home, User } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { BrandLockup } from "./fei-mark";
import { LanguageToggle } from "./language-toggle";
import { Button } from "./ui/button";
import { Field, Input } from "./ui/input";
import { useT } from "@/lib/hooks";
import { displayName, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useApp.persist.rehydrate();
  }, []);
  const t = useT();
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const onboarded = useApp((s) => s.onboarded);
  const setOnboarded = useApp((s) => s.setOnboarded);
  const setProfile = useApp((s) => s.setProfile);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/progreso", label: t("progress"), icon: BarChart3 },
    { to: "/perfil", label: t("profile"), icon: User },
  ] as const;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-navy text-cream p-5 no-print">
          <div className="mb-8">
            <BrandLockup variant="dark" stacked />
            <p className="font-display text-lg leading-tight mt-3">Mi Tutoría FEI</p>
            <p className="text-gold-soft text-xs mt-0.5">2026 · {t("feiShort")}</p>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 h-11 px-3 rounded-md text-sm font-medium transition-colors",
                    active ? "bg-cream/12 text-cream" : "text-cream/70 hover:bg-cream/8 hover:text-cream",
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-8">
            <LanguageToggle light />
            <p className="text-cream/55 text-xs mt-4 leading-relaxed">{displayName(profile, lang)}</p>
            <Link to="/guia" className="block text-gold-soft text-xs mt-3 hover:text-gold">
              {t("guide")}
            </Link>
            <p className="text-gold-soft/80 text-xs mt-3">{t("motto")}</p>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 print:pb-0">
          {children}
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-cream/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)] no-print">
        <div className="grid grid-cols-3 max-w-lg mx-auto">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-medium",
                  active ? "text-navy" : "text-muted",
                )}
              >
                <item.icon className={cn("size-5", active && "text-gold-deep")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {!onboarded ? (
        <div className="fixed inset-0 z-40 bg-navy-deep/60 grid place-items-end md:place-items-center p-4 no-print">
          <div className="w-full max-w-md rounded-xl bg-paper p-6 fei-shadow">
            <BrandLockup variant="light" className="mb-3" />
            <h2 className="font-display text-2xl text-navy">{t("onboardingTitle")}</h2>
            <p className="text-muted mt-2">{t("onboardingBody")}</p>
            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("name") ?? "").trim();
                if (name) setProfile({ ...profile, name });
                setOnboarded();
              }}
            >
              <Field label={t("name")}>
                <Input name="name" placeholder={t("studentDefault")} autoComplete="name" />
              </Field>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  {t("start")}
                </Button>
                <Button type="button" variant="outline" onClick={setOnboarded}>
                  {t("skip")}
                </Button>
              </div>
            </form>
            <p className="text-xs text-muted mt-4">{t("privacy")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
