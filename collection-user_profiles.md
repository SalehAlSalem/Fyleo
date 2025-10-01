# 👤 Collection: user_profiles

## إعدادات Collection:
- **Collection ID**: `user_profiles`
- **Name**: `User Profiles`

## Attributes (الحقول):

### 1. userId
- **Type**: String
- **Size**: 255
- **Required**: ✅ Yes
- **Array**: ❌ No

### 2. bio
- **Type**: String
- **Size**: 500
- **Required**: ❌ No (Optional)
- **Array**: ❌ No

### 3. university
- **Type**: String
- **Size**: 255
- **Required**: ❌ No (Optional)
- **Array**: ❌ No

### 4. major
- **Type**: String
- **Size**: 255
- **Required**: ❌ No (Optional)
- **Array**: ❌ No

### 5. semester
- **Type**: String
- **Size**: 50
- **Required**: ❌ No (Optional)
- **Array**: ❌ No

## Indexes (الفهارس):

### 1. user_unique
- **Type**: Unique
- **Attributes**: [`userId`]

## Permissions (الصلاحيات):
```
read("any")
create("users")
update("users")
```