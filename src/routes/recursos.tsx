import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, GraduationCap, Globe2, Landmark, Mail, School } from "lucide-react";
import { BrandLockup } from "@/components/fei-mark";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/hooks";

export const Route = createFileRoute("/recursos")({ component: ResourcesPage });

function ResourcesPage() {
  const t = useT();
  const links = [
    {
      href: "https://uach.mx/fei/",
      title: t("feiWeb"),
      body: t("subtag"),
      Icon: School,
    },
    {
      href: "https://uach.mx/fei/tutorias-y-asesorias",
      title: t("tutoringPage"),
      body: t("findTutor"),
      Icon: GraduationCap,
    },
    {
      href: "https://sega.uach.mx",
      title: t("sega"),
      body: t("checkSEGA"),
      Icon: Landmark,
    },
    {
      href: "mailto:academico.fei@uach.mx",
      title: t("academicMail"),
      body: "academico.fei@uach.mx",
      Icon: Mail,
    },
    {
      href: "https://uach.mx",
      title: t("mobility"),
      body: t("global"),
      Icon: Globe2,
    },
    {
      href: "https://uach.mx/bibliotecas",
      title: t("library"),
      body: t("catAcademic"),
      Icon: BookOpen,
    },
  ];

  return (
    <main className="flex-1">
      <PageHeader title={t("resources")} subtitle={t("feiShort")} />
      <div className="px-4 pb-8">
        <div className="rounded-xl bg-cream p-4 fei-shadow mb-4">
          <BrandLockup variant="light" />
        </div>
        <div className="relative overflow-hidden rounded-xl mb-4 h-36">
          <img src="/campus-fei.jpg" alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-navy/45" />
          <p className="absolute bottom-3 left-4 right-4 text-cream font-display text-lg">{t("purpose")}</p>
        </div>
        <ul className="space-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-xl bg-cream p-4 fei-shadow hover:bg-paper"
              >
                <l.Icon className="size-6 text-navy shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-navy">{l.title}</p>
                  <p className="text-sm text-muted">{l.body}</p>
                </div>
                <ArrowUpRight className="size-4 text-muted shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
