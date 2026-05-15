import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Loader2, Zap, CheckCircle2, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";

export const Route = createFileRoute("/radar")({ component: RadarPage });

function RadarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <AppLayout title="الرادار الاستباقي">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[color:var(--royal)]" />
        </div>
      </AppLayout>
    );
  }

  const alerts = data?.alerts || [];

  return (
    <AppLayout title="الرادار الاستباقي للمتطلبات الأساسية">
      <div className="mb-10 text-center">
         <p className="mx-auto max-w-4xl text-sm leading-relaxed text-muted-foreground">
            رصد ذكي للمواد التي تُفتح بشكل دوري وتُعد متطلباً أساسياً لمواد قادمة. إذا تعثرت في إحدى هذه المواد، نقترح لك "أقصر مسار" بديل لئلا يتأخر تخرجك.
         </p>
      </div>

      {/* Course Cards Grid */}
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {alerts.length > 0 ? alerts.map((alert, idx) => (
           <div key={idx} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold bg-red-50 text-red-600">
                    <ShieldAlert className="h-3.5 w-3.5" /> خطر مرتفع
                 </div>
              </div>
              <h3 className="text-lg font-extrabold text-[color:var(--navy)]">{alert.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {alert.body}
              </p>
              <div className="mt-8">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">التوصية:</div>
                 <div className="flex items-center gap-2 text-[11px] font-bold text-[color:var(--navy)]">
                    <ArrowLeft className="h-3.5 w-3.5 text-[color:var(--royal)]" /> سجل المادة في أقرب فرصة
                 </div>
              </div>
           </div>
         )) : (
           <div className="col-span-full py-20 text-center text-muted-foreground">لا توجد تنبيهات نشطة حالياً.</div>
         )}
      </div>

      {/* Shortest Path Alternative */}
      <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden border-b-4 border-b-[color:var(--navy)]">
         <div className="flex items-center justify-between bg-white px-8 py-5 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--navy)] text-white shadow-xl">
               <Zap className="h-5 w-5" />
            </div>
            <div className="text-right">
               <h3 className="text-lg font-extrabold text-[color:var(--navy)]">أقصر مسار بديل (Shortest Path)</h3>
               <p className="text-[10px] text-muted-foreground font-medium">مقترحات الذكاء الاصطناعي في حال عدم التمكن من تسجيل مادة متطلب</p>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-0">
            <div className="p-8 border-l border-border bg-green-50/20">
               <div className="mb-6 flex items-center justify-end gap-2 text-[10px] font-extrabold text-[color:var(--success)] uppercase tracking-wider">
                  النتيجة المتوقعة <CheckCircle2 className="h-4 w-4" />
               </div>
               <div className="text-right">
                  <div className="text-base font-extrabold text-[color:var(--success)]">توفير فصل دراسي كامل</div>
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                     تجاوز العقبات الأكاديمية بنجاح عبر اختيار مواد بديلة متوازية.
                  </p>
               </div>
            </div>

            <div className="p-8 border-l border-border bg-slate-50/30">
               <div className="mb-6 flex items-center justify-end text-[10px] font-extrabold text-[color:var(--royal)] uppercase">
                  البديل المقترح
               </div>
               <div className="space-y-3 text-right text-xs font-bold">
                  <div>مواد اختيارية تخصصية</div>
                  <div>تدريب صيفي مكثف</div>
               </div>
            </div>

            <div className="p-8">
               <div className="mb-6 flex items-center justify-end text-[10px] font-extrabold text-red-500 uppercase">
                  المسار المتعثر
               </div>
               <div className="text-right text-[10px] text-muted-foreground leading-relaxed">
                  تأخر التخرج المتوقع لمدة فصلين دراسيين في حال عدم اتخاذ إجراء.
               </div>
            </div>
         </div>
      </section>
    </AppLayout>
  );
}
