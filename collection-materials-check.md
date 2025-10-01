# 📁 Collection: materials (موجود مسبقاً - للتحقق)

## إعدادات Collection:
- **Collection ID**: `materials`
- **Name**: `Materials`

## Attributes المطلوبة (تأكد من وجودها):

### الحقول الأساسية:
1. **name** - String, 255, Required
2. **description** - String, 1000, Optional
3. **fileId** - String, 255, Required
4. **fileName** - String, 255, Required
5. **fileSize** - Integer, Required
6. **fileType** - String, 100, Required
7. **category** - String, 100, Required
8. **subject** - String, 100, Required
9. **uploaderId** - String, 255, Required
10. **uploaderName** - String, 255, Required

### الحقول الإضافية:
11. **downloadCount** - Integer, Optional, Default: 0
12. **isPublic** - Boolean, Required, Default: true
13. **semester** - String, 50, Optional
14. **tags** - String, 500, Optional, Array

## Indexes المطلوبة:
1. **category_idx** - Key - [`category`]
2. **subject_idx** - Key - [`subject`]
3. **uploader_idx** - Key - [`uploaderId`]

## Permissions:
```
read("any")
create("users")
update("users")
delete("users")
```