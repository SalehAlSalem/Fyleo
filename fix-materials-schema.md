# 🔧 إصلاح Database Schema - materials Collection

## المشكلة الحالية:
- `createdAt` attribute غير موجود في schema
- `fileId` attribute مفقود من collection  

## 🛠️ خطوات الإصلاح:

### 1. اذهب إلى Appwrite Console:
https://cloud.appwrite.io → مشروعك → Databases → Collection `materials`

### 2. انقر على تبويب `Attributes`

### 3. اضف Attributes التالية (انقر `Create Attribute` لكل واحد):

#### Required Attributes:
```
1. fileId
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌
   
2. title  
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

3. category
   - Type: String  
   - Size: 100
   - Required: ✅
   - Array: ❌

4. uploadedBy
   - Type: String
   - Size: 255  
   - Required: ✅
   - Array: ❌

5. fileName
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

6. fileSize
   - Type: Integer
   - Required: ✅
   - Array: ❌

7. mimeType
   - Type: String
   - Size: 100
   - Required: ✅
   - Array: ❌

8. downloadURL
   - Type: String
   - Size: 500
   - Required: ✅
   - Array: ❌

9. createdAt
   - Type: DateTime
   - Required: ✅
   - Array: ❌

10. updatedAt
    - Type: DateTime
    - Required: ✅
    - Array: ❌
```

#### Optional Attributes:
```
11. description
    - Type: String
    - Size: 1000
    - Required: ❌
    - Array: ❌

12. subject
    - Type: String
    - Size: 100
    - Required: ❌
    - Array: ❌

13. viewURL
    - Type: String
    - Size: 500
    - Required: ❌
    - Array: ❌
```

### 4. إنشاء Indexes (تبويب `Indexes`):

```
1. index_uploadedBy
   - Type: key
   - Attributes: uploadedBy (ASC)

2. index_category  
   - Type: key
   - Attributes: category (ASC)

3. index_createdAt
   - Type: key
   - Attributes: createdAt (DESC)

4. index_subject
   - Type: key
   - Attributes: subject (ASC)
```

### 5. بعد الانتهاء:
- احفظ التغييرات
- انتظر حتى يكتمل إنشاء Attributes (قد يستغرق دقائق قليلة)
- ارجع للتطبيق وجرب رفع ملف

---

**ملاحظة:** إنشاء Attributes قد يستغرق وقت. تأكد من انتظار اكتمال كل attribute قبل إضافة التالي.