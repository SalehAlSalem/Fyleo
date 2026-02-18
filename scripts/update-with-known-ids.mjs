#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function assignKnownUserIdsToMaterials() {
  const userIds = [
    'ay21b07kcbxx3ir',  // صالح محمد
    'upcna39k5x69v6u',  // فاطمة علي
    'd5pt1evd6d365v9'   // أحمد حسن
  ]

  console.log('📝 تحديث المواد بـ User IDs الفعلية...\n')
  console.log(`👥 المستخدمون: ${userIds.length}`)
  console.log(`   - ${userIds[0]}`)
  console.log(`   - ${userIds[1]}`)
  console.log(`   - ${userIds[2]}\n`)

  try {
    const materials = await pb.collection('materials').getList(1, 500)
    console.log(`📊 عدد المواد: ${materials.items.length}\n`)

    let updatedCount = 0

    for (let i = 0; i < materials.items.length; i++) {
      const material = materials.items[i]
      const userId = userIds[i % userIds.length]
      
      try {
        await pb.collection('materials').update(material.id, {
          uploader: userId
        })
        updatedCount++
        
        if ((i + 1) % 100 === 0) {
          console.log(`✅ تم تحديث ${i + 1} مادة...`)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`❌ مشكلة في المادة ${material.id}: ${error.message}`)
      }
    }

    console.log(`\n✅ تم تحديث ${updatedCount}/${materials.items.length} مادة!`)

    // Verify with expand
    console.log('\n🔍 التحقق من expand...')
    const test = await pb.collection('materials').getList(1, 1, {
      expand: 'uploader'
    })
    
    if (test.items.length > 0) {
      const m = test.items[0]
      console.log(`\n📚 ${m.title}`)
      console.log(`💾 Uploader ID: ${m.uploader}`)
      console.log(`👤 Uploader expanded: ${m.expand?.uploader?.name || 'لم يتم التوسع'}`)
    }
  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

assignKnownUserIdsToMaterials()
