#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function createRealUsers() {
  console.log('\n👥 إنشاء مستخدمين حقيقيين...\n')

  const usersToCreate = [
    {
      email: 'saleh@fyleo.com',
      password: 'Fyleo@2024',
      name: 'صالح محمد',
      username: 'saleh_m'
    },
    {
      email: 'fatima@fyleo.com',
      password: 'Fyleo@2024',
      name: 'فاطمة علي',
      username: 'fatima_a'
    },
    {
      email: 'ahmed@fyleo.com',
      password: 'Fyleo@2024',
      name: 'أحمد حسن',
      username: 'ahmed_h'
    }
  ]

  const createdUserIds = []

  for (const userData of usersToCreate) {
    try {
      const user = await pb.collection('users').create({
        ...userData,
        passwordConfirm: userData.password,
        emailVisibility: true
      })
      console.log(`✅ ${userData.name} (${user.id})`)
      createdUserIds.push(user.id)
    } catch (error) {
      if (error.status === 400 && error.response?.data?.email?.code === 'unique') {
        console.log(`⚠️  ${userData.name} موجود بالفعل`)
        // Try to get the user ID
        try {
          const existing = await pb.collection('users').getFirstListItem(`email = "${userData.email}"`)
          createdUserIds.push(existing.id)
        } catch {
          console.log(`❌ لم نتمكن من الحصول على ID`)
        }
      } else {
        console.log(`❌ ${userData.name}: ${error.message}`)
      }
    }
  }

  return createdUserIds
}

async function assignUsersToMaterials(userIds) {
  console.log('\n📝 تعيين المستخدمين للمواد...\n')

  if (userIds.length === 0) {
    console.log('❌ لا توجد مستخدمين')
    return
  }

  try {
    // Get all materials
    const materials = await pb.collection('materials').getList(1, 500)
    
    const totalMaterials = materials.totalItems || materials.items.length
    console.log(`📊 عدد المواد الكلي: ${totalMaterials}`)
    console.log(`👥 عدد المستخدمين: ${userIds.length}\n`)

    // Assign users to materials evenly
    let updatedCount = 0
    for (let i = 0; i < materials.items.length; i++) {
      const material = materials.items[i]
      const userId = userIds[i % userIds.length]
      
      try {
        await pb.collection('materials').update(material.id, {
          uploader: userId
        })
        updatedCount++
        // Add small delay to avoid rate limiting
        if (updatedCount % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`❌ Error updating ${material.id}:`, error.message)
      }
    }

    console.log(`✅ تم تحديث ${updatedCount} مادة`)

    // Get remaining materials if needed
    if (totalMaterials > 100) {
      console.log(`\n📝 معالجة الدفعة الثانية من المواد (${100}-${totalMaterials})...`)
      
      for (let page = 2; page <= Math.ceil(totalMaterials / 100); page++) {
        const moreMatrials = await pb.collection('materials').getList(page, 100)
        
        for (let i = 0; i < moreMatrials.items.length; i++) {
          const material = moreMatrials.items[i]
          const userIndex = (updatedCount + i) % userIds.length
          const userId = userIds[userIndex]
          
          try {
            await pb.collection('materials').update(material.id, {
              uploader: userId
            })
            updatedCount++
          } catch (error) {
            console.error(`❌ Error updating ${material.id}:`, error.message)
          }
        }
      }
    }

    console.log(`\n✅ تم تحديث إجمالي ${updatedCount} مادة!`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function verifyAssignment() {
  console.log('\n🔍 التحقق من التعيين...\n')

  try {
    // Test expand for a few materials
    const testMaterials = await pb.collection('materials').getList(1, 3, {
      expand: 'uploader'
    })

    for (const material of testMaterials.items) {
      const uploader = material.expand?.uploader
      console.log(`📚 ${material.title}`)
      console.log(`   👤 Uploader: ${uploader?.name || 'مجهول'} (${uploader?.id || 'N/A'})`)
    }

    // Show user count
    const users = await pb.collection('users').getList(1, 1)
    console.log(`\n📊 إجمالي المستخدمين: ${users.totalItems}`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function main() {
  console.log('🚀 بدء إعداد المستخدمين والمواد...')
  
  const userIds = await createRealUsers()
  await assignUsersToMaterials(userIds)
  await verifyAssignment()
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ تم الانتهاء!')
  console.log('='.repeat(60))
  console.log('\n📋 معلومات تسجيل الدخول:')
  console.log('   1. saleh@fyleo.com / Fyleo@2024')
  console.log('   2. fatima@fyleo.com / Fyleo@2024')
  console.log('   3. ahmed@fyleo.com / Fyleo@2024')
  console.log('\n💡 جميع المواد الآن مُعينة لهؤلاء المستخدمين')
}

main()
