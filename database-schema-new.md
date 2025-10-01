# 🗂️ Database Schema - نظام التصنيف الهرمي الجديد

## 📋 Collections المطلوبة:

### 1. Categories Collection - التصنيفات الرئيسية
```
Collection ID: categories
Attributes:
- name (String, 255, Required) - اسم التصنيف
- nameAr (String, 255, Required) - الاسم بالعربية  
- nameEn (String, 255, Required) - الاسم بالإنجليزية
- description (String, 1000, Optional) - وصف التصنيف
- icon (String, 100, Optional) - أيقونة التصنيف
- color (String, 50, Optional) - لون التصنيف
- order (Integer, Required) - ترتيب العرض
- isActive (Boolean, Required, Default: true) - مفعل/غير مفعل
```

### 2. Subjects Collection - المواد الفرعية
```
Collection ID: subjects  
Attributes:
- name (String, 255, Required) - اسم المادة
- nameAr (String, 255, Required) - الاسم بالعربية
- nameEn (String, 255, Required) - الاسم بالإنجليزية  
- categoryId (String, 255, Required) - ID التصنيف الرئيسي
- description (String, 1000, Optional) - وصف المادة
- creditHours (Integer, Optional) - عدد الساعات
- level (String, 100, Optional) - المستوى (سنة أولى، ثانية...)
- prerequisite (String, 500, Optional) - المتطلبات السابقة
- isActive (Boolean, Required, Default: true) - مفعل/غير مفعل
```

### 3. FileTypes Collection - أنواع الملفات
```
Collection ID: fileTypes
Attributes:
- name (String, 100, Required) - اسم نوع الملف
- nameAr (String, 100, Required) - الاسم بالعربية
- nameEn (String, 100, Required) - الاسم بالإنجليزية
- icon (String, 100, Optional) - أيقونة نوع الملف
- color (String, 50, Optional) - لون نوع الملف
- allowedFormats (String, 500, Optional) - الصيغ المسموحة
```

### 4. Materials Collection - تحديث الملفات الحالية
```
Collection ID: materials (تحديث الموجود)
إضافة Attributes جديدة:
- categoryId (String, 255, Required) - ID التصنيف الرئيسي
- subjectId (String, 255, Required) - ID المادة  
- fileTypeId (String, 255, Required) - ID نوع الملف
- tags (String, 500, Optional) - تاغات إضافية
- semester (String, 50, Optional) - الفصل الدراسي
- year (String, 50, Optional) - السنة الدراسية
```

## 🎯 البيانات الأولية:

### Categories الـ 10 الرئيسية:
1. متطلبات الجامعة (University Requirements)
2. متطلبات ثقافية (Cultural Requirements)  
3. الرياضيات والعلوم الأساسية (Math & Basic Sciences)
4. أساسيات الهندسة (Engineering Fundamentals)
5. هندسة الكهرباء والإلكترونيات (Electrical & Electronics Engineering)
6. علوم الحاسوب والبرمجة (Computer Science & Programming)
7. شبكات الحاسوب والاتصالات (Networks & Communications)
8. الأمن السيبراني والتحقيقات الرقمية (Cybersecurity & Digital Forensics)
9. تقنيات متقدمة (Advanced Technologies)
10. مشاريع وتدريب (Projects & Training)

### FileTypes الأساسية:
1. محاضرات (Lectures)
2. سلايدات (Slides)
3. كتب (Books)
4. شيتات (Sheets) 
5. امتحانات (Exams)
6. مشاريع (Projects)
7. فيديوهات (Videos)
8. ملاحظات (Notes)

## 🔄 Migration Plan:
1. إنشاء Collections الجديدة في Appwrite
2. إدخال البيانات الأولية
3. تحديث Materials Collection بالـ Attributes الجديدة
4. Migration الملفات الموجودة للنظام الجديد
5. تحديث الكود ليدعم النظام الهرمي الجديد