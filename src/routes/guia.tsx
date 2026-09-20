import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { InfographicPoster } from "@/components/infographic";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { letterMeta, letterParagraphs, letterPlain, loc } from "@/lib/guide";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/guia")({ component: GuidePage });

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function GuidePage() {
  const t = useT();
  const lang = useApp((s) => s.lang);

  return (
    <main className="flex-1">
      <PageHeader
        title={t("guide")}
        subtitle={t("guideSubtitle")}
        action={
          <div className="flex gap-1 no-print">
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("printGuide")}
              onClick={() => window.print()}
            >
              <Printer className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("downloadLetter")}
              onClick={() => {
                downloadText(
                  lang === "es" ? "carta-mi-tutoria-fei-2026.txt" : "letter-my-fei-mentoring-2026.txt",
                  letterPlain(lang),
                );
                toast.success(t("exported"));
              }}
            >
              <Download className="size-5" />
            </Button>
          </div>
        }
      />

      <div className="px-4 pb-10 space-y-8">
        <section>
          <p className="text-xs uppercase tracking-[0.14em] text-gold-deep font-semibold mb-3 no-print">
            {t("infographicTitle")}
          </p>
          <InfographicPoster />
          <div className="mt-3 flex flex-wrap gap-2 no-print">
            <Button variant="gold" onClick={() => window.print()}>
              <Printer className="size-4" />
              {t("printGuide")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = "/infografia-uso.png";
                a.download = "infografia-mi-tutoria-fei-2026.png";
                a.click();
              }}
            >
              <Download className="size-4" />
              {t("downloadInfographic")}
            </Button>
          </div>
        </section>

        <section className="rounded-xl bg-cream p-5 md:p-7 fei-shadow print:shadow-none">
          <p className="text-xs uppercase tracking-[0.14em] text-gold-deep font-semibold">
            {loc(letterMeta.kicker, lang)}
          </p>
          <h2 className="font-display text-2xl text-navy mt-1">{t("letterTitle")}</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink">
            {letterParagraphs.map((p) => (
              <p key={p.es}>{loc(p, lang)}</p>
            ))}
          </div>
          <p className="mt-6 text-navy">{loc(letterMeta.signoff, lang)}</p>
          <p className="font-display text-xl text-navy mt-1">{letterMeta.from}</p>
          <p className="text-sm text-muted">{loc(letterMeta.role, lang)}</p>
          <p className="text-sm text-muted">{loc(letterMeta.with, lang)}</p>
          <p className="text-sm text-gold-deep mt-2">{letterMeta.year}</p>
          <div className="mt-5 no-print">
            <Button
              variant="outline"
              onClick={() => {
                downloadText(
                  lang === "es" ? "carta-mi-tutoria-fei-2026.txt" : "letter-my-fei-mentoring-2026.txt",
                  letterPlain(lang),
                );
                toast.success(t("exported"));
              }}
            >
              <Download className="size-4" />
              {t("downloadLetter")}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
