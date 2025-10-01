# 🚀 خيار سريع: إعادة إنشاء materials Collection

إذا كان لديك بيانات قليلة في collection `materials` ولا تمانع في حذفها وإعادة إنشائها:

## 1. حذف Collection الحالي:
- اذهب إلى Appwrite Console → Databases → Collection `materials`
- Settings → Delete Collection

## 2. إنشاء Collection جديد:
```
Collection Name: materials
Collection ID: materials
```

## 3. إضافة Attributes دفعة واحدة:

### String Attributes:
```
fileId (String, 255, Required)
title (String, 255, Required)  
category (String, 100, Required)
uploadedBy (String, 255, Required)
fileName (String, 255, Required)
mimeType (String, 100, Required)
downloadURL (String, 500, Required)
description (String, 1000, Optional)
subject (String, 100, Optional)
viewURL (String, 500, Optional)
```

### Other Types:
```
fileSize (Integer, Required)
createdAt (DateTime, Required)
updatedAt (DateTime, Required)
```

## 4. Permissions:
```
Read: role:all
Create: role:all
Update: role:all
Delete: role:all
```

## 5. Indexes:
```
index_uploadedBy: uploadedBy (ASC)
index_category: category (ASC)  
index_createdAt: createdAt (DESC)
```

---

**ملاحظة:** هذا سيحذف أي ملفات مرفوعة سابقاً في Database (لكن الملفات في Storage ستبقى).