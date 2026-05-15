import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { Play, Clock, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";

export const Route = createFileRoute("/bridge")({ component: BridgePage });

function BridgePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <AppLayout title="مركز جسور المعرفة">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[color:var(--royal)]" />
        </div>
      </AppLayout>
    );
  }

  const bridges = data?.bridges || [];

  return (
    <AppLayout title="مركز جسور المعرفة">
      <div className="mb-8 text-center">
         <p className="mx-auto max-w-4xl text-sm leading-relaxed text-muted-foreground font-medium">
            لكل مادة في بلاك بورد، نختار لك أفضل المصادر من يوتيوب لتختار الأنسب لأسلوبك في التعلم وسد الفجوات المعرفية.
         </p>
      </div>

      <div className="space-y-10">
        {bridges.length > 0 ? bridges.map((group, idx) => (
          <section key={idx} className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <header className="mb-8 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <span className="rounded-lg bg-[color:var(--navy)] px-3 py-1.5 text-[10px] font-extrabold text-white uppercase">{group.course_id}</span>
                  <h3 className="text-lg font-extrabold text-[color:var(--navy)]">{group.course_name}</h3>
               </div>
               <div className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-extrabold text-[color:var(--success)]">
                  مصادر مخصصة
               </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: `شرح أساسيات ${group.course_name}`, channel: "Academic Academy", duration: "2 ساعة", rating: 4.8 },
                { title: `مراجعة ليلة الامتحان ${group.course_name}`, channel: "EduBaha", duration: "1.5 ساعة", rating: 4.9 },
              ].map((s, i) => (
                <a 
                  key={i} 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-border bg-background p-4 transition hover:border-[color:var(--royal)] hover:shadow-lg"
                >
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl" style={{ background: "var(--gradient-hero)" }}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[color:var(--destructive)] shadow-lg transition group-hover:scale-110">
                      <Play className="h-5 w-5 -scale-x-100 fill-current" />
                    </div>
                  </div>
                  <div className="mt-4 line-clamp-2 text-sm font-extrabold leading-tight text-[color:var(--navy)] group-hover:text-[color:var(--royal)]">{s.title}</div>
                  <div className="mt-1 text-[10px] font-medium text-muted-foreground">{s.channel}</div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-[10px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.duration}</span>
                    <span className="flex items-center gap-1.5 text-[color:var(--royal)]"><Star className="h-3.5 w-3.5 fill-current" /> {s.rating}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )) : (
          <div className="py-20 text-center text-muted-foreground">لا توجد مصادر مقترحة حالياً.</div>
        )}
      </div>
    </AppLayout>
  );
}
