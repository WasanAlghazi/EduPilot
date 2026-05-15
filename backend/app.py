"""
============================================================
EduPilot · FastAPI Server
============================================================
AR: يربط نتائج محرك Python بواجهة HTML/CSS/JS الخالصة عبر
    REST API بسيط، كما يقوم بتقديم ملفات الواجهة كملفات ثابتة:

    GET /api/health             - فحص الخدمة
    GET /api/student            - الهوية + المعدل + المواد المجتازة
    GET /api/alerts             - تنبيهات رادار المتطلبات
    GET /api/knowledge-bridges  - جسور المعرفة (Micro-learning)
    GET /api/study-load         - تحليل ثقل الترم القادم
    GET /api/plan               - الخطة الدراسية الكاملة
    GET /api/dashboard          - مجمَّع كل ما سبق في طلب واحد
    POST /api/login             - تسجيل دخول تجريبي (يقبل أي كلمة مرور)
    GET /                       - يخدم /frontend/index.html (Login)

EN: Serves the vanilla HTML/CSS/JS frontend and the rule-engine
    REST API from a single port. CORS is open for local development.
============================================================
"""

from __future__ import annotations

from pathlib import Path
from typing import Any
from dataclasses import asdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from engine import run_engine, build_proactive_alerts
from pdf_extractor import extract_all
from database import verify_auth_token, save_analysis_to_db
from fallback_data import build_fallback_record
from career_engine import analyze_career_paths

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "dist"

app = FastAPI(
    title="EduPilot Backend",
    description="محرك القرار الاستباقي للطالب — EduPilot proactive academic AI engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)
@app.get("/api/dashboard")
def get_dashboard(request: Request) -> dict[str, Any]:
    """AR: كل البيانات في طلب واحد مخصص لكل مستخدم."""
    
    # 1. استخراج التوكن
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        
    student_id = "445004397"
    full_name = "نورة المانع"
    
    # 2. التحقق من التوكن (إن وجد)
    if token and token.startswith("demo-"):
        student_id = token.split("demo-")[1]
        full_name = USERS.get(student_id, full_name)
    elif token:
        profile = verify_auth_token(token)
        if profile:
            student_id = profile.get("student_id", student_id)
            full_name = profile.get("full_name", full_name)
            
    # 3. بناء السجل الأكاديمي المخصص
    # مؤقتاً نستخدم البيانات الوهمية المعتمدة على الاسم والرقم
    # مستقبلاً سيتم جلب السجل الحقيقي من قاعدة البيانات
    record = build_fallback_record(student_id, full_name)
    
    # 4. تشغيل محرك الذكاء الاصطناعي
    result = run_engine(record)
    
    # 5. حفظ التحليل في قاعدة بيانات الطالب (إحصائيات)
    save_analysis_to_db(student_id, result.to_dict())
    
    # 6. تجهيز الرد
    student_data = {
        "student_id": record.student_id,
        "student_name": record.student_name,
        "program": record.program,
        "gpa": record.gpa,
        "passed_courses": [{"code": c.code, "name": c.name, "grade": c.grade} for c in record.passed_courses],
        "current_term_courses": record.current_term_courses,
    }
    
    plan_data = [{"code": c.code, "name": c.name} for c in record.plan]
    
    # 7. تحليل المسارات المهنية
    career_paths = analyze_career_paths(record)
    
    return {
        "student": student_data,
        **result.to_dict(),
        "plan": plan_data,
        "career_paths": [asdict(p) for p in career_paths]
    }


class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(body: ChatRequest, request: Request):
    """AR: مساعد ذكي متقدم للإجابة على استفسارات الطلاب بناءً على سجلهم."""
    msg = body.message.lower()
    
    # 1. استخراج هوية الطالب من التوكن
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    
    student_id = "445004397"
    full_name = "رسيل العمري"
    
    if token and token.startswith("demo-"):
        student_id = token.split("demo-")[1]
        full_name = USERS.get(student_id, full_name)
        
    # 2. جلب سجل الطالب
    record = build_fallback_record(student_id, full_name)
    first_name = full_name.split(' ')[0]
    
    # 3. منطق الإجابة الذكي
    if any(k in msg for k in ["معدل", "نقاط", "gpa"]):
        status = "ممتاز" if record.gpa > 4.5 else "جيد جداً" if record.gpa > 3.75 else "جيد"
        return {"response": f"أهلاً {first_name}! معدلك الحالي هو {record.gpa:.2f} ({status}). استمرارك على هذا المستوى يفتح لك آفاقاً كبيرة في الدراسات العليا والوظائف التنافسية."}
        
    elif any(k in msg for k in ["مواد", "ترم", "فصل", "دراسة"]):
        courses_count = len(record.current_term_courses)
        courses_list = "، ".join(record.current_term_courses)
        return {"response": f"يا {first_name}، أنتِ مسجلة حالياً في {courses_count} مواد: ({courses_list}). "
                           f"من تحليلي، مادة {record.current_term_courses[0]} هي الأكثر ثقلاً، أنصحكِ بتخصيص وقت أكبر لها في جدولك الأسبوعي."}
                           
    elif any(k in msg for k in ["مسار", "تخصص", "مهني", "وظيفة"]):
        career_paths = analyze_career_paths(record)
        best_path = career_paths[0].title
        return {"response": f"بناءً على أدائك القوي في المواد التحليلية والبرمجية، المسار المهني الأنسب لكِ هو '{best_path}'. "
                           f"هذا المسار يتطلب مهارات تقنية عالية، وقد أظهرتِ تميزاً في متطلباته الأساسية."}
                           
    elif any(k in msg for k in ["تنبيه", "رادار", "تأخر", "سنوي"]):
        alerts = build_proactive_alerts(record)
        if alerts:
            return {"response": f"انتبهي يا {first_name}! الرادار الاستباقي وجد {len(alerts)} تنبيهات. "
                               f"أهمها: {alerts[0].title}. عدم تسجيل هذه المادة قد يؤخر تخرجك لأنها تُطرح سنوياً."}
        return {"response": f"لا توجد تنبيهات حرجة حالياً يا {first_name}، وضعك الأكاديمي مستقر جداً."}

    return {"response": f"مرحباً {first_name}! أنا مساعدك EduPilot. يمكنني إخبارك عن (معدلك، المواد الثقيلة هذا الترم، المسار المهني الأنسب لكِ، أو تنبيهات الرادار الاستباقي). كيف أساعدك؟"}


class LoginRequest(BaseModel):
    student_id: str
    password: str

USERS = {
    "445004397": "رسيل العمري",
    "445004398": "وسن الغامدي",
    "445031381": "غيداء العمري"
}

@app.post("/api/login")
def login(body: LoginRequest) -> dict[str, Any]:
    """AR: تسجيل دخول تجريبي لعدة مستخدمين."""
    student_id = body.student_id.strip()
    if student_id not in USERS:
        raise HTTPException(status_code=401, detail="رقم جامعي غير معروف")
    return {
        "ok": True,
        "student_id": student_id,
        "student_name": USERS[student_id],
        "token": f"demo-{student_id}",
    }


# ============================================================
# Static frontend · تقديم ملفات HTML/CSS/JS من /frontend
# ============================================================
# AR: نُركّب الواجهة الأمامية على الجذر "/" بحيث يُمكن فتح
#     http://127.0.0.1:8000/ مباشرة لرؤية صفحة تسجيل الدخول.
#     مع html=True تُقدّم StaticFiles ملف index.html تلقائياً للجذر.
# EN: Mount the vanilla HTML/CSS/JS frontend at "/" so the browser
#     can open the login page directly from the same server.
#     html=True makes StaticFiles serve index.html for the root URL.
# IMPORTANT: this mount must be added AFTER all /api routes so
#            those routes are matched first.
if FRONTEND_DIR.exists():
    app.mount(
        "/",
        StaticFiles(directory=str(FRONTEND_DIR), html=True),
        name="frontend",
    )


# ============================================================
# Local entry · uvicorn app:app --reload
# ============================================================
if __name__ == "__main__":
    import uvicorn

    # AR: reload=False أكثر استقراراً على Windows في وضع التسليم.
    # EN: reload=False is more stable on Windows for the demo.
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
