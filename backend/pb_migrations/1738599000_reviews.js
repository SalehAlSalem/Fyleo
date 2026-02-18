// PocketBase Migration - Reviews & Ratings
// التقييمات والمراجعات

migrate((db) => {
  const collection = new Collection({
    name: "reviews",
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
        name: "rating",
        type: "number",
        required: true,
        options: {
          min: 1,
          max: 5
        }
      },
      {
        name: "comment",
        type: "text",
        required: false
      },
      {
        name: "helpful_count",
        type: "number",
        required: true
      }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_reviews_unique ON reviews(course, student)"
    ]
  })

  return $app.dao().saveCollection(collection)
}, (db) => {
  const collection = $app.dao().findCollectionByNameOrId("reviews")
  return $app.dao().deleteCollection(collection)
})
