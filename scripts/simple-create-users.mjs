#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function createUsersDirectly() {
  console.log('👥 محاولة إنشاء المستخدمين...\n')

  const users = [
    { email: `saleh${Date.now()}@fyleo.com`, name: 'صالح محمد', password: 'Fyleo@2024' },
    { email: `fatima${Date.now()}@fyleo.com`, name: 'فاطمة علي', password: 'Fyleo@2024' },
    { email: `ahmed${Date.now()}@fyleo.com`, name: 'أحمد حسن', password: 'Fyleo@2024' }
  ]

  for (const userData of users) {
    try {
      const user = await pb.collection('users').create({
        email: userData.email,
        name: userData.name,
        username: userData.email.split('@')[0],
        password: userData.password,
        passwordConfirm: userData.password,
        emailVisibility: true
      })
      console.log(`✅ ${userData.name}: ${user.id}`)
    } catch (error) {
      console.log(`⚠️  ${userData.name}: ${error.message}`)
    }
  }

  // Verify
  console.log('\n🔍 التحقق...')
  const list = await pb.collection('users').getList(1, 10)
  console.log(`📊 عدد المستخدمين: ${list.totalItems}`)
  list.items.forEach(u => {
    console.log(`   - ${u.name} (${u.email})`)
  })
}

createUsersDirectly()
