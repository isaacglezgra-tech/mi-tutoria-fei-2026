import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { BrandLockup } from "@/components/fei-mark";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { useT } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import type { AppState, Campus, Program } from "@/lib/types";

export const Route = createFileRoute("/perfil")({ component: ProfilePage });

function ProfilePage() {
  const t = useT();
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const reset = useApp((s) => s.reset);
  const importAll = useApp((s) => s.importAll);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex-1">
      <PageHeader title={t("profile")} />
      <div className="px-4 pb-8 space-y-5">
        <section className="rounded-xl bg-cream p-5 fei-shadow space-y-4">
          <BrandLockup variant="light" />
          <div>
            <p className="font-display text-xl text-navy">Mi Tutoría FEI 2026</p>
            <p className="text-muted text-sm mt-1">{t("motto")}</p>
          </div>
        </section>

        <form
          className="rounded-xl bg-cream p-4 fei-shadow space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setProfile({
              name: String(fd.get("name")),
              studentId: String(fd.get("studentId")),
              program: String(fd.get("program")) as Program,
              semester: Number(fd.get("semester") || 1),
              campus: String(fd.get("campus")) as Campus,
              tutorName: String(fd.get("tutorName")),
              tutorEmail: String(fd.get("tutorEmail")),
              tutorOffice: String(fd.get("tutorOffice")),
              tutorHours: String(fd.get("tutorHours")),
            });
            toast.success(t("saved"));
          }}
        >
          <Field label={t("name")}>
            <Input name="name" defaultValue={profile.name} placeholder={t("studentDefault")} />
          </Field>
          <Field label={t("studentId")}>
            <Input name="studentId" defaultValue={profile.studentId} />
          </Field>
          <Field label={t("program")}>
            <NativeSelect name="program" defaultValue={profile.program}>
              <option value="lei">{t("lei")}</option>
              <option value="lni">{t("lni")}</option>
            </NativeSelect>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("semester")}>
              <Input name="semester" type="number" min={1} max={10} defaultValue={profile.semester} />
            </Field>
            <Field label={t("campus")}>
              <NativeSelect name="campus" defaultValue={profile.campus}>
                <option value="parral">{t("parral")}</option>
                <option value="chihuahua">{t("chihuahua")}</option>
              </NativeSelect>
            </Field>
          </div>
          <Field label={t("tutor")}>
            <Input name="tutorName" defaultValue={profile.tutorName} />
          </Field>
          <Field label="Email">
            <Input name="tutorEmail" type="email" defaultValue={profile.tutorEmail} />
          </Field>
          <Field label={t("office")}>
            <Input name="tutorOffice" defaultValue={profile.tutorOffice} />
          </Field>
          <Field label={t("hours")}>
            <Input name="tutorHours" defaultValue={profile.tutorHours} />
          </Field>
          <Button type="submit" className="w-full">
            {t("saveProfile")}
          </Button>
        </form>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <h3 className="font-display text-lg text-navy">{t("language")}</h3>
          <div className="flex gap-2 mt-3">
            <Button variant={lang === "es" ? "primary" : "outline"} onClick={() => setLang("es")}>
              Español
            </Button>
            <Button variant={lang === "en" ? "primary" : "outline"} onClick={() => setLang("en")}>
              English
            </Button>
          </div>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow space-y-3">
          <h3 className="font-display text-lg text-navy">{t("privacy")}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const state = useApp.getState();
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        lang: state.lang,
                        onboarded: state.onboarded,
                        profile: state.profile,
                        tasks: state.tasks,
                        events: state.events,
                        goals: state.goals,
                        sessions: state.sessions,
                        moods: state.moods,
                        habits: state.habits,
                        weekBlocks: state.weekBlocks,
                        agenda: state.agenda,
                        supportNotes: state.supportNotes,
                      },
                      null,
                      2,
                    ),
                  ],
                  { type: "application/json" },
                );
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "mi-tutoria-fei-2026.json";
                a.click();
                toast.success(t("exported"));
              }}
            >
              {t("exportData")}
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              {t("importData")}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const data = JSON.parse(await file.text()) as AppState;
                  importAll(data);
                  toast.success(t("loaded"));
                } catch {
                  toast.error("JSON");
                }
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(t("resetConfirm"))) reset();
              }}
            >
              {t("resetData")}
            </Button>
          </div>
        </section>

        <section className="rounded-xl bg-cream p-4 fei-shadow">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/brand/uach-escudo-texto.png"
              alt="Universidad Autónoma de Chihuahua"
              className="h-16 w-auto object-contain"
            />
            <img
              src="/brand/fei-escudo.svg"
              alt="Facultad de Economía Internacional"
              className="h-14 w-auto max-w-[180px] object-contain"
            />
          </div>
          <h3 className="font-display text-lg text-navy">{t("about")}</h3>
          <p className="text-sm text-muted mt-2">{t("forWhom")}</p>
          <p className="text-sm text-muted mt-2">{t("authors")}</p>
          <p className="text-sm text-gold-deep mt-3">{t("vision")}</p>
          <Link to="/guia" className="inline-flex mt-4">
            <Button variant="outline">{t("guide")}</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
