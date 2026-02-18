#!/usr/bin/env node

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function checkUploaderField() {
  console.log('\n🔍 فحص uploader field في materials...\n')

  try {
    // Get a random material
    const materials = await pb.collection('materials').getList(1, 5)
    
    console.log(`📊 فحص ${materials.items.length} مواد:\n`)

    for (const material of materials.items) {
      console.log(`Material: ${material.title}`)
      console.log(`  - ID: ${material.id}`)
      console.log(`  - uploader field value: ${JSON.stringify(material.uploader)}`)
      console.log(`  - uploader type: ${typeof material.uploader}`)
      console.log(`  - Fields:`, Object.keys(material).filter(k => k.includes('upload') || k.includes('user')))
      console.log()
    }

    // Try expand
    console.log('🔄 محاولة expand...\n')
    const withExpand = await pb.collection('materials').getList(1, 1, {
      expand: 'uploader'
    })

    if (withExpand.items.length > 0) {
      const item = withExpand.items[0]
      console.log('With expand:')
      console.log(`  - expand object:`, item.expand ? Object.keys(item.expand) : 'null')
      console.log(`  - expand.uploader:`, item.expand?.uploader || 'undefined')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response)
    }
  }
}

checkUploaderField()
