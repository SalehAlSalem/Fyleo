#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

// IDs الموجودة في materials
const UPLOADER_IDS = [
  'k3n0jxp4cfcqth6',
  '9fkfia7gw7qfsnu', 
  'pmr6hg19y2jdaq6'
]

async function createDummyUsers() {
  console.log('\n🔧 إنشاء dummy users لإصلاح uploader relation...\n')

  const users = [
    {
      id: UPLOADER_IDS[0],
      email: 'uploader1@fyleo.com',
      password: 'Test1234',
      passwordConfirm: 'Test1234',
      name: 'مستخدم تجريبي 1',
      username: 'uploader1'
    },
    {
      id: UPLOADER_IDS[1],
      email: 'uploader2@fyleo.com',
      password: 'Test1234',
      passwordConfirm: 'Test1234',
      name: 'مستخدم تجريبي 2',
      username: 'uploader2'
    },
    {
      id: UPLOADER_IDS[2],
      email: 'uploader3@fyleo.com',
      password: 'Test1234',
      passwordConfirm: 'Test1234',
      name: 'مستخدم تجريبي 3',
      username: 'uploader3'
    }
  ]

  let created = 0
  let existing = 0

  for (const userData of users) {
    try {
      // محاولة إنشاء المستخدم
      const user = await pb.collection('users').create(userData)
      console.log(`✅ تم إنشاء: ${user.name} (${user.id})`)
      created++
    } catch (error) {
      if (error.status === 400 && error.response?.data?.email) {
        console.log(`⚠️  ${userData.name} - الإيميل موجود بالفعل`)
        existing++
      } else if (error.status === 400 && error.response?.data?.username) {
        console.log(`⚠️  ${userData.name} - Username موجود`)
        existing++
      } else {
        console.log(`❌ فشل إنشاء ${userData.name}:`, error.message)
      }
    }
  }

  console.log(`\n📊 النتيجة:`)
  console.log(`   - تم إنشاء: ${created}`)
  console.log(`   - موجود مسبقاً: ${existing}`)
  console.log(`   - المجموع: ${created + existing}/${users.length}`)

  // التحقق من expand الآن
  console.log('\n🔍 اختبار expand بعد الإنشاء...')
  try {
    const materials = await pb.collection('materials').getList(1, 3, {
      expand: 'uploader,subject,fileType'
    })

    if (materials.items.length > 0) {
      materials.items.forEach((mat, i) => {
        const uploaderName = mat.expand?.uploader?.name || '❌ No name'
        console.log(`${i + 1}. ${mat.title}`)
        console.log(`   Uploader: ${uploaderName}`)
      })

      const workingExpands = materials.items.filter(m => m.expand?.uploader).length
      console.log(`\n✅ Expand يعمل على ${workingExpands}/${materials.items.length} مواد`)
    }
  } catch (error) {
    console.log('❌ فشل اختبار expand:', error.message)
  }
}

createDummyUsers()
