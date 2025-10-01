# 📥 Collection: downloads

## إعدادات Collection:
- **Collection ID**: `downloads`
- **Name**: `Downloads`

## Attributes (الحقول):

### 1. userId
- **Type**: String
- **Size**: 255
- **Required**: ✅ Yes
- **Array**: ❌ No

### 2. fileId
- **Type**: String
- **Size**: 255
- **Required**: ✅ Yes
- **Array**: ❌ No

### 3. downloadedAt
- **Type**: DateTime
- **Required**: ✅ Yes
- **Array**: ❌ No

## Indexes (الفهارس):

### 1. user_idx
- **Type**: Key
- **Attributes**: [`userId`]

### 2. file_idx
- **Type**: Key
- **Attributes**: [`fileId`]

## Permissions (الصلاحيات):
```
read("users")
create("users")
```