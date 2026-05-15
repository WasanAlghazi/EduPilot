
from dataclasses import asdict, dataclass, field
from typing import List, Dict, Any
from pdf_extractor import StudentRecord, PassedCourse

@dataclass
class CareerPath:
    id: str
    title: str
    suitability: int
    reasons: List[str]
    electives: List[Dict[str, str]]
    color_class: str = "blue"

def analyze_career_paths(record: StudentRecord) -> List[CareerPath]:
    paths = []
    passed_idx = {c.code: c for c in record.passed_courses}
    
    # --- 1. AI & Data Science ---
    ai_suitability = 0
    ai_reasons = []
    
    # Check Math & Stats
    math_grades = [passed_idx[c].grade for c in ["MATH1001", "CS1004", "CS1254", "IT1255"] if c in passed_idx]
    if math_grades:
        avg_math = sum(math_grades) / len(math_grades)
        if avg_math > 90:
            ai_suitability += 40
            ai_reasons.append(f"درجاتك في الرياضيات والإحصاء ممتازة ({avg_math:.0f}%)")
        elif avg_math > 80:
            ai_suitability += 30
            ai_reasons.append("أداء جيد جداً في المواد التحليلية")
    
    # Check Programming
    prog_grades = [passed_idx[c].grade for c in ["CS1002", "CS1005", "CS1253", "CS1006"] if c in passed_idx]
    if prog_grades:
        avg_prog = sum(prog_grades) / len(prog_grades)
        if avg_prog > 90:
            ai_suitability += 40
            ai_reasons.append(f"تميز واضح في مهارات البرمجة والخوارزميات")
        elif avg_prog > 80:
            ai_suitability += 30
            ai_reasons.append("مهارات برمجية صلبة")
            
    # Normalize suitability (ensure it's not over 98% for a demo look)
    ai_suitability = min(98, max(60, ai_suitability + (record.gpa * 10))) 
    
    paths.append(CareerPath(
        id="ai-ds",
        title="الذكاء الاصطناعي وعلوم البيانات",
        suitability=int(ai_suitability),
        reasons=ai_reasons if ai_reasons else ["اهتمام بالذكاء الاصطناعي", "أداء أكاديمي متزن"],
        electives=[
            {"code": "CS460", "name": "الذكاء الاصطناعي"},
            {"code": "CS472", "name": "تعلم الآلة"},
            {"code": "CS481", "name": "تحليل البيانات الضخمة"},
            {"code": "CS495", "name": "الرؤية الحاسوبية"}
        ],
        color_class="green"
    ))

    # --- 2. Networking & Cybersecurity ---
    net_suitability = 0
    net_reasons = []
    
    # Check Networks/OS/Security
    net_related = [passed_idx[c].grade for c in ["CS1255", "CS1502", "CS1257", "CS1508"] if c in passed_idx]
    if net_related:
        avg_net = sum(net_related) / len(net_related)
        net_suitability = avg_net * 0.8 + 10
        net_reasons.append(f"اهتمام واضح بمواد الشبكات ({avg_net:.0f}%)")
    else:
        net_suitability = 70 + (record.gpa * 2) # Base score for interest
        net_reasons.append("ميل نحو البنية التحتية والأمن")
        
    paths.append(CareerPath(
        id="net-sec",
        title="شبكات الحاسب والأمن السيبراني",
        suitability=int(min(95, net_suitability)),
        reasons=net_reasons,
        electives=[
            {"code": "CS430", "name": "أمن المعلومات"},
            {"code": "CS441", "name": "شبكات لاسلكية"},
            {"code": "CS455", "name": "الأمن السحابي"}
        ],
        color_class="blue"
    ))

    # --- 3. Software Engineering ---
    se_suitability = 0
    se_reasons = []
    
    # Check SE/Web/DB
    se_related = [passed_idx[c].grade for c in ["CS1009", "CS1503", "CS1256", "CS1008"] if c in passed_idx]
    if se_related:
        avg_se = sum(se_related) / len(se_related)
        se_suitability = avg_se * 0.85 + 5
        se_reasons.append(f"أداء قوي في هندسة البرمجيات ({avg_se:.0f}%)")
    else:
        se_suitability = 75 + (record.gpa * 1.5)
        se_reasons.append("شغف ببناء الأنظمة المتكاملة")
        
    paths.append(CareerPath(
        id="swe",
        title="هندسة البرمجيات وتطوير الأنظمة",
        suitability=int(min(96, se_suitability)),
        reasons=se_reasons,
        electives=[
            {"code": "CS370", "name": "هندسة البرمجيات"},
            {"code": "CS378", "name": "تطوير تطبيقات الويب"},
            {"code": "CS385", "name": "تطوير تطبيقات الجوال"}
        ],
        color_class="navy"
    ))

    return paths
