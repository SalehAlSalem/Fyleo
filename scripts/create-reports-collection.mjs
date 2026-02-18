#!/usr/bin/env node

// Create material_reports collection in PocketBase
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

// Admin login
const ADMIN_EMAIL = 'salehbawaneh@gmail.com'
const ADMIN_PASSWORD = 'Bawa3neh.2000'

async function createMaterialReportsCollection() {
  try {
    console.log('\n🔐 تسجيل دخول Admin...')
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ تم تسجيل الدخول بنجاح')

    console.log('\n📝 إنشاء collection: material_reports...')

    // Check if collection exists first
    try {
      await pb.collection('material_reports').getList(1, 1)
      console.log('⚠️  Collection موجود بالفعل')
      return
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }
    }

    // Create the collection via API
    const collection = await pb.collections.create({
      name: 'material_reports',
      type: 'base',
      schema: [
        {
          name: 'material',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'materials',
            cascadeDelete: true,
            minSelect: 1,
            maxSelect: 1,
          },
        },
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users',
            cascadeDelete: false,
            minSelect: 1,
            maxSelect: 1,
          },
        },
        {
          name: 'reason',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['inappropriate', 'spam', 'copyright', 'malware', 'other'],
          },
        },
        {
          name: 'details',
          type: 'text',
          required: false,
          options: {
            min: 0,
            max: 1000,
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['open', 'reviewing', 'resolved', 'rejected'],
          },
        },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: 'user = @request.auth.id',
      deleteRule: 'user = @request.auth.id',
    })

    console.log('✅ تم إنشاء collection بنجاح:', collection.name)
    console.log('\n✅ جميع الـ fields والـ rules تم تكوينها بنجاح')
  } catch (error) {
    console.error('❌ خطأ:', error.message)
    if (error.response?.data) {
      console.error('تفاصيل الخطأ:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

createMaterialReportsCollection().catch(console.error)
