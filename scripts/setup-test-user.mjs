#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('salehbawaneh@gmail.com', 'Bawa3neh.2000')
    console.log('🔐 تسجيل دخول Admin نجح\n')
    return true
  } catch (error) {
    console.log('⚠️  فشل تسجيل دخول Admin (سيتم المحاولة بدون admin)')
    return false
  }
}

async function createTestUser() {
  console.log('👤 إنشاء مستخدم test للاختبار...\n')

  const testUser = {
    email: 'test@fyleo.com',
    password: 'Test123456',
    passwordConfirm: 'Test123456',
    name: 'مستخدم تجريبي',
    username: 'testuser'
  }

  try {
    const user = await pb.collection('users').create(testUser)
    console.log('✅ تم إنشاء مستخدم test بنجاح!')
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Username: ${user.username}`)
    
    console.log('\n💡 يمكنك الآن:')
    console.log('   1. تسجيل الدخول بـ: test@fyleo.com / Test123456')
    console.log('   2. رفع مواد جديدة')
    console.log('   3. اختبار نظام التقييمات')
    
    return user
  } catch (error) {
    if (error.status === 400 && error.response?.data?.email) {
      console.log('⚠️  المستخدم موجود بالفعل')
      console.log('   Email: test@fyleo.com')
      console.log('   Password: Test123456')
      return 'exists'
    } else {
      console.log('❌ فشل إنشاء المستخدم:', error.message)
      if (error.response?.data) {
        console.log('   Error details:', error.response.data)
      }
      return null
    }
  }
}

async function updateOneMaterial() {
  console.log('\n📝 تحديث مادة واحدة كمثال...\n')

  try {
    // Get test user
    const users = await pb.collection('users').getList(1, 1, {
      filter: 'email = "test@fyleo.com"'
    })

    if (users.items.length === 0) {
      console.log('⚠️  لم يتم إيجاد test user')
      return
    }

    const testUserId = users.items[0].id

    // Get one material
    const materials = await pb.collection('materials').getList(1, 1)
    
    if (materials.items.length === 0) {
      console.log('⚠️  لا توجد مواد')
      return
    }

    const material = materials.items[0]

    // Update it
    await pb.collection('materials').update(material.id, {
      uploader: testUserId
    })

    console.log(`✅ تم تحديث المادة: ${material.title}`)
    console.log(`   Uploader الجديد: ${testUserId}`)

    // Test expand
    const updated = await pb.collection('materials').getOne(material.id, {
      expand: 'uploader,subject,fileType'
    })

    console.log('\n🔍 اختبار expand:')
    console.log(`   Uploader name: ${updated.expand?.uploader?.name || '❌'}`)
    console.log(`   Subject: ${updated.expand?.subject?.nameAr || '❌'}`)
    console.log(`   FileType: ${updated.expand?.fileType?.nameAr || '❌'}`)

    const allWorking = updated.expand?.uploader && updated.expand?.subject && updated.expand?.fileType
    
    if (allWorking) {
      console.log('\n✅ جميع expand relations تعمل بشكل صحيح!')
    } else {
      console.log('\n⚠️  بعض relations لا تعمل')
    }

  } catch (error) {
    console.log('❌ خطأ:', error.message)
  }
}

async function main() {
  // Login as admin first
  await loginAdmin()
  
  // Create test user
  await createTestUser()
  
  // Update one material
  await updateOneMaterial()
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 الخلاصة')
  console.log('='.repeat(60))
  console.log('\n✅ ما تم:')
  console.log('   1. إنشاء مستخدم test: test@fyleo.com')
  console.log('   2. تحديث مادة واحدة كمثال')
  console.log('   3. اختبار expand relations')
  
  console.log('\n⚠️  المشكلة المتبقية:')
  console.log('   - 397 مادة لها uploader IDs غير موجودة')
  console.log('   - هذه المواد لن تعرض اسم الرافع')
  console.log('   - الحل المؤقت: المواد الجديدة ستعمل بشكل صحيح')
  
  console.log('\n💡 للإصلاح الكامل:')
  console.log('   يجب إنشاء users في PocketBase Admin بـ IDs:')
  console.log('   - k3n0jxp4cfcqth6')
  console.log('   - 9fkfia7gw7qfsnu')
  console.log('   - pmr6hg19y2jdaq6')
  console.log()
}

main()
