// PocketBase Migration - Study Materials
// المواد الدراسية والملفات

migrate((db) => {
  const collection = new Collection({
    name: "study_materials",
    type: "base",
    system: false,
    schema: [
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
        name: "uploader",
        type: "relation",
        required: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "type",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: [
            "notes",
            "slides",
            "assignment",
            "exam",
            "solution",
            "book",
            "article",
            "other"
          ]
        }
      },
      {
        name: "files",
        type: "file",
        required: true,
        options: {
          maxSelect: 20,
          maxSize: 104857600, // 100MB
          mimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "image/*"
          ]
        }
      },
      {
        name: "tags",
        type: "json",
        required: false
      },
      {
        name: "downloads",
        type: "number",
        required: true
      },
      {
        name: "views",
        type: "number",
        required: true
      },
      {
        name: "rating",
        type: "number",
        required: false
      },
      {
        name: "is_verified",
        type: "bool",
        required: true
      }
    ],
    indexes: [
      "CREATE INDEX idx_materials_course ON study_materials(course)",
      "CREATE INDEX idx_materials_uploader ON study_materials(uploader)",
      "CREATE INDEX idx_materials_type ON study_materials(type)"
    ]
  })

  return $app.dao().saveCollection(collection)
}, (db) => {
  const collection = $app.dao().findCollectionByNameOrId("study_materials")
  return $app.dao().deleteCollection(collection)
})
