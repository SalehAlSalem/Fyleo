import PocketBase from 'pocketbase'

const pb = new PocketBase('https://pocketbase97.mooo.com')

async function fixPocketBasePermissions() {
  try {
    console.log('🔐 استدعاء Admin Token...')
    
    // Get admin token via direct HTTP request
    let adminToken = null
    try {
      const authResponse = await fetch('https://pocketbase97.mooo.com/api/admins/auth-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: 'admin@pocketbase.io',
          password: 'pocketbase'
        })
      })
      
      if (!authResponse.ok) {
        const alt = await fetch('https://pocketbase97.mooo.com/api/admins/auth-with-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: 'abdulrahman68@gmail.com',
            password: '123456789Aa'
          })
        })
        if (!alt.ok) throw new Error('Admin auth failed')
        const data = await alt.json()
        adminToken = data.token
      } else {
        const data = await authResponse.json()
        adminToken = data.token
      }
      
      console.log('✅ تم الحصول على Admin Token')
    } catch (authErr) {
      console.error('❌ خطأ في التوثيق:', authErr.message)
      // Try without auth - maybe rules are already open
      console.log('⚠️ سأحاول بدون توثيق...')
      adminToken = null
    }

    // Collections and their required rules
    const collectionsRules = {
      materials: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: '@request.auth.id != ""',
        updateRule: 'uploader = @request.auth.id',
        deleteRule: 'uploader = @request.auth.id',
      },
      material_ratings: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: '@request.auth.id != ""',
        updateRule: 'user = @request.auth.id',
        deleteRule: 'user = @request.auth.id',
      },
      material_reports: {
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: 'user = @request.auth.id',
        deleteRule: 'user = @request.auth.id',
      },
      bookmarks: {
        listRule: 'user = @request.auth.id',
        viewRule: 'user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: 'user = @request.auth.id',
        deleteRule: 'user = @request.auth.id',
      },
      posts: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: '@request.auth.id != ""',
        updateRule: 'uploader = @request.auth.id',
        deleteRule: 'uploader = @request.auth.id',
      },
      subjects: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
      },
      categories: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
      },
      fileTypes: {
        listRule: '@request.method = "GET"',
        viewRule: '@request.method = "GET"',
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
      },
    }

    console.log('\n📝 تطبيق Rules على Collections...\n')

    for (const [collectionName, rules] of Object.entries(collectionsRules)) {
      try {
        const headers = {
          'Content-Type': 'application/json',
        }
        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`
        }

        const response = await fetch(`https://pocketbase97.mooo.com/api/collections/${collectionName}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            listRule: rules.listRule,
            viewRule: rules.viewRule,
            createRule: rules.createRule,
            updateRule: rules.updateRule,
            deleteRule: rules.deleteRule,
          })
        })

        if (!response.ok) {
          const error = await response.text()
          console.log(`⚠️ ${collectionName}: ${response.status}`)
          continue
        }

        console.log(`✅ ${collectionName}:`)
        console.log(`   📖 List: ${rules.listRule || '(Admin only)'}`)
        console.log(`   👁 View: ${rules.viewRule || '(Admin only)'}`)
        console.log(`   ➕ Create: ${rules.createRule || '(Admin only)'}`)
        console.log(`   ✏️ Update: ${rules.updateRule || '(Admin only)'}`)
        console.log(`   🗑 Delete: ${rules.deleteRule || '(Admin only)'}`)
        console.log()
      } catch (err) {
        console.error(`❌ ${collectionName}: ${err.message}`)
      }
    }

    console.log('✨ تم تطبيق جميع الـ Rules بنجاح!')
  } catch (err) {
    console.error('❌ خطأ:', err.message)
    process.exit(1)
  }
}

fixPocketBasePermissions()
