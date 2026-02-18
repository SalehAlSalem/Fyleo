// PocketBase Migration - Courses
// جدول الكورسات الدراسية

migrate((db) => {
  const collection = new Collection({
    name: "courses",
    type: "base",
    system: false,
    schema: [
      {
        name: "title",
        type: "text",
        required: true,
        options: {
          min: 3,
          max: 200
        }
      },
      {
        name: "slug",
        type: "text",
        required: true,
        unique: true
      },
      {
        name: "description",
        type: "editor",
        required: true
      },
      {
        name: "thumbnail",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"]
        }
      },
      {
        name: "instructor",
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
        name: "category",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: [
            "computer_science",
            "mathematics",
            "physics",
            "chemistry",
            "biology",
            "engineering",
            "business",
            "arts",
            "languages",
            "other"
          ]
        }
      },
      {
        name: "level",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["beginner", "intermediate", "advanced"]
        }
      },
      {
        name: "university",
        type: "text",
        required: false
      },
      {
        name: "semester",
        type: "text",
        required: false
      },
      {
        name: "credits",
        type: "number",
        required: false
      },
      {
        name: "is_published",
        type: "bool",
        required: true
      },
      {
        name: "enrollment_limit",
        type: "number",
        required: false
      },
      {
        name: "tags",
        type: "json",
        required: false
      }
    ],
    indexes: [
      "CREATE INDEX idx_courses_slug ON courses(slug)",
      "CREATE INDEX idx_courses_instructor ON courses(instructor)",
      "CREATE INDEX idx_courses_category ON courses(category)"
    ]
  })

  return $app.dao().saveCollection(collection)
}, (db) => {
  const collection = $app.dao().findCollectionByNameOrId("courses")
  return $app.dao().deleteCollection(collection)
})
