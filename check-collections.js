// 🔍 فحص Collections الموجودة في Database
import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d9740b0012416cb71b');

const databases = new Databases(client);

export async function checkCollections() {
    try {
        console.log('🔍 فحص Collections في Database...');
        
        const collections = await databases.listCollections('68d97982002b686c7151');
        
        console.log('📊 Collections الموجودة:', collections.collections.map(c => ({
            name: c.name,
            $id: c.$id,
            documentsCount: c.documents
        })));
        
        const requiredCollections = ['materials', 'users', 'bookmarks', 'downloads', 'user_profiles'];
        const existingIds = collections.collections.map(c => c.$id);
        
        console.log('✅ Collections المطلوبة:', requiredCollections);
        console.log('📋 Collections الموجودة:', existingIds);
        
        const missing = requiredCollections.filter(name => !existingIds.includes(name));
        
        if (missing.length > 0) {
            console.log('❌ Collections المفقودة:', missing);
            console.log('💡 تحتاج لإنشاء هذه Collections في Appwrite Console');
        } else {
            console.log('🎉 جميع Collections موجودة!');
        }
        
        return { existing: existingIds, missing, total: collections.collections };
        
    } catch (error) {
        console.error('❌ خطأ في فحص Collections:', error);
        return { error };
    }
}

// للاستخدام في Browser Console:
window.checkCollections = checkCollections;