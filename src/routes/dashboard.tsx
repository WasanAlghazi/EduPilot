import { createFileRoute, Link } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, BookOpen, TrendingUp, Calendar, ArrowLeft, Radar, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <AppLayout title="لوحة التحكم">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[color:var(--royal)]" />
        </div>
      </AppLayout>
    );
  }

  if (isError || !data) {
    return (
      <AppLayout title="لوحة التحكم">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 font-bold">
           حدث خطأ أثناء تحميل البيانات. يرجى إعادة المحاولة لاحقاً.
        </div>
      </AppLayout>
    );
  }

  const student = data.student;
  const courses = data.courses || [
    { code: "CS301", name: "هياكل البيانات", weight: 85 },
    { code: "CS322", name: "أنظمة التشغيل", weight: 72 },
    { code: "MATH204", name: "الرياضيات المتقطعة", weight: 60 },
    { code: "ENG250", name: "اللغة الإنجليزية", weight: 35 },
  ];
  const totalLoad = Math.round(courses.reduce((a, c) => a + (c.weight || 0), 0) / courses.length);
  const gpa = student.gpa.toFixed(2);
  const alerts = data.alerts || [];

  return (
    <AppLayout title="لوحة التحكم">
      {/* Hero strip */}
      <section className="mb-6 overflow-hidden rounded-2xl p-6 text-white shadow-[var(--shadow-card)]" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-[12px] uppercase tracking-wider text-white/70">EduPilot</div>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">أهلاً بك يا {student.student_name.split(' ')[0]} 👋</h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">مساعدك الذكي فوق نظام بلاك بورد — صُمم ليرشدك في كل خطوة.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
            <Calendar className="h-5 w-5" />
            <div className="text-sm">
              <div className="text-white/70">الفصل الحالي</div>
              <div className="font-bold">الأول 1446هـ</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Study Load */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[color:var(--navy)]">ثقل الفصل الحالي</h3>
              <p className="text-xs text-muted-foreground">تحليل آلي لكثافة المواد المسجلة</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[color:var(--navy)]">{totalLoad}%</span>
              <span className="text-xs text-muted-foreground">متوسط</span>
            </div>
          </div>

          <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full transition-all" style={{ width: `${totalLoad}%`, background: "var(--gradient-load)" }} />
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.code} className="flex items-center gap-3">
                <div className="flex w-32 items-center gap-2">
                  <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--navy)]">{c.code}</span>
                  <span className="truncate text-sm">{c.name}</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${c.weight}%`, background: c.weight > 70 ? "var(--royal)" : "var(--success)" }} />
                  </div>
                </div>
                <div className="w-10 text-end text-xs font-bold text-muted-foreground">{c.weight}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Bridge link card */}
        <Link to="/bridge" className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:border-[color:var(--royal)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: "var(--gradient-hero)" }}>
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-[color:var(--navy)]">جسور المعرفة</div>
              <div className="text-[11px] text-muted-foreground">مصادر تعليمية مرتبطة بمواد فصلك</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            لكل مادة في بلاك بورد، نختار لك أفضل المصادر من يوتيوب لتختار الأنسب لأسلوبك في التعلم.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {courses.slice(0, 3).map((c) => (
              <div key={c.code} className="rounded-lg bg-secondary p-2 text-center">
                <div className="text-[10px] text-muted-foreground">{c.code}</div>
                <div className="mt-1 text-[10px] font-bold text-[color:var(--royal)]">5 مصادر</div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-bold text-[color:var(--royal)] group-hover:gap-2">
            افتح جسور المعرفة <ArrowLeft className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Prerequisites alerts */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[color:var(--navy)]">تنبيهات المتطلبات الأساسية</h3>
              <p className="text-xs text-muted-foreground">مواد يجب تسجيلها الآن لضمان عدم تأخر التخرج</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <div className={`mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--destructive)]`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{a.title}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.body}</div>
                  </div>
                  <Link to="/radar" className="text-xs font-bold text-[color:var(--royal)] hover:underline">عرض التفاصيل</Link>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">لا توجد تنبيهات حالية.</div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><TrendingUp className="h-4 w-4" /> المعدل التراكمي</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[color:var(--success)]">{gpa}</span>
              <span className="text-xs text-muted-foreground">/ 5.00</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-[color:var(--success)]" style={{ width: `${(Number(gpa)/5)*100}%` }} />
            </div>
          </div>

          <Link to="/radar" className="block rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-[color:var(--royal)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: "var(--royal)" }}>
                <Radar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[color:var(--navy)]">الرادار الاستباقي</div>
                <div className="text-[11px] text-muted-foreground">{alerts.length} مواد بحاجة لانتباهك</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
