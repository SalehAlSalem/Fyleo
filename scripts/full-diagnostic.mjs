#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function diagnose() {
  console.log('\n🔍 فحص شامل للمنصة...\n')

  console.log('=' .repeat(50))
  console.log('1️⃣  فحص اتصال PocketBase')
  console.log('='.repeat(50))
  
  try {
    const health = await pb.health.check()
    console.log('✅ PocketBase متصل')
    console.log('   URL:', pb.baseUrl)
  } catch (error) {
    console.log('❌ فشل الاتصال بـ PocketBase')
    return
  }

  console.log('\n' + '='.repeat(50))
  console.log('2️⃣  فحص Collections والبيانات')
  console.log('='.repeat(50))

  const collections = [
    { name: 'users', required: true },
    { name: 'categories', required: true, expected: 8 },
    { name: 'subjects', required: true, expected: 132 },
    { name: 'materials', required: true, expected: 397 },
    { name: 'fileTypes', required: true, expected: 6 },
    { name: 'material_ratings', required: true },
    { name: 'material_reports', required: true },
  ]

  const issues = []

  for (const col of collections) {
    try {
      const result = await pb.collection(col.name).getList(1, 1)
      const count = result.totalItems
      const status = col.expected && count !== col.expected ? '⚠️ ' : '✅'
      console.log(`${status} ${col.name.padEnd(20)} - ${count} سجلات${col.expected ? ` (متوقع: ${col.expected})` : ''}`)
      
      if (col.expected && count !== col.expected) {
        issues.push(`Collection ${col.name}: عدد السجلات ${count} لكن المتوقع ${col.expected}`)
      }
    } catch (error) {
      if (error.status === 404) {
        console.log(`❌ ${col.name.padEnd(20)} - غير موجود`)
        if (col.required) {
          issues.push(`Collection ${col.name} مفقود ويجب إنشاءه`)
        }
      } else if (error.status === 403) {
        console.log(`⚠️  ${col.name.padEnd(20)} - موجود لكن بدون صلاحيات قراءة`)
        issues.push(`Collection ${col.name}: مشكلة في الصلاحيات`)
      } else {
        console.log(`❌ ${col.name.padEnd(20)} - خطأ: ${error.message}`)
        issues.push(`Collection ${col.name}: ${error.message}`)
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('3️⃣  فحص Expand Relations')
  console.log('='.repeat(50))

  try {
    const material = await pb.collection('materials').getList(1, 1, {
      expand: 'uploader,subject,fileType'
    })
    
    if (material.items.length > 0) {
      const item = material.items[0]
      console.log('✅ Materials expand يعمل')
      console.log('   - uploader:', item.expand?.uploader ? '✅' : '❌')
      console.log('   - subject:', item.expand?.subject ? '✅' : '❌')
      console.log('   - fileType:', item.expand?.fileType ? '✅' : '❌')
      
      if (!item.expand?.uploader) issues.push('uploader relation لا يعمل')
      if (!item.expand?.subject) issues.push('subject relation لا يعمل')
      if (!item.expand?.fileType) issues.push('fileType relation لا يعمل')
    }
  } catch (error) {
    console.log('❌ فشل اختبار expand:', error.message)
    issues.push('Expand relations لا تعمل')
  }

  console.log('\n' + '='.repeat(50))
  console.log('4️⃣  فحص Categories Data')
  console.log('='.repeat(50))

  try {
    const categories = await pb.collection('categories').getList(1, 10, {
      sort: 'order'
    })
    
    console.log(`✅ تم تحميل ${categories.items.length} تخصصات`)
    
    categories.items.slice(0, 3).forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.nameAr} (${cat.icon}) - slug: ${cat.slug}`)
    })

    const requiredFields = ['nameAr', 'nameEn', 'slug', 'icon', 'color']
    const firstCat = categories.items[0]
    requiredFields.forEach(field => {
      if (!firstCat[field]) {
        issues.push(`Categories: حقل ${field} مفقود`)
      }
    })
  } catch (error) {
    console.log('❌ فشل تحميل categories:', error.message)
    issues.push('Categories لا تحمل')
  }

  console.log('\n' + '='.repeat(50))
  console.log('📋 ملخص المشاكل')
  console.log('='.repeat(50))

  if (issues.length === 0) {
    console.log('\n🎉 لا توجد مشاكل! المنصة جاهزة\n')
  } else {
    console.log(`\n❌ عدد المشاكل: ${issues.length}\n`)
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`)
    })
    console.log()
  }

  console.log('='.repeat(50))
  console.log('💡 توصيات')
  console.log('='.repeat(50))

  if (issues.some(i => i.includes('material_reports'))) {
    console.log('\n⚠️  material_reports collection مفقود')
    console.log('   الحل: افتح PocketBase Admin واتبع الدليل في:')
    console.log('   docs/SETUP_MISSING_COLLECTIONS.md\n')
  }

  if (issues.some(i => i.includes('relation'))) {
    console.log('\n⚠️  مشاكل في Relations')
    console.log('   تحقق من field names في PocketBase')
    console.log('   يجب أن تكون: uploader, subject, fileType (ليس uploaderId)\n')
  }
}

diagnose().catch(console.error)
