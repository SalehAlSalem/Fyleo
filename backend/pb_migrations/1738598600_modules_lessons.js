// PocketBase Migration - Modules & Lessons
// وحدات ودروس الكورسات

migrate((db) => {
  // جدول الوحدات
  const modulesCollection = new Collection({
    name: "modules",
    type: "base",
    system: false,
    schema: [
      {
        name: "course",
        type: "relation",
        required: true,
        options: {
          collectionId: "courses",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "title",
        type: "text",
        required: true
      },
      {
        name: "description",
        type: "editor",
        required: false
      },
      {
        name: "order",
        type: "number",
        required: true
      },
      {
        name: "is_published",
        type: "bool",
        required: true
      }
    ]
  })

  $app.dao().saveCollection(modulesCollection)

  // جدول الدروس
  const lessonsCollection = new Collection({
    name: "lessons",
    type: "base",
    system: false,
    schema: [
      {
        name: "module",
        type: "relation",
        required: true,
        options: {
          collectionId: "modules",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "title",
        type: "text",
        required: true
      },
      {
        name: "content",
        type: "editor",
        required: true
      },
      {
        name: "type",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["video", "text", "quiz", "assignment", "file", "interactive"]
        }
      },
      {
        name: "video_url",
        type: "url",
        required: false
      },
      {
        name: "duration",
        type: "number",
        required: false
      },
      {
        name: "order",
        type: "number",
        required: true
      },
      {
        name: "attachments",
        type: "file",
        required: false,
        options: {
          maxSelect: 10,
          maxSize: 52428800, // 50MB
          mimeTypes: ["application/pdf", "image/*", "video/*", "application/zip"]
        }
      },
      {
        name: "is_free",
        type: "bool",
        required: true
      }
    ]
  })

  return $app.dao().saveCollection(lessonsCollection)
}, (db) => {
  const lessonsCollection = $app.dao().findCollectionByNameOrId("lessons")
  $app.dao().deleteCollection(lessonsCollection)
  
  const modulesCollection = $app.dao().findCollectionByNameOrId("modules")
  return $app.dao().deleteCollection(modulesCollection)
})
