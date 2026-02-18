#!/usr/bin/env node

/**
 * PocketBase Setup Script
 * يفحص و يصلح جميع مشاكل البيانات
 */

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

const ADMIN_EMAIL = 'salehbawaneh@gmail.com'
const ADMIN_PASSWORD = 'Bawa3neh.2000'

async function main() {
  try {
    console.log('🔐 جاري تسجيل الدخول...')
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ تم تسجيل الدخول بنجاح\n')

    // 1. عرض جميع Collections
    console.log('📚 === جميع Collections ===')
    const collections = await pb.collections.getFullList()
    console.log('الـ Collections الموجودة:')
    collections.forEach(c => {
      console.log(`  - ${c.name} (نوع: ${c.type})`)
    })
    console.log()

    // 2. فحص كل collection مهم
    const importantCollections = ['users', 'materials', 'subjects', 'material_ratings', 'material_reports', 'categories', 'fileTypes']
    
    for (const collName of importantCollections) {
      const coll = collections.find(c => c.name === collName)
      if (!coll) {
        console.log(`⚠️  Collection "${collName}" غير موجودة - سيتم إنشاؤها`)
        continue
      }

      console.log(`\n📋 Collection: ${collName}`)
      console.log(`   Fields:`)
      coll.schema.forEach(field => {
        console.log(`     - ${field.name} (${field.type})`)
      })

      // عد السجلات
      try {
        const count = await pb.collection(collName).getList(1, 1)
        console.log(`   عدد السجلات: ${count.totalItems}`)
        
        if (count.totalItems > 0) {
          const sample = count.items[0]
          console.log(`   عينة من البيانات (أول سجل):`)
          Object.keys(sample).slice(0, 5).forEach(key => {
            console.log(`     - ${key}: ${String(sample[key]).substring(0, 50)}`)
          })
        }
      } catch (e) {
        console.log(`   ❌ خطأ في الوصول: ${e.message}`)
      }
    }

    console.log('\n\n🔧 === بدء الإصلاحات ===\n')

    // 3. تأكد من وجود Collections الأساسية وإنشاء الناقصة
    await ensureCollections(pb, collections)

    // 4. أضف بيانات تجريبية
    console.log('\n📥 === إضافة بيانات تجريبية ===\n')
    await seedTestData(pb)

    console.log('\n✅ تم إكمال الإعداد بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error.message)
    process.exit(1)
  }
}

async function ensureCollections(pb, existingCollections) {
  const collectionsToCreate = [
    {
      name: 'categories',
      type: 'base',
      schema: [
        { name: 'nameAr', type: 'text', required: true },
        { name: 'nameEn', type: 'text', required: true },
        { name: 'descriptionAr', type: 'text' },
        { name: 'descriptionEn', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'isActive', type: 'bool', required: true },
      ]
    },
    {
      name: 'subjects',
      type: 'base',
      schema: [
        { name: 'nameAr', type: 'text', required: true },
        { name: 'nameEn', type: 'text', required: true },
        { name: 'descriptionAr', type: 'text' },
        { name: 'descriptionEn', type: 'text' },
        { name: 'categoryId', type: 'relation', collectionId: 'categories' },
        { name: 'isActive', type: 'bool', required: true },
      ]
    },
    {
      name: 'fileTypes',
      type: 'base',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'extension', type: 'text', required: true },
        { name: 'mimeType', type: 'text' },
        { name: 'icon', type: 'text' },
      ]
    },
    {
      name: 'materials',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'file', type: 'file' },
        { name: 'uploaderId', type: 'relation', collectionId: 'users' },
        { name: 'subjectId', type: 'relation', collectionId: 'subjects' },
        { name: 'fileTypeId', type: 'relation', collectionId: 'fileTypes' },
        { name: 'averageRating', type: 'number', value: 0 },
        { name: 'totalRatings', type: 'number', value: 0 },
        { name: 'downloads', type: 'number', value: 0 },
        { name: 'views', type: 'number', value: 0 },
        { name: 'isPublic', type: 'bool', value: true },
      ]
    },
    {
      name: 'material_ratings',
      type: 'base',
      schema: [
        { name: 'materialId', type: 'relation', collectionId: 'materials' },
        { name: 'userId', type: 'relation', collectionId: 'users' },
        { name: 'rating', type: 'number', required: true },
        { name: 'comment', type: 'text' },
      ]
    },
    {
      name: 'material_reports',
      type: 'base',
      schema: [
        { name: 'materialId', type: 'relation', collectionId: 'materials' },
        { name: 'userId', type: 'relation', collectionId: 'users' },
        { name: 'reason', type: 'select', values: ['inappropriate', 'spam', 'copyright', 'malware', 'other'] },
        { name: 'details', type: 'text' },
        { name: 'status', type: 'select', values: ['open', 'reviewing', 'resolved', 'rejected'], value: 'open' },
      ]
    }
  ]

  for (const collDef of collectionsToCreate) {
    const exists = existingCollections.find(c => c.name === collDef.name)
    if (!exists) {
      console.log(`✅ إنشاء Collection: ${collDef.name}`)
      try {
        await pb.collections.create(collDef)
      } catch (e) {
        console.log(`   ⚠️  ${e.message}`)
      }
    } else {
      console.log(`✓ Collection "${collDef.name}" موجود بالفعل`)
    }
  }
}

