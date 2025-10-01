# 📋 دليل إنشاء Collections الجديدة في Appwrite

## 🎯 المطلوب إنشاؤه:

### 1. Categories Collection 
```
Collection ID: categories
```

#### Attributes:
```
1. name
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

2. nameAr  
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

3. nameEn
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

4. description
   - Type: String
   - Size: 1000
   - Required: ❌
   - Array: ❌

5. icon
   - Type: String
   - Size: 100
   - Required: ❌
   - Array: ❌

6. color
   - Type: String
   - Size: 50
   - Required: ❌
   - Array: ❌

7. order
   - Type: Integer
   - Required: ✅
   - Array: ❌

8. isActive
   - Type: Boolean
   - Required: ✅
   - Default: true
   - Array: ❌
```

#### Indexes:
```
1. index_order
   - Type: key
   - Attributes: order (ASC)

2. index_isActive
   - Type: key  
   - Attributes: isActive (ASC)
```

---

### 2. Subjects Collection
```
Collection ID: subjects
```

#### Attributes:
```
1. name
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

2. nameAr
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

3. nameEn
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

4. categoryId
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

5. description
   - Type: String
   - Size: 1000
   - Required: ❌
   - Array: ❌

6. creditHours
   - Type: Integer
   - Required: ❌
   - Array: ❌

7. level
   - Type: String
   - Size: 100
   - Required: ❌
   - Array: ❌

8. prerequisite
   - Type: String
   - Size: 500
   - Required: ❌
   - Array: ❌

9. isActive
   - Type: Boolean
   - Required: ✅
   - Default: true
   - Array: ❌
```

#### Indexes:
```
1. index_categoryId
   - Type: key
   - Attributes: categoryId (ASC)

2. index_isActive
   - Type: key
   - Attributes: isActive (ASC)

3. index_name
   - Type: key
   - Attributes: name (ASC)
```

---

### 3. FileTypes Collection
```
Collection ID: fileTypes
```

#### Attributes:
```
1. name
   - Type: String
   - Size: 100
   - Required: ✅
   - Array: ❌

2. nameAr
   - Type: String
   - Size: 100
   - Required: ✅
   - Array: ❌

3. nameEn
   - Type: String
   - Size: 100
   - Required: ✅
   - Array: ❌

4. icon
   - Type: String
   - Size: 100
   - Required: ❌
   - Array: ❌

5. color
   - Type: String
   - Size: 50
   - Required: ❌
   - Array: ❌

6. allowedFormats
   - Type: String
   - Size: 500
   - Required: ❌
   - Array: ❌
```

---

### 4. تحديث Materials Collection
```
Collection ID: materials (الموجود حالياً)
```

#### إضافة Attributes جديدة:
```
1. categoryId
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

2. subjectId
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

3. fileTypeId
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

4. tags
   - Type: String
   - Size: 500
   - Required: ❌
   - Array: ❌

5. semester
   - Type: String
   - Size: 50
   - Required: ❌
   - Array: ❌

6. year
   - Type: String
   - Size: 50
   - Required: ❌
   - Array: ❌
```

#### إضافة Indexes جديدة:
```
1. index_categoryId
   - Type: key
   - Attributes: categoryId (ASC)

2. index_subjectId
   - Type: key
   - Attributes: subjectId (ASC)

3. index_fileTypeId
   - Type: key
   - Attributes: fileTypeId (ASC)

4. index_category_subject
   - Type: key
   - Attributes: categoryId (ASC), subjectId (ASC)
```

---

## 🚀 خطوات التنفيذ:

### 1. انتقل إلى Appwrite Console:
https://cloud.appwrite.io → مشروعك → Databases → Database ID: 68d97982002b686c7151

### 2. إنشاء Collections:
- انقر "Create Collection"
- أدخل Collection ID و Name
- اضبط Permissions (اتركها default للآن)

### 3. إضافة Attributes:
- انقر على Collection → تبويب "Attributes"  
- انقر "Create Attribute" لكل attribute
- املأ البيانات حسب المعطى أعلاه

### 4. إضافة Indexes:
- انقر على Collection → تبويب "Indexes"
- انقر "Create Index" لكل index
- اختر Attributes المطلوبة

### 5. إعداد Permissions:
```
Read: any
Create: users
Update: users  
Delete: users
```

---

## ⚠️ ملاحظات مهمة:

1. **الترتيب مهم**: أنشئ Categories أولاً، ثم Subjects، ثم FileTypes، وأخيراً حدث Materials
2. **انتظار اكتمال**: انتظر اكتمال إنشاء كل Attribute قبل إضافة التالي
3. **النسخ الاحتياطي**: تأكد من أن لديك نسخة احتياطية من البيانات الحالية
4. **التدرج**: يمكن تطبيق التحديثات تدريجياً collection بـ collection

---

بعد الانتهاء من إنشاء Collections، سنبدأ بإدخال البيانات الأولية وتحديث الكود.