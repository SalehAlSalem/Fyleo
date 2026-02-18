/**
 * Debug helper للتحقق من حالة PocketBase والبيانات
 * استخدم: runPocketBaseDebug() في console
 */

import { pb } from './pocketbase'

export async function runPocketBaseDebug() {
  console.log('🔍 === PocketBase Debug Report ===\n')

  try {
    // 1. التحقق من الاتصال
    console.log('1️⃣ Connection Check:')
    const health = await pb.health.check()
    console.log('✅ PocketBase is online', health)
    console.log('URL:', pb.baseUrl)
    console.log()

    // 2. قائمة Collections
    console.log('2️⃣ Collections:')
    const collections = await pb.collection('_pb_collections_').getFullList()
    console.log('Available collections:', collections.map(c => c.name))
    console.log()

    // 3. عدد المستخدمين
    console.log('3️⃣ Users Count:')
    try {
      const users = await pb.collection('users').getList(1, 1)
      console.log(`✅ Users found: ${users.totalItems}`)
    } catch (e) {
      console.error('❌ Failed to fetch users:', e)
    }
    console.log()

    // 4. عدد المواد
    console.log('4️⃣ Materials Count:')
    try {
      const materials = await pb.collection('materials').getList(1, 1)
      console.log(`✅ Materials found: ${materials.totalItems}`)
      if (materials.items.length > 0) {
        console.log('Sample material:', materials.items[0])
      }
    } catch (e) {
      console.error('❌ Failed to fetch materials:', e)
    }
    console.log()

    // 5. عدد المواضيع
    console.log('5️⃣ Subjects Count:')
    try {
      const subjects = await pb.collection('subjects').getList(1, 1)
      console.log(`✅ Subjects found: ${subjects.totalItems}`)
    } catch (e) {
      console.error('❌ Failed to fetch subjects:', e)
    }
    console.log()

    // 6. OAuth Methods
    console.log('6️⃣ OAuth Methods:')
    try {
      const methods = await pb.collection('users').listAuthMethods()
      console.log('Auth methods available:')
      console.log('- Email/Password:', methods.emailPassword)
      console.log('- OAuth Providers:', methods.authProviders?.map(p => ({
        name: p.name,
        state: p.state,
        authUrl: p.authUrl
      })))
    } catch (e) {
      console.error('❌ Failed to fetch auth methods:', e)
    }
    console.log()

    // 7. Current Auth
    console.log('7️⃣ Current Auth:')
    console.log('Authenticated:', pb.authStore.isValid)
    console.log('Token:', pb.authStore.token ? '✅ Present' : '❌ Missing')
    console.log('User:', pb.authStore.model)
    console.log()

    console.log('✅ === Debug Report Complete ===')
  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

// جعله متاح في window للوصول من console
if (typeof window !== 'undefined') {
  (window as any).debugPocketBase = runPocketBaseDebug
}
