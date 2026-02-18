#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function checkCollectionFields() {
  console.log('\n🔍 فحص Field Names في Collections...\n')

  try {
    // Get materials to check fields
    const materials = await pb.collection('materials').getList(1, 1)
    
    if (materials.items.length > 0) {
      const material = materials.items[0]
      console.log('📋 Material Fields:')
      console.log('   ', Object.keys(material).sort().join(', '))
      
      console.log('\n🔍 Checking specific fields:')
      console.log('   - uploader:', material.uploader ? '✅ موجود' : '❌ غير موجود')
      console.log('   - uploaderId:', material.uploaderId ? '✅ موجود' : '❌ غير موجود')
    }

    // Check users collection
    const users = await pb.collection('users').getList(1, 1)
    console.log(`\n👤 عدد Users الكلي: ${users.totalItems}`)
    
    if (users.items.length > 0) {
      const user = users.items[0]
      console.log('📋 User Fields:')
      console.log('   ', Object.keys(user).sort().join(', '))
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkCollectionFields()
