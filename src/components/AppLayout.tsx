import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Radar, BookOpen, Award, Compass, Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/university-logo.png";
import AIAdvisor from "./AIAdvisor";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const NAV = [
  { to: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/radar", label: "الرادار الاستباقي", icon: Radar },
  { to: "/bridge", label: "جسور المعرفة", icon: BookOpen },
  { to: "/partners", label: "شراكات تعليمية", icon: Award },
  { to: "/track", label: "مسارك الأكاديمي", icon: Compass },
];

export default function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  const student = dashboardData?.student;

  const handleLogout = async () => {
    localStorage.removeItem("edupilot_token");
    localStorage.removeItem("student_id");
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-30 flex w-64 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:translate-x-0 ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border/60 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1">
            <img src={logo} alt="جامعة الباحة" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight">EduPilot</div>
            <div className="text-[11px] text-white/60">جامعة الباحة</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-white/10 font-bold text-white shadow-inner" : "text-white/75 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {active && <span className="ms-auto h-2 w-2 rounded-full bg-[color:var(--success)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border/60 p-3">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="md:mr-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-white/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 md:hidden" onClick={() => setOpen((v) => !v)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-[color:var(--navy)] md:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-secondary">
              <Bell className="h-5 w-5 text-[color:var(--navy)]" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[color:var(--success)]" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "var(--gradient-hero)" }}>
                {student ? student.student_name.charAt(0) : "أ"}
              </div>
              <div className="hidden text-xs leading-tight md:block">
                <div className="font-bold">{student?.student_name || "جاري التحميل..."}</div>
                <div className="text-muted-foreground">{student?.student_id || ""}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <AIAdvisor />

      {open && <button className="fixed inset-0 z-20 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-label="close" />}
    </div>
  );
}
