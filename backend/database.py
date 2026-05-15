"""
============================================================
EduPilot · Supabase Database Manager
============================================================
AR: مدير قواعد البيانات للاتصال بـ Supabase من الواجهة الخلفية.
EN: Database manager to connect to Supabase from the backend.
============================================================
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional, Any, Dict

# تحميل المتغيرات من ملف .env الموجود في المجلد الجذري
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# إعدادات الاتصال من ملف البيئة
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# تهيئة العميل
def get_supabase_client() -> Optional[Client]:
    """يقوم بإنشاء وإرجاع كائن الاتصال بسوبابيس إذا توفرت المفاتيح."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"[Supabase Error] Connection failed: {e}")
        return None

supabase: Optional[Client] = get_supabase_client()


def save_analysis_to_db(student_id: str, analysis_data: Dict[str, Any]) -> bool:
    """
    AR: حفظ نتائج تحليل السجل الأكاديمي (الرادار، الجسور، الجهد) في قاعدة البيانات.
    """
    if not supabase:
        print("[DB Warning] Supabase client is not configured. Skipping save.")
        return False
        
    try:
        # ترتيب البيانات للحفظ
        record = {
            "student_id": student_id,
            "total_courses": analysis_data.get("total_courses", 0),
            "passed_courses": analysis_data.get("passed_courses", 0),
            "alerts_count": len(analysis_data.get("alerts", [])),
            "bridges_count": len(analysis_data.get("bridges", [])),
            "study_load_status": analysis_data.get("load", {}).get("status", "Unknown"),
            "study_load_score": analysis_data.get("load", {}).get("avg_difficulty", 0.0),
            "raw_analysis_data": analysis_data
        }
        
        # إدراج البيانات في الجدول
        response = supabase.table("academic_analysis").insert(record).execute()
        print(f"[DB Success] Analysis saved for student {student_id}")
        return True
    except Exception as e:
        print(f"[DB Error] Failed to save analysis: {e}")
        return False


def get_student_profile(student_id: str) -> Optional[Dict[str, Any]]:
    """
    AR: جلب بيانات الطالب الأساسية من القاعدة.
    """
    if not supabase:
        return None
        
    try:
        response = supabase.table("profiles").select("*").eq("student_id", student_id).execute()
        data = response.data
        if data and len(data) > 0:
            return data[0]
        return None
    except Exception as e:
        print(f"[DB Error] Failed to get profile: {e}")
        return None

def verify_auth_token(token: str) -> Optional[Dict[str, Any]]:
    """
    AR: التحقق من التوكن وجلب بيانات الطالب الحقيقية من جدول profiles.
    """
    if not supabase:
        return None
    try:
        # Get user from token
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            return None
        
        user_id = user_response.user.id
        
        # Get profile
        profile_response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        data = profile_response.data
        if data and len(data) > 0:
            return data[0]
        return None
    except Exception as e:
        print(f"[Auth Error] Failed to verify token: {e}")
        return None
