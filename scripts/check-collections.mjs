#!/usr/bin/env node

// Check all collections in PocketBase
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function checkCollections() {
  console.log('\n🔍 فحص Collections في PocketBase...\n')

  const requiredCollections = [
    'users',
    'categories',
    'subjects',
    'materials',
    'fileTypes',
    'material_ratings',
    'material_reports',
  ]

  for (const collectionName of requiredCollections) {
    try {
      const result = await pb.collection(collectionName).getList(1, 1)
      console.log(`✅ ${collectionName.padEnd(20)} - ${result.totalItems} سجلات`)
    } catch (error) {
      if (error.status === 404) {
        console.log(`❌ ${collectionName.padEnd(20)} - غير موجود`)
      } else if (error.status === 403) {
        console.log(`⚠️  ${collectionName.padEnd(20)} - موجود لكن بدون صلاحيات قراءة`)
      } else {
        console.log(`❌ ${collectionName.padEnd(20)} - خطأ: ${error.message}`)
      }
    }
  }

  console.log('\n✅ انتهى الفحص\n')
}

checkCollections().catch(console.error)
