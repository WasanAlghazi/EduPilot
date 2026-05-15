import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "ما هي المواد التي يجب أن أسجلها الترم القادم؟",
  "اقترح لي مسار تخصصي مناسب",
  "كيف أعوض مادة لم تُفتح هذا الفصل؟",
  "ما الشهادات الاحترافية المرتبطة بمنهجي؟",
];

export default function AIAdvisor() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "مرحباً 👋 أنا مستشارك الذكي في EduPilot. كيف أقدر أساعدك في خطتك الدراسية اليوم؟" },
  ]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            "بناءً على خطتك الحالية ودرجاتك، أنصحك بالتركيز على المتطلبات الأساسية لمادة هياكل البيانات هذا الفصل، وأخذ مادة 'مقدمة في الذكاء الاصطناعي' كاختيارية لأنها تتوافق مع مسارك المقترح.",
        },
      ]);
    }, 600);
  };

  return (
    <>
      <button
        aria-label="مستشارك الذكي"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[var(--shadow-elev)] transition hover:scale-105"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full opacity-20" style={{ background: "var(--royal)" }} />
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elev)]">
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "var(--gradient-hero)" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold">مستشارك الذكي</div>
                <div className="text-[11px] text-white/70">يحلّل خطتك ويقترح أفضل مسار</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto bg-secondary/40 p-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role === "ai" ? "self-start bg-white text-foreground shadow-sm" : "self-end text-white"}`} style={m.role === "user" ? { background: "var(--royal)" } : {}}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border bg-card px-3 py-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
            <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: "var(--royal)" }}>
              <Send className="h-4 w-4 -scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
