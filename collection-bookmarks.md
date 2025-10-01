# 📚 Collection: bookmarks

## إعدادات Collection:
- **Collection ID**: `bookmarks`
- **Name**: `Bookmarks`

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

## Indexes (الفهارس):

### 1. user_idx
- **Type**: Key
- **Attributes**: [`userId`]

### 2. unique_bookmark
- **Type**: Unique
- **Attributes**: [`userId`, `fileId`]

## Permissions (الصلاحيات):
```
read("users")
create("users") 
delete("users")
```