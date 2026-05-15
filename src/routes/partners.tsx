import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { ExternalLink, Award } from "lucide-react";

export const Route = createFileRoute("/partners")({ component: PartnersPage });

const PARTNERS = [
  {
    code: "CS460",
    course: "الذكاء الاصطناعي",
    partner: "Google",
    cert: "Google AI/ML Professional",
    color: "#4285F4",
    logoText: "GO",
    match: 85,
    blurb: "محتوى المادة متوافق مع مسار Google Cloud AI Engineer.",
    url: "https://grow.google/certificates/data-analytics/"
  },
  {
    code: "CS450",
    course: "الحوسبة السحابية",
    partner: "AWS",
    cert: "AWS Certified Cloud Practitioner",
    color: "#FF9900",
    logoText: "AW",
    match: 88,
    blurb: "ربط مباشر مع برنامج AWS Academy المعتمد لجامعة الباحة.",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
  },
  {
    code: "CS401",
    course: "شبكات الحاسب",
    partner: "Cisco",
    cert: "CCNA — Cisco Certified Network Associate",
    color: "#1BA0D7",
    logoText: "CI",
    match: 92,
    blurb: "منهج المادة يغطي 92% من متطلبات شهادة CCNA. أنصح بتسجيل الامتحان بعد إنهاء المادة.",
    url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html"
  },
  {
    code: "CS370",
    course: "هندسة البرمجيات",
    partner: "Microsoft",
    cert: "Microsoft Certified: Azure Developer Associate",
    color: "#00A4EF",
    logoText: "MI",
    match: 74,
    blurb: "شراكة Microsoft Imagine Academy — أدوات وموارد مجانية للطلاب.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/"
  },
];

function PartnersPage() {
  return (
    <AppLayout title="شراكات تعليمية">
      <div className="mb-12 text-center">
         <p className="mx-auto max-w-4xl text-sm leading-relaxed text-muted-foreground font-medium text-right">
            ربط مباشر بين مواد جامعتك والشهادات الاحترافية العالمية. كل شعار شريك بجانب مادة يعني أن منهجك الأكاديمي يفتح لك باباً مباشراً لسوق العمل.
         </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p) => (
          <article key={p.code} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-4 border-b border-border bg-slate-50/50 px-6 py-5">
               <div className="ms-auto text-right">
                  <div className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">توافق المنهج</div>
                  <div className="text-base font-extrabold text-[color:var(--success)]">{p.match}%</div>
               </div>
               <div className="flex flex-1 flex-col text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">شريك تعليمي</div>
                  <div className="text-sm font-extrabold text-[color:var(--navy)]">{p.partner}</div>
               </div>
               <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-lg" style={{ background: p.color }}>
                  {p.logoText}
               </div>
            </div>

            <div className="flex flex-1 flex-col p-6 text-right">
              <div className="flex items-center justify-end gap-3 mb-4">
                <span className="text-sm font-extrabold text-[color:var(--navy)]">{p.course}</span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">{p.code}</span>
              </div>

              <div className="mb-6 flex flex-row-reverse items-center gap-3 rounded-xl border border-dashed border-border p-4 bg-white shadow-sm group-hover:border-[color:var(--royal)]">
                <Award className="h-5 w-5 shrink-0 text-[color:var(--royal)]" />
                <div className="text-[11px] font-extrabold leading-tight text-[color:var(--navy)]">{p.cert}</div>
              </div>

              <p className="mb-6 text-[10px] leading-relaxed text-muted-foreground font-medium">{p.blurb}</p>

              <a 
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border py-2.5 text-[11px] font-extrabold text-[color:var(--royal)] transition hover:bg-[color:var(--royal)] hover:text-white hover:border-[color:var(--royal)]"
              >
                 <ExternalLink className="h-3.5 w-3.5" /> تفاصيل الشهادة
              </a>
            </div>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
