"""
============================================================
EduPilot · Real Curriculum Dataset (Baha University · CS/IT)
============================================================
"""

from __future__ import annotations
from pdf_extractor import PassedCourse, PlanCourse, StudentRecord

def build_fallback_record(student_id: str = "445004397", student_name: str = "رسيل العمري") -> StudentRecord:
    # 1. CS Plan
    plan_cs = [
        PlanCourse("ENGL1001", "اللغة الإنجليزية 1", 3, [], level=1, difficulty=45),
        PlanCourse("MATH1001", "تفاضل وتكامل 1", 4, [], level=1, difficulty=75),
        PlanCourse("PHYS1301", "الفيزياء العامة 2", 4, [], level=1, difficulty=70),
        PlanCourse("CS1001", "أساسيات التحول الرقمي", 2, [], level=1, difficulty=45),
        PlanCourse("CS1002", "مقدمة في الحوسبة والخوارزميات", 4, [], level=2, difficulty=72),
        PlanCourse("CS1005", "برمجة 1", 4, ["CS1002"], level=3, difficulty=78),
        PlanCourse("CS1253", "برمجة 2", 3, ["CS1005"], level=4, difficulty=82),
        PlanCourse("CS1006", "تراكيب البيانات", 4, ["CS1253"], level=5, difficulty=88),
        PlanCourse("CS1508", "أمن الحاسب", 3, ["CS1251"], level=9, difficulty=80, yearly_only=True),
    ]

    # 2. IT Plan (Ghaida)
    plan_it = [
        PlanCourse("ENGL1001", "اللغة الإنجليزية 1", 3, [], level=1, difficulty=45),
        PlanCourse("IT1001", "أسس تقنية المعلومات", 3, [], level=1, difficulty=50),
        PlanCourse("CS1001", "أساسيات التحول الرقمي", 2, [], level=1, difficulty=45),
        PlanCourse("CS1002", "مقدمة في الحوسبة والخوارزميات", 4, [], level=1, difficulty=72),
        PlanCourse("MATH1001", "تفاضل وتكامل 1", 4, [], level=2, difficulty=75),
        PlanCourse("IT1252", "شبكات الحاسب 1", 4, ["IT1001"], level=4, difficulty=78),
        PlanCourse("IT1253", "نظم التشغيل", 4, ["CS1002"], level=4, difficulty=82),
        PlanCourse("IT1254", "تقنيات الويب", 4, ["CS1005"], level=4, difficulty=75),
        PlanCourse("IT1503", "أساسيات الأمن السيبراني", 3, ["IT1252"], level=6, difficulty=80, yearly_only=True),
    ]

    if student_id == "445031381":
        # غيداء العمري - تخصص تقنية المعلومات
        passed = [
            PassedCourse("CS1001", "أساسيات التحول الرقمي", 100.0, 2),
            PassedCourse("CS1002", "مقدمة في الحوسبة والخوارزميات", 100.0, 4),
            PassedCourse("IT1001", "أسس تقنية المعلومات", 100.0, 3),
            PassedCourse("CS1005", "برمجة", 90.0, 4),
            PassedCourse("MATH1001", "تفاضل وتكامل", 88.0, 4),
        ]
        upcoming = ["IT1252", "IT1253", "IT1254", "ISLM1001"]
        gpa = 3.93
        program = "بكالوريوس تقنية المعلومات — جامعة الباحة"
        active_plan = plan_it
    elif student_id == "445004398":
        # وسن الغامدي
        passed = [PassedCourse("MATH1001", "تفاضل وتكامل 1", 98.0, 4)]
        upcoming = ["CS1002", "CS1003", "ISLM1001"]
        gpa = 4.85
        program = "بكالوريوس علوم الحاسب — جامعة الباحة"
        active_plan = plan_cs
    else:
        # رسيل العمري
        passed = [
            PassedCourse("MATH1001", "تفاضل وتكامل 1", 85.0, 4),
            PassedCourse("CS1002", "مقدمة في الحوسبة والخوارزميات", 90.0, 4),
            PassedCourse("CS1005", "برمجة 1", 95.0, 4),
            PassedCourse("CS1253", "برمجة 2", 75.0, 3), 
        ]
        upcoming = ["CS1006", "CS1255", "CS1508"]
        gpa = 4.15
        program = "بكالوريوس علوم الحاسب — جامعة الباحة"
        active_plan = plan_cs

    return StudentRecord(
        student_id=student_id,
        student_name=student_name,
        program=program,
        gpa=gpa,
        passed_courses=passed,
        plan=active_plan,
        current_term_courses=upcoming,
    )
