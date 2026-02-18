#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function testLogin() {
  console.log('🔐 اختبار تسجيل دخول...\n')

  try {
    // Try to get user by ID
    const userId = 'ay21b07kcbxx3ir'
    const user = await pb.collection('users').getOne(userId)
    
    console.log(`✅ تم الحصول على المستخدم:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Username: ${user.username}`)

    // Test a material with this user
    const materials = await pb.collection('materials').getList(1, 1, {
      filter: `uploader = "${userId}"`
    })

    console.log(`\n📊 المواد التي يرفعها هذا المستخدم: ${materials.totalItems}`)

  } catch (error) {
    console.error('❌ خطأ:', error.message)
  }
}

testLogin()
