import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/apoyo")({ component: SupportPage });

function SupportPage() {
  const t = useT();
  const profile = useApp((s) => s.profile);
  const notes = useApp((s) => s.supportNotes);
  const addSupportNote = useApp((s) => s.addSupportNote);
  const removeSupportNote = useApp((s) => s.removeSupportNote);
  const [text, setText] = useState("");

  return (
    <main className="flex-1">
      <PageHeader title={t("support")} />
      <div className="px-4 pb-8 space-y-4">
        <section className="rounded-xl bg-navy text-cream p-5">
          <HeartHandshake className="size-7 text-gold mb-2" />
          <h2 className="font-display text-2xl">{t("crisisTitle")}</h2>
          <p className="text-cream/75 mt-2">{t("crisisBody")}</p>
          <div className="mt-4 grid gap-2">
            <a href="tel:8009112000" className="flex items-center gap-3 rounded-lg bg-cream/10 p-3">
              <Phone className="size-5 text-gold" />
              <span>
                <span className="block text-sm">{t("lineavida")}</span>
                <span className="tabular-nums">800 911 2000</span>
              </span>
            </a>
            <a href="tel:911" className="flex items-center gap-3 rounded-lg bg-cream/10 p-3">
              <Phone className="size-5 text-gold" />
              <span>
                <span className="block text-sm">{t("emergency")}</span>
                <span className="tabular-nums">911</span>
              </span>
            </a>
            <a href="tel:5552598121" className="flex items-center gap-3 rounded-lg bg-cream/10 p-3">
              <Phone className="size-5 text-gold" />
              <span>
                <span className="block text-sm">{t("saptel")}</span>
                <span className="tabular-nums">55 5259 8121</span>
              </span>
            </a>
          </div>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("tutoringHelp")}</h3>
          <p className="text-sm text-muted mt-1">{t("academicHelpBody")}</p>
          <a href={`mailto:${profile.tutorEmail}`} className="inline-flex mt-3">
            <Button size="sm">
              <Mail className="size-4" />
              {t("contactTutor")}
            </Button>
          </a>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("academicHelp")}</h3>
          <p className="text-sm text-muted mt-1">{t("findTutor")}</p>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("writeNote")}</h3>
          <p className="text-sm text-muted mb-2">{t("supportPrompt")}</p>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} />
          <Button
            className="mt-3"
            onClick={() => {
              const v = text.trim();
              if (!v) return;
              addSupportNote(v);
              setText("");
              toast.success(t("noteSaved"));
            }}
          >
            {t("save")}
          </Button>
          {notes.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {notes.map((n, i) => (
                <li key={`${i}-${n.slice(0, 12)}`} className="rounded-lg bg-paper p-3 text-sm">
                  <p>{n}</p>
                  <button type="button" className="text-xs text-muted mt-2" onClick={() => removeSupportNote(i)}>
                    {t("delete")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}
