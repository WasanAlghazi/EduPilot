import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { Compass, CheckCircle2, Target, BookMarked } from "lucide-react";

export const Route = createFileRoute("/track")({ component: TrackPage });

const TRACKS = [
  {
    name: "الذكاء الاصطناعي وعلوم البيانات",
    match: 94,
    badge: "الأنسب لك",
    color: "var(--gradient-hero)",
    reasons: [
      "درجاتك في الرياضيات والإحصاء فوق 92%",
      "أداء متميز في مادة 'مقدمة في البرمجة' (95%)",
      "أكملت 70% من متطلبات هذا المسار",
    ],
    electives: [
      { code: "CS460", name: "الذكاء الاصطناعي" },
      { code: "CS472", name: "تعلّم الآلة" },
      { code: "CS481", name: "تحليل البيانات الضخمة" },
      { code: "CS495", name: "الرؤية الحاسوبية" },
    ],
  },
  {
    name: "شبكات الحاسب والأمن السيبراني",
    match: 78,
    color: "var(--royal)",
    reasons: [
      "اهتمامك بمواد الشبكات (CS401)",
      "شراكة جامعتك مع Cisco تفتح لك CCNA",
    ],
    electives: [
      { code: "CS430", name: "أمن المعلومات" },
      { code: "CS441", name: "شبكات لاسلكية" },
      { code: "CS455", name: "الأمن السحابي" },
    ],
  },
  {
    name: "هندسة البرمجيات وتطوير الأنظمة",
    match: 71,
    color: "var(--navy)",
    reasons: [
      "أداء جيد في مواد البرمجة الكائنية",
      "ميل واضح نحو المشاريع التطبيقية",
    ],
    electives: [
      { code: "CS370", name: "هندسة البرمجيات" },
      { code: "CS378", name: "تطوير تطبيقات الويب" },
      { code: "CS385", name: "تطوير تطبيقات الجوال" },
    ],
  },
];

function TrackPage() {
  return (
    <AppLayout title="مسارك الأكاديمي">
      <section className="mb-6 overflow-hidden rounded-2xl p-6 text-white shadow-[var(--shadow-card)]" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">توصيات الذكاء الاصطناعي لمسارك</h2>
            <p className="mt-1 max-w-2xl text-sm text-white/80">
              حلّل مستشارك الذكي درجاتك، خطتك الدراسية، والمواد المتاحة في قسمك — واقترح لك المسار الأنسب ضمن تخصصك (علوم الحاسب). يمكنك مقارنة المسارات واختيار الاختياريات المناسبة.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {TRACKS.map((t) => (
          <article key={t.name} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="relative p-5 text-white" style={{ background: t.color as string }}>
              {t.badge && (
                <span className="absolute end-3 top-3 rounded-full bg-[color:var(--success)] px-2 py-0.5 text-[10px] font-bold">
                  {t.badge}
                </span>
              )}
              <div className="text-[11px] uppercase tracking-wider text-white/70">المسار</div>
              <h3 className="mt-1 text-lg font-extrabold leading-tight">{t.name}</h3>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${t.match}%` }} />
                </div>
                <span className="text-sm font-extrabold">{t.match}%</span>
              </div>
              <div className="mt-1 text-[11px] text-white/70">درجة الملاءمة لقدراتك</div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground">
                  <Target className="h-3.5 w-3.5" /> لماذا هذا المسار؟
                </div>
                <ul className="mt-2 space-y-1.5">
                  {t.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--success)]" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground">
                  <BookMarked className="h-3.5 w-3.5" /> مواد اختيارية مقترحة
                </div>
                <div className="mt-2 space-y-1.5">
                  {t.electives.map((e) => (
                    <div key={e.code} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-sm">{e.name}</span>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--navy)]">{e.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-5 rounded-lg py-2 text-xs font-bold text-white transition hover:opacity-95" style={{ background: "var(--gradient-hero)" }}>
                اختر هذا المسار
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
