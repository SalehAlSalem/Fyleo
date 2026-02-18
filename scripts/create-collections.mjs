#!/usr/bin/env node

/**
 * الحصول على IDs الصحيحة ثم إنشاء Collections
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

  if (!res.ok) {
    const text = await res.text()
    const error = new Error(`${res.status}: ${text}`)
    error.status = res.status
    throw error
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

    // 1. الحصول على IDs
    console.log('🔍 جاري الحصول على معرفات Collections...')
    const collections = await request('/api/collections')
    const collList = collections.items || collections || []
    
    const materialsId = collList.find(c => c && c.name === 'materials')?.id
    const usersId = collList.find(c => c && c.name === 'users')?.id
    
    console.log(`  ✓ materials ID: ${materialsId}`)
    console.log(`  ✓ users ID: ${usersId}\n`)

    if (!materialsId || !usersId) {
      throw new Error('لم يتم العثور على collections الأساسية')
    }

    // 2. إنشاء Collections الناقصة
    console.log('📚 إنشاء Collections الناقصة...\n')

    const ratingsCollection = {
      name: 'material_ratings',
      type: 'base',
      schema: [
        { name: 'material', type: 'relation', options: { collectionId: materialsId, maxSelect: 1 } },
        { name: 'user', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'rating', type: 'number' },
        { name: 'comment', type: 'text' },
      ]
    }

    try {
      await request('/api/collections', {
        method: 'POST',
        body: JSON.stringify(ratingsCollection),
      })
      console.log('  ✅ material_ratings تم إنشاؤه')
    } catch (e) {
      if (e.message.includes('duplicate')) {
        console.log('  ✓ material_ratings موجود بالفعل')
      } else {
        throw e
      }
    }

    const reportsCollection = {
      name: 'material_reports',
      type: 'base',
      schema: [
        { name: 'material', type: 'relation', options: { collectionId: materialsId, maxSelect: 1 } },
        { name: 'user', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'reason', type: 'select', options: { values: ['inappropriate', 'spam', 'copyright', 'malware', 'other'], maxSelect: 1 } },
        { name: 'details', type: 'text' },
        { name: 'status', type: 'select', options: { values: ['open', 'reviewing', 'resolved', 'rejected'], maxSelect: 1 } },
      ]
    }

    try {
      await request('/api/collections', {
        method: 'POST',
        body: JSON.stringify(reportsCollection),
      })
      console.log('  ✅ material_reports تم إنشاؤه')
    } catch (e) {
      if (e.message.includes('duplicate')) {
        console.log('  ✓ material_reports موجود بالفعل')
      } else {
        throw e
      }
    }

    console.log('\n✅ انتهى الإصلاح بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error.message)
    process.exit(1)
  }
}

main()
