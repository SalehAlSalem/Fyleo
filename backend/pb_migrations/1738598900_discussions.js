// PocketBase Migration - Discussions & QA
// منتديات النقاش والأسئلة والأجوبة

migrate((db) => {
  // جدول المواضيع
  const discussionsCollection = new Collection({
    name: "discussions",
    type: "base",
    system: false,
    schema: [
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
        name: "author",
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
          values: ["question", "discussion", "announcement"]
        }
      },
      {
        name: "is_pinned",
        type: "bool",
        required: true
      },
      {
        name: "is_locked",
        type: "bool",
        required: true
      },
      {
        name: "views",
        type: "number",
        required: true
      },
      {
        name: "tags",
        type: "json",
        required: false
      }
    ]
  })

  $app.dao().saveCollection(discussionsCollection)

  // جدول الردود
  const repliesCollection = new Collection({
    name: "replies",
    type: "base",
    system: false,
    schema: [
      {
        name: "discussion",
        type: "relation",
        required: true,
        options: {
          collectionId: "discussions",
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: "author",
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
        name: "content",
        type: "editor",
        required: true
      },
      {
        name: "parent_reply",
        type: "relation",
        required: false,
        options: {
          collectionId: "replies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1
        }
      },
      {
        name: "is_solution",
        type: "bool",
        required: true
      },
      {
        name: "attachments",
        type: "file",
        required: false,
        options: {
          maxSelect: 5,
          maxSize: 10485760 // 10MB
        }
      }
    ]
  })

  return $app.dao().saveCollection(repliesCollection)
}, (db) => {
  const repliesCollection = $app.dao().findCollectionByNameOrId("replies")
  $app.dao().deleteCollection(repliesCollection)
  
  const discussionsCollection = $app.dao().findCollectionByNameOrId("discussions")
  return $app.dao().deleteCollection(discussionsCollection)
})
