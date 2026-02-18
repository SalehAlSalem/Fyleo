#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function checkUsers() {
  console.log('\n🔍 فحص users collection...\n')

  try {
    // Check total users
    const users = await pb.collection('users').getList(1, 10)
    console.log(`📊 عدد المستخدمين: ${users.totalItems}`)
    console.log(`   سجلات محملة: ${users.items.length}\n`)

    if (users.items.length > 0) {
      console.log('👥 المستخدمين:')
      users.items.forEach((user, i) => {
        console.log(`${i + 1}. ID: ${user.id}`)
        console.log(`   Name: ${user.name || user.username}`)
        console.log(`   Email: ${user.email}`)
        console.log()
      })
    } else {
      console.log('⚠️  لا يوجد مستخدمين مسجلين!\n')
    }

    // Get uploader IDs from materials
    const materials = await pb.collection('materials').getList(1, 10)
    const uploaderIds = new Set(materials.items.map(m => m.uploader))
    
    console.log(`📋 Uploader IDs فريدة في Materials: ${uploaderIds.size}`)
    uploaderIds.forEach(id => console.log(`   - ${id}`))
    console.log()

    // Check if uploader IDs exist in users
    console.log('🔍 التحقق من وجود Uploaders في users collection:')
    for (const uploaderId of uploaderIds) {
      try {
        const user = await pb.collection('users').getOne(uploaderId)
        console.log(`✅ ${uploaderId} موجود - ${user.name || user.username}`)
      } catch (error) {
        if (error.status === 404) {
          console.log(`❌ ${uploaderId} غير موجود في users!`)
        } else {
          console.log(`⚠️  ${uploaderId} - خطأ: ${error.message}`)
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkUsers()
