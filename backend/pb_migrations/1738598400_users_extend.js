// PocketBase Migration - Initial Schema
// تاريخ الإنشاء: 2026-02-03

migrate((db) => {
  // جدول المستخدمين موجود افتراضياً في PocketBase
  // نضيف حقول إضافية له

  const usersCollection = $app.dao().findCollectionByNameOrId("users")
  
  // إضافة حقول جديدة
  usersCollection.schema.addField(new SchemaField({
    name: "role",
    type: "select",
    required: true,
    options: {
      maxSelect: 1,
      values: ["student", "teacher", "admin", "moderator"]
    }
  }))

  usersCollection.schema.addField(new SchemaField({
    name: "bio",
    type: "text",
    required: false
  }))

  usersCollection.schema.addField(new SchemaField({
    name: "avatar",
    type: "file",
    required: false,
    options: {
      maxSelect: 1,
      maxSize: 5242880, // 5MB
      mimeTypes: ["image/jpeg", "image/png", "image/gif"]
    }
  }))

  usersCollection.schema.addField(new SchemaField({
    name: "university",
    type: "text",
    required: false
  }))

  usersCollection.schema.addField(new SchemaField({
    name: "major",
    type: "text",
    required: false
  }))

  usersCollection.schema.addField(new SchemaField({
    name: "year",
    type: "number",
    required: false
  }))

  return $app.dao().saveCollection(usersCollection)
}, (db) => {
  // Rollback
  const usersCollection = $app.dao().findCollectionByNameOrId("users")
  
  usersCollection.schema.removeField("role")
  usersCollection.schema.removeField("bio")
  usersCollection.schema.removeField("avatar")
  usersCollection.schema.removeField("university")
  usersCollection.schema.removeField("major")
  usersCollection.schema.removeField("year")

  return $app.dao().saveCollection(usersCollection)
})
