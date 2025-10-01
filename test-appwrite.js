// 🧪 Test Appwrite Connection - Browser Version
// This should be imported in a component or run in browser console

export async function testAppwriteConnection() {
    const { Client, Storage, Databases } = await import('appwrite');
    
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('68d9740b0012416cb71b');

    const storage = new Storage(client);
    const databases = new Databases(client);

    try {
        console.log('🔗 Testing Appwrite connection...');
        
        // Test 1: Check database
        console.log('📊 Testing Database...');
        const databasesList = await databases.list();
        console.log('✅ Database connection successful:', databasesList);
        
        // Test 2: Check storage buckets
        console.log('🗂️ Testing Storage...');
        const bucketsList = await storage.listBuckets();
        console.log('✅ Storage connection successful:', bucketsList);
        
        console.log('🎉 All connections successful!');
        return { success: true, databases: databasesList, buckets: bucketsList };
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            type: error.type
        });
        return { success: false, error };
    }
}

// To test in browser console:
// window.testAppwriteConnection = testAppwriteConnection;