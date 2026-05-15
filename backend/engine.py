"""
============================================================
EduPilot · IF-Conditions Engine
============================================================
AR: محرك القرار الاستباقي للطالب — يتكوّن من ثلاث وحدات:

    1) رادار التنبيه الاستباقي  (Proactive Radar):
       IF (المادة متطلب أساسي) AND (تُطرح سنوياً) AND (لم تُسجَّل)
          AND (الطالبة مؤهلة لها)
          -> تنبيه فوري لمنع تأخر التخرج عاماً كاملاً.

    2) جسور المعرفة  (Knowledge Bridges):
       IF (المادة الجديدة صعبة) AND (درجة المتطلب السابق < 80)
          -> اقتراح موديول مراجعة (Micro-learning).

    3) تحليل ثقل الدراسة  (Study Load Analyzer):
       حساب مجموع ساعات وأوزان الترم القادم؛
       IF (الساعات > 15) AND (الثقل عالٍ) -> "Stressful"
       ELSE -> "Balanced".

EN: This is the heart of EduPilot — three rule-based modules
    that turn a parsed StudentRecord into actionable advice.
============================================================
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Iterable

from pdf_extractor import PassedCourse, PlanCourse, StudentRecord


# ============================================================
# Tunable thresholds · الحدود القابلة للضبط
# ============================================================
HARD_COURSE_DIFFICULTY = 75       # AR: أي مادة صعوبتها أعلى من هذا تعتبر "صعبة"
WEAK_PREREQ_GRADE = 80            # AR: درجة < 80 في المتطلب السابق -> ضعف
MAX_HEALTHY_HOURS = 15            # AR: ساعات الترم القادم
HEAVY_LOAD_AVG_DIFFICULTY = 70    # AR: متوسط صعوبة المواد للترم القادم


# ============================================================
# Output structures · هياكل المخرجات
# ============================================================
@dataclass
class Alert:
    """AR: تنبيه يظهر على لوحة الطالبة.
    EN: A single alert card rendered in the dashboard."""

    severity: str        # "critical" | "warning" | "info"
    title: str
    body: str
    course_code: str = ""
    course_name: str = ""
    unlocks: list[dict] = field(default_factory=list)
    yearly: bool = False


@dataclass
class KnowledgeBridge:
    """AR: جسر معرفة بين مادة جديدة ومتطلبها السابق الضعيف.
    EN: A 'bridge' linking a hard upcoming course to a weak prereq."""

    course_code: str
    course_name: str
    weak_prereq_code: str
    weak_prereq_name: str
    weak_prereq_grade: float
    recommendation: str
    micro_modules: list[dict] = field(default_factory=list)


@dataclass
class StudyLoad:
    """AR: نتيجة تحليل ثقل الترم القادم.
    EN: Outcome of the upcoming-term load analysis."""

    total_hours: int
    avg_difficulty: float
    weighted_load: float        # 0-100 scale
    status: str                 # "Stressful" | "Balanced"
    status_ar: str              # "مرهق" | "متوازن"
    breakdown: list[dict] = field(default_factory=list)


@dataclass
class EngineResult:
    """AR: الناتج الكامل لمحرك القرار.
    EN: Full payload exposed by the engine."""

    alerts: list[Alert]
    bridges: list[KnowledgeBridge]
    load: StudyLoad

    def to_dict(self) -> dict:
        return {
            "alerts": [asdict(a) for a in self.alerts],
            "bridges": [asdict(b) for b in self.bridges],
            "load": asdict(self.load),
        }


# ============================================================
# Helpers · أدوات مساعدة
# ============================================================
def _index_plan(plan: Iterable[PlanCourse]) -> dict[str, PlanCourse]:
    return {c.code: c for c in plan}


def _index_passed(passed: Iterable[PassedCourse]) -> dict[str, PassedCourse]:
    return {c.code: c for c in passed}


def _is_eligible(course: PlanCourse, passed: dict[str, PassedCourse]) -> bool:
    """AR: مؤهلة للمادة إذا اجتازت جميع متطلباتها السابقة.
    EN: Student is eligible if every prerequisite has been passed."""
    return all(pre in passed for pre in course.prerequisites)


def _unlocks_for(code: str, plan: Iterable[PlanCourse]) -> list[dict]:
    """AR: المواد التي تعتمد على هذه المادة (تفتح بها).
    EN: All plan courses that have `code` as a prerequisite."""
    return [
        {"code": c.code, "name": c.name}
        for c in plan
        if code in c.prerequisites
    ]


# ============================================================
# 1) Proactive Radar · رادار التنبيه الاستباقي
# ============================================================
def build_proactive_alerts(record: StudentRecord) -> list[Alert]:
    """AR: تنبيهات استباقية للمواد السنوية الحرجة + المتطلبات المفقودة.
    EN: Build proactive alerts for yearly-only critical courses and
        any missing-but-eligible prerequisite courses."""

    alerts: list[Alert] = []
    plan_idx = _index_plan(record.plan)
    passed_idx = _index_passed(record.passed_courses)
    current = set(record.current_term_courses)

    for course in record.plan:
        already_passed = course.code in passed_idx
        in_current = course.code in current
        if already_passed or in_current:
            continue
        if not _is_eligible(course, passed_idx):
            continue

        unlocks = _unlocks_for(course.code, record.plan)

        # ------------------------------------------------------------
        # IF المادة تُطرح سنوياً فقط ومتطلب أساسي ولم تُسجَّل بعد ومؤهلة
        # -> تنبيه عاجل لمنع تأخر التخرج لعام كامل
        # ------------------------------------------------------------
        if course.yearly_only and unlocks:
            alerts.append(
                Alert(
                    severity="critical",
                    title=f"سجّل {course.code} الآن — تُطرح سنوياً فقط",
                    body=(
                        f"مادة {course.name} متطلب أساسي لـ "
                        f"{'، '.join(u['name'] for u in unlocks)} "
                        f"وتُطرح مرة واحدة في السنة. إن لم تُسجَّل هذا الفصل "
                        f"فسيتأخر التخرج عاماً كاملاً."
                    ),
                    course_code=course.code,
                    course_name=course.name,
                    unlocks=unlocks,
                    yearly=True,
                )
            )
            continue

        # ------------------------------------------------------------
        # IF المادة متطلب أساسي لعدد من المواد ولم تُسجَّل
        # -> تنبيه تحذيري (warning)
        # ------------------------------------------------------------
        if len(unlocks) >= 2:
            alerts.append(
                Alert(
                    severity="warning",
                    title=f"مهم: {course.code} يفتح {len(unlocks)} مواد لاحقة",
                    body=(
                        f"اجتزتِ متطلبات {course.name} لكنها لم تظهر بعد في خطتك. "
                        f"تأجيلها يؤخر: {'، '.join(u['name'] for u in unlocks)}."
                    ),
                    course_code=course.code,
                    course_name=course.name,
                    unlocks=unlocks,
                    yearly=False,
                )
            )

    # ------------------------------------------------------------
    # AR: تنبيه إضافي إذا كانت أيٌ من مواد الترم القادم سنوية.
    # EN: Extra alert for any yearly course already on the upcoming list.
    # ------------------------------------------------------------
    for code in record.current_term_courses:
        course = plan_idx.get(code)
        if course and course.yearly_only:
            alerts.append(
                Alert(
                    severity="warning",
                    title=f"{course.name} تُطرح سنوياً — لا تسقطها",
                    body=(
                        "هذه المادة موجودة في خطة ترمك القادم لكنها تُطرح سنوياً. "
                        "إسقاطها يعني تأخراً مقداره عام كامل."
                    ),
                    course_code=course.code,
                    course_name=course.name,
                    yearly=True,
                )
            )

    return alerts


# ============================================================
# 2) Knowledge Bridges · جسور المعرفة
# ============================================================
def build_knowledge_bridges(record: StudentRecord) -> list[KnowledgeBridge]:
    """AR: ابنِ جسر مراجعة لكل مادة صعبة قادمة درجتها في المتطلب < 80.
    EN: For each hard upcoming course whose prerequisite was weak,
        create a micro-learning bridge."""

    plan_idx = _index_plan(record.plan)
    passed_idx = _index_passed(record.passed_courses)
    bridges: list[KnowledgeBridge] = []

    for code in record.current_term_courses:
        course = plan_idx.get(code)
        if course is None:
            continue

        # IF المادة القادمة "صعبة" (صعوبتها >= العتبة)
        if course.difficulty < HARD_COURSE_DIFFICULTY:
            continue

        # ابحث عن متطلب سابق درجته أقل من 80
        for pre_code in course.prerequisites:
            pre_passed = passed_idx.get(pre_code)
            if pre_passed is None:
                continue
            if pre_passed.grade >= WEAK_PREREQ_GRADE:
                continue

            bridges.append(
                KnowledgeBridge(
                    course_code=course.code,
                    course_name=course.name,
                    weak_prereq_code=pre_passed.code,
                    weak_prereq_name=pre_passed.name,
                    weak_prereq_grade=pre_passed.grade,
                    recommendation=(
                        f"درجتك في {pre_passed.name} كانت {pre_passed.grade:.0f}/100 — "
                        f"راجعي هذه الموديولات القصيرة قبل بدء {course.name} "
                        f"لتعزيز الأساس النظري."
                    ),
                    micro_modules=_micro_modules_for(course.code, pre_passed.code),
                )
            )
    return bridges


def _micro_modules_for(course_code: str, prereq_code: str) -> list[dict]:
    """AR: مكتبة جاهزة من الموديولات القصيرة لكل زوج (مادة → متطلب ضعيف).
    EN: Hand-curated micro-learning modules per (course, weak-prereq) pair."""

    library: dict[tuple[str, str], list[dict]] = {
        ("CS301", "CS201"): [
            {
                "title": "مراجعة المؤشرات والذاكرة الديناميكية",
                "channel": "أكاديمية حسوب",
                "duration": "55 دقيقة",
                "language": "ar",
                "url": "https://www.youtube.com/results?search_query=المؤشرات+لغة+c+حسوب",
            },
            {
                "title": "Pointers and Memory Crash Course",
                "channel": "freeCodeCamp",
                "duration": "1h 02m",
                "language": "en",
                "url": "https://www.youtube.com/watch?v=zuegQmMdy8M",
            },
        ],
        ("CS303", "CS103"): [
            {
                "title": "العلاقات والدوال في الرياضيات المنفصلة",
                "channel": "Khan Academy العربية",
                "duration": "40 دقيقة",
                "language": "ar",
                "url": "https://www.youtube.com/results?search_query=رياضيات+منفصلة+علاقات",
            },
            {
                "title": "Big-O Notation from Scratch",
                "channel": "CS Dojo",
                "duration": "32m",
                "language": "en",
                "url": "https://www.youtube.com/watch?v=v4cd1O4zkGw",
            },
        ],
    }

    # AR: نرجع الموديولات الخاصة إن وُجدت وإلا نُعيد قائمة افتراضية مفيدة.
    key = (course_code, prereq_code)
    if key in library:
        return library[key]
    return [
        {
            "title": f"مراجعة مفاهيم {prereq_code} الأساسية",
            "channel": "EduPilot — مكتبة المراجعات",
            "duration": "45 دقيقة",
            "language": "ar",
            "url": "https://www.youtube.com/results?search_query="
                   + prereq_code
                   + "+مراجعة",
        },
        {
            "title": f"Foundations review for {course_code}",
            "channel": "EduPilot Micro Library",
            "duration": "35m",
            "language": "en",
            "url": "https://www.youtube.com/results?search_query="
                   + course_code
                   + "+foundations+review",
        },
    ]


# ============================================================
# 3) Study Load Analyzer · تحليل ثقل الدراسة
# ============================================================
def analyse_study_load(record: StudentRecord) -> StudyLoad:
    """AR: نحسب مجموع ساعات الترم القادم وأوزانه (صعوبة × ساعات).
    EN: Compute total hours and weighted difficulty for the upcoming term."""

    plan_idx = _index_plan(record.plan)
    total_hours = 0
    weighted_sum = 0
    difficulty_sum = 0
    count = 0
    breakdown: list[dict] = []

    for code in record.current_term_courses:
        course = plan_idx.get(code)
        if course is None:
            continue
        total_hours += course.hours
        weighted_sum += course.hours * course.difficulty
        difficulty_sum += course.difficulty
        count += 1
        breakdown.append(
            {
                "code": course.code,
                "name": course.name,
                "hours": course.hours,
                "difficulty": course.difficulty,
                "weight": round(course.hours * course.difficulty / 100, 1),
            }
        )

    avg_difficulty = (difficulty_sum / count) if count else 0
    weighted_load = (weighted_sum / total_hours) if total_hours else 0

    # ------------------------------------------------------------
    # IF الساعات > 15 و(الثقل عالٍ أو متوسط الصعوبة عالٍ)  -> "Stressful"
    # ELSE -> "Balanced"
    # ------------------------------------------------------------
    stressful = total_hours > MAX_HEALTHY_HOURS and (
        weighted_load >= HEAVY_LOAD_AVG_DIFFICULTY
        or avg_difficulty >= HEAVY_LOAD_AVG_DIFFICULTY
    )

    return StudyLoad(
        total_hours=total_hours,
        avg_difficulty=round(avg_difficulty, 1),
        weighted_load=round(weighted_load, 1),
        status="Stressful" if stressful else "Balanced",
        status_ar="مرهق" if stressful else "متوازن",
        breakdown=breakdown,
    )


# ============================================================
# Public entry point · نقطة الدخول الرئيسية
# ============================================================
def run_engine(record: StudentRecord) -> EngineResult:
    """AR: شغّل المحرّك بالكامل وأعد الناتج النهائي.
    EN: Run all three modules and return the consolidated EngineResult."""
    return EngineResult(
        alerts=build_proactive_alerts(record),
        bridges=build_knowledge_bridges(record),
        load=analyse_study_load(record),
    )