async function seedTestData(pb) {
  // 1. Categories
  console.log('📚 إضافة Categories...')
  const categories = [
    { nameAr: 'العلوم', nameEn: 'Science', isActive: true },
    { nameAr: 'الرياضيات', nameEn: 'Math', isActive: true },
    { nameAr: 'اللغة الإنجليزية', nameEn: 'English', isActive: true },
  ]

  const categoryIds = []
  for (const cat of categories) {
    try {
      const result = await pb.collection('categories').create(cat)
      categoryIds.push(result.id)
      console.log(`  ✅ ${cat.nameAr}`)
    } catch (e) {
      if (!e.message.includes('duplicate')) {
        console.log(`  ❌ ${e.message}`)
      }
    }
  }

  // 2. Subjects
  console.log('\n📖 إضافة Subjects...')
  const subjects = [
    { nameAr: 'الفيزياء', nameEn: 'Physics', categoryId: categoryIds[0] || '', isActive: true },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', categoryId: categoryIds[0] || '', isActive: true },
    { nameAr: 'الجبر', nameEn: 'Algebra', categoryId: categoryIds[1] || '', isActive: true },
    { nameAr: 'Grammar', nameEn: 'Grammar', categoryId: categoryIds[2] || '', isActive: true },
  ]

  for (const subj of subjects) {
    try {
      await pb.collection('subjects').create(subj)
      console.log(`  ✅ ${subj.nameAr}`)
    } catch (e) {
      if (!e.message.includes('duplicate')) {
        console.log(`  ❌ ${e.message}`)
      }
    }
  }

  // 3. File Types
  console.log('\n📄 إضافة FileTypes...')
  const fileTypes = [
    { name: 'PDF', extension: 'pdf', mimeType: 'application/pdf', icon: '📄' },
    { name: 'Word', extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: '📝' },
    { name: 'PowerPoint', extension: 'pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: '🎯' },
  ]

  for (const ft of fileTypes) {
    try {
      await pb.collection('fileTypes').create(ft)
      console.log(`  ✅ ${ft.name}`)
    } catch (e) {
      if (!e.message.includes('duplicate')) {
        console.log(`  ❌ ${e.message}`)
      }
    }
  }

  console.log('\n✅ انتهى الإعداد الأساسي!')
  console.log('\n💡 الخطوات التالية:')
  console.log('   1. ادخل إلى Dashboard وأضف مواد تجريبية')
  console.log('   2. الآن الكود يجب أن يشتغل بشكل صحيح')
}

main().catch(console.error)
