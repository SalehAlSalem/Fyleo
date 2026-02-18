#!/usr/bin/env node

/**
 * إصلاح PocketBase - إضافة Collections و Fields الناقصة
 */

const PB_URL = 'https://pocketbase97.mooo.com'
const ADMIN_EMAIL = 'salehbawaneh@gmail.com'
const ADMIN_PASSWORD = 'Bawa3neh.2000'

let adminToken = null

async function request(path, options = {}) {
  const url = `${PB_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (adminToken) {
    headers['Authorization'] = adminToken
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok && res.status !== 409) {
    const text = await res.text()
    throw new Error(`${res.status}: ${text}`)
  }

  try {
    return await res.json()
  } catch {
    return null
  }
}

async function main() {
  try {
    console.log('🔐 تسجيل الدخول...')
    const auth = await request('/api/admins/auth-with-password', {
      method: 'POST',
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    adminToken = auth.token
    console.log('✅ تم تسجيل الدخول\n')

    // 1. إضافة fields للـ materials collection
    console.log('🔧 إضافة fields ناقصة إلى materials...')
    await addFieldsToMaterials()

    // 2. إنشاء collections الناقصة
    console.log('\n📚 إنشاء Collections الناقصة...')
    await createMissingCollections()

    console.log('\n✅ انتهى الإصلاح بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error.message)
    process.exit(1)
  }
}

async function addFieldsToMaterials() {
  try {
    const materials = await request('/api/collections/materials')
    
    const fieldsToAdd = [
      { name: 'averageRating', type: 'number', required: false },
      { name: 'totalRatings', type: 'number', required: false },
      { name: 'downloads', type: 'number', required: false },
      { name: 'views', type: 'number', required: false },
    ]

    for (const field of fieldsToAdd) {
      try {
        const existingField = materials.schema.find(f => f.name === field.name)
        if (!existingField) {
          materials.schema.push(field)
          console.log(`  ✅ إضافة field: ${field.name}`)
        } else {
          console.log(`  ✓ field موجود: ${field.name}`)
        }
      } catch (e) {
        console.log(`  ⚠️  ${field.name}: ${e.message}`)
      }
    }

    await request(`/api/collections/materials`, {
      method: 'PATCH',
      body: JSON.stringify(materials),
    })

  } catch (error) {
    console.error(`  ❌ خطأ:`, error.message)
  }
}

async function createMissingCollections() {
  const collectionsToCreate = [
    {
      name: 'material_ratings',
      type: 'base',
      schema: [
        { name: 'material', type: 'relation', options: { collectionId: 'materials', maxSelect: 1 } },
        { name: 'user', type: 'relation', options: { collectionId: 'users', maxSelect: 1 } },
        { name: 'rating', type: 'number' },
        { name: 'comment', type: 'text' },
      ]
    },
    {
      name: 'material_reports',
      type: 'base',
      schema: [
        { name: 'material', type: 'relation', options: { collectionId: 'materials', maxSelect: 1 } },
        { name: 'user', type: 'relation', options: { collectionId: 'users', maxSelect: 1 } },
        { name: 'reason', type: 'select', options: { values: ['inappropriate', 'spam', 'copyright', 'malware', 'other'] } },
        { name: 'details', type: 'text' },
        { name: 'status', type: 'select', options: { values: ['open', 'reviewing', 'resolved', 'rejected'] } },
      ]
    }
  ]

  for (const collDef of collectionsToCreate) {
    try {
      await request('/api/collections', {
        method: 'POST',
        body: JSON.stringify(collDef),
      })
      console.log(`  ✅ ${collDef.name}`)
    } catch (error) {
      if (error.message.includes('duplicate')) {
        console.log(`  ✓ ${collDef.name} موجود بالفعل`)
      } else {
        console.log(`  ❌ ${collDef.name}: ${error.message}`)
      }
    }
  }
}

main()
