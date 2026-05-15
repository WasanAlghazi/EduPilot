-- =================================================================================
-- EduPilot Database Schema (Supabase / PostgreSQL)
-- تعليمات: قم بنسخ هذا الكود ولصقه في محرر الـ SQL داخل لوحة تحكم Supabase الخاصة بك
-- =================================================================================

-- 1. جدول بيانات الطلاب (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    program VARCHAR(150),
    gpa DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. جدول السجل الأكاديمي والتحليلات (Academic Analysis)
CREATE TABLE IF NOT EXISTS public.academic_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_uuid UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    total_courses INT,
    passed_courses INT,
    alerts_count INT,
    bridges_count INT,
    study_load_status VARCHAR(50),
    study_load_score DECIMAL(5,2),
    raw_analysis_data JSONB, -- يحتوي على مصفوفة التنبيهات وجسور المعرفة بالتفصيل
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =================================================================================
-- 3. تفعيل الأمان (Row Level Security - RLS)
-- =================================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_analysis ENABLE ROW LEVEL SECURITY;

-- سياسة: يمكن للمستخدم قراءة بياناته فقط
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING ( auth.uid() = id );

-- سياسة: يمكن للمستخدم تحديث بياناته فقط
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING ( auth.uid() = id );

-- سياسة: قراءة التحليلات الخاصة بالمستخدم فقط
CREATE POLICY "Users can view own analysis" 
    ON public.academic_analysis FOR SELECT 
    USING ( auth.uid() = student_uuid );

-- =================================================================================
-- 4. المحفزات التلقائية (Triggers)
-- =================================================================================

-- دالة أ: تحديث وقت التعديل (updated_at)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- دالة ب: إنشاء ملف شخصي تلقائياً عند تسجيل حساب جديد في Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, student_id, full_name)
  -- نقوم باستخراج الرقم الجامعي من الإيميل الوهمي (مثال: 445001234@student.baha.edu.sa)
  VALUES (
    NEW.id, 
    SPLIT_PART(NEW.email, '@', 1), 
    'طالب مستجد'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تفعيل المحفز لإنشاء الملف الشخصي عند التسجيل
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
