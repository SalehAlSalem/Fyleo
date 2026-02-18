// PocketBase Migration - Enrollments & Progress
// تسجيل الطلاب وتتبع التقدم

migrate((db) => {
  // جدول التسجيل في الكورسات
  const enrollmentsCollection = new Collection({
    name: "enrollments",
    type: "base",
    system: false,
    schema: [
      {
        name: "student",
        type: "relation",
        required: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
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
        name: "status",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["active", "completed", "dropped", "suspended"]
        }
      },
      {
        name: "progress",
        type: "number",
        required: true
      },
      {
        name: "enrolled_at",
        type: "date",
        required: true
      },
      {
        name: "completed_at",
        type: "date",
        required: false
      }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_enrollments_unique ON enrollments(student, course)"
    ]
  })

  $app.dao().saveCollection(enrollmentsCollection)

  // جدول تقدم الدروس
  const progressCollection = new Collection({
    name: "lesson_progress",
    type: "base",
    system: false,
    schema: [
      {
        name: "student",
        type: "relation",
        required: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "lesson",
        type: "relation",
        required: true,
        options: {
          collectionId: "lessons",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "is_completed",
        type: "bool",
        required: true
      },
      {
        name: "time_spent",
        type: "number",
        required: false
      },
      {
        name: "last_accessed",
        type: "date",
        required: true
      }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_progress_unique ON lesson_progress(student, lesson)"
    ]
  })

  return $app.dao().saveCollection(progressCollection)
}, (db) => {
  const progressCollection = $app.dao().findCollectionByNameOrId("lesson_progress")
  $app.dao().deleteCollection(progressCollection)
  
  const enrollmentsCollection = $app.dao().findCollectionByNameOrId("enrollments")
  return $app.dao().deleteCollection(enrollmentsCollection)
})
