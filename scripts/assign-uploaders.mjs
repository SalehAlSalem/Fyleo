#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function assignUsersToMaterials() {
  console.log('\n📝 تحديث المواد بـ uploaders...\n')

  try {
    // Get the 3 users we just created
    const users = await pb.collection('users').getList(1, 10)
    const userIds = users.items.map(u => u.id)
    
    console.log(`👥 وجدنا ${userIds.length} مستخدمين`)

    // Get all materials
    const materials = await pb.collection('materials').getList(1, 500)
    console.log(`📊 عدد المواد: ${materials.items.length}`)

    let updatedCount = 0

    // Update each material
    for (let i = 0; i < materials.items.length; i++) {
      const material = materials.items[i]
      const userId = userIds[i % userIds.length]
      
      try {
        await pb.collection('materials').update(material.id, {
          uploader: userId
        })
        updatedCount++
        
        if ((i + 1) % 50 === 0) {
          console.log(`✅ تم تحديث ${i + 1} مادة...`)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      } catch (error) {
        // Skip errors
      }
    }

    console.log(`\n✅ تم تحديث ${updatedCount} مادة بنجاح!`)

    // Verify
    console.log('\n🔍 التحقق...')
    const test = await pb.collection('materials').getList(1, 1, {
      expand: 'uploader'
    })
    
    if (test.items.length > 0) {
      const m = test.items[0]
      console.log(`\n📚 ${m.title}`)
      console.log(`👤 Uploader: ${m.expand?.uploader?.name || 'مجهول'}`)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

assignUsersToMaterials()
