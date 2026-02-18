#!/usr/bin/env node

/**
 * PocketBase Admin Setup Script
 * استخدم fetch API بدل SDK لتجنب dependency issues
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
    console.log('🔐 جاري تسجيل الدخول...')
    const auth = await request('/api/admins/auth-with-password', {
      method: 'POST',
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    adminToken = auth.token
    console.log('✅ تم تسجيل الدخول بنجاح\n')

    // 1. عرض Collections
    console.log('📚 === فحص Collections ===\n')
    const collectionsRes = await request('/api/collections')
    const collections = collectionsRes.items || collectionsRes || []
    
    console.log('الـ Collections الموجودة:')
    for (const coll of collections) {
      if (coll && !coll.name.startsWith('_')) {
        try {
          const count = await request(`/api/collections/${coll.id}/records?perPage=1`)
          console.log(`  ✓ ${coll.name} (${count.totalItems} سجل)`)
        } catch (e) {
          console.log(`  ✓ ${coll.name}`)
        }
      }
    }

    // 2. تحقق من Fields في materials
    console.log('\n📋 === فحص Materials Collection ===')
    const materialsCollection = collections.find(c => c && c.name === 'materials')
    if (materialsCollection) {
      console.log('Fields الموجودة:')
      if (materialsCollection.schema) {
        materialsCollection.schema.forEach(field => {
          console.log(`  ✓ ${field.name} (${field.type})`)
        })
      }
    } else {
      console.log('⚠️  Collection "materials" غير موجود')
    }

    // 3. عرض عينة من البيانات
    console.log('\n📊 === عينة من البيانات ===\n')
    
    const usersData = await request('/api/collections/users/records?perPage=5')
    console.log(`👥 Users (${usersData.totalItems} إجمالي):`)
    usersData.items.forEach((u, i) => {
      console.log(`  ${i+1}. ${u.email}`)
    })

    const materialsData = await request('/api/collections/materials/records?perPage=5&expand=uploaderId,subjectId')
    console.log(`\n📚 Materials (${materialsData.totalItems} إجمالي):`)
    if (materialsData.items.length > 0) {
      materialsData.items.forEach((m, i) => {
        console.log(`  ${i+1}. ${m.title}`)
        console.log(`     - averageRating: ${m.averageRating || 'غير موجود'}`)
        console.log(`     - downloads: ${m.downloads || 'غير موجود'}`)
      })
    } else {
      console.log('  (لا توجد مواد حالياً)')
    }

    // 4. إحصائيات
    console.log('\n📈 === الإحصائيات ===')
    const subjectsData = await request('/api/collections/subjects/records?perPage=1')
    const ratingsData = await request('/api/collections/material_ratings/records?perPage=1')
    const reportsData = await request('/api/collections/material_reports/records?perPage=1')

    console.log(`Subjects: ${subjectsData.totalItems}`)
    console.log(`Ratings: ${ratingsData.totalItems}`)
    console.log(`Reports: ${reportsData.totalItems}`)

    console.log('\n✅ انتهى الفحص!')

  } catch (error) {
    console.error('❌ خطأ:', error.message)
    process.exit(1)
  }
}

main()
