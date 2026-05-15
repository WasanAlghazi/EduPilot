import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Sparkles } from "lucide-react";
import logo from "@/assets/university-logo.png";

export const Route = createFileRoute("/")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studentId, setStudentId] = useState("445004397");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("edupilot_token", data.token);
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("student_name", data.student_name);
        navigate({ to: "/dashboard" });
      } else {
        const err = await response.json();
        setErrorMsg(err.detail || "الرقم الجامعي أو كلمة المرور غير صحيحة.");
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("حدث خطأ في الاتصال بالخادم.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 opacity-[0.06]" style={{ background: "radial-gradient(60rem 60rem at 80% -10%, var(--royal), transparent), radial-gradient(40rem 40rem at -10% 110%, var(--success), transparent)" }} />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elev)] md:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between p-10 text-white md:flex" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Sparkles className="h-4 w-4" /> EduPilot
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight">ارتقِ برحلتك الأكاديمية مع EduPilot</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              مساعدك الذكي فوق نظام بلاك بورد — صُمم ليرشدك في كل خطوة، من تحليل ثقل المواد إلى اقتراح أفضل المسارات الأكاديمية.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { n: "+12,400", l: "طالب" },
                { n: "98%", l: "دقة التوصيات" },
                { n: "24/7", l: "مستشار ذكي" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/10 p-3">
                  <div className="text-base font-extrabold">{s.n}</div>
                  <div className="text-[11px] text-white/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-white/60">© جامعة الباحة — بوابة الخدمات الأكاديمية</div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col items-center justify-center px-6 py-10 md:px-12">
          <img src={logo} alt="جامعة الباحة" className="mb-6 h-20 w-auto object-contain" />
          <h1 className="text-xl font-bold text-[color:var(--navy)]">تسجيل الدخول الموحّد</h1>
          <p className="mt-1 text-sm text-muted-foreground">استخدم رقمك الجامعي للدخول</p>

          <form onSubmit={handleLogin} className="mt-8 w-full space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-red-600">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">الرقم الجامعي</label>
              <div className="flex items-center rounded-lg border border-input bg-background px-3 focus-within:border-ring">
                <User className="h-4 w-4 text-muted-foreground" />
                <input 
                  required 
                  value={studentId} 
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">كلمة المرور</label>
              <div className="flex items-center rounded-lg border border-input bg-background px-3 focus-within:border-ring">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="accent-[color:var(--royal)]" /> تذكرني
              </label>
              <Link to="/" className="text-[color:var(--royal)] hover:underline">نسيت كلمة المرور؟</Link>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-70"
              style={{ background: "var(--gradient-hero)" }}
            >
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>
          </form>

          <div className="mt-6 text-[11px] text-muted-foreground">بالدخول فإنك توافق على شروط استخدام النظام الأكاديمي.</div>
        </div>
      </div>
    </div>
  );
}
