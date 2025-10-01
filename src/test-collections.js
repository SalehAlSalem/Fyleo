// ملف اختبار لفحص البيانات في Collections
import { DatabaseService } from './config/DatabaseService.js';

async function testCollections() {
  console.log('🧪 اختبار Collections في Appwrite...');
  
  try {
    // اختبار 1: فحص المستخدمين
    console.log('\n📊 اختبار 1: فحص Users Collection');
    const usersCount = await DatabaseService.getTotalUsersCount();
    console.log('عدد المستخدمين الحالي:', usersCount);
    
    // اختبار 2: فحص الملفات  
    console.log('\n📊 اختبار 2: فحص Materials Collection');
    const filesCount = await DatabaseService.getTotalFilesCount();
    console.log('عدد الملفات الحالي:', filesCount);
    
    // اختبار 3: محاولة إضافة مستخدم تجريبي
    console.log('\n➕ اختبار 3: إضافة مستخدم تجريبي');
    try {
      const testUser = await DatabaseService.createUser({
        name: 'مستخدم تجريبي',
        email: `test${Date.now()}@example.com`,
        university: 'جامعة تجريبية',
        department: 'قسم تجريبي'
      });
      console.log('✅ تم إنشاء المستخدم بنجاح:', testUser.$id);
      
      // فحص العدد مرة أخرى
      const newUsersCount = await DatabaseService.getTotalUsersCount();
      console.log('عدد المستخدمين بعد الإضافة:', newUsersCount);
      
    } catch (createError) {
      console.error('❌ فشل في إنشاء المستخدم:', createError);
    }
    
    // اختبار 4: محاولة إضافة ملف تجريبي
    console.log('\n📁 اختبار 4: إضافة ملف تجريبي');
    try {
      const testFile = await DatabaseService.uploadFile({
        title: 'ملف تجريبي',
        description: 'وصف تجريبي',
        category: 'Programming',
        subject: 'تجربة',
        semester: 'الأول',
        uploadedBy: 'test-user-id',
        fileName: 'test-file.pdf',
        fileUrl: 'https://example.com/test.pdf',
        fileSize: 1024
      });
      console.log('✅ تم إنشاء الملف بنجاح:', testFile.$id);
      
      // فحص العدد مرة أخرى
      const newFilesCount = await DatabaseService.getTotalFilesCount();
      console.log('عدد الملفات بعد الإضافة:', newFilesCount);
      
    } catch (createError) {
      console.error('❌ فشل في إنشاء الملف:', createError);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  }
}

// تشغيل الاختبار عند تحميل الصفحة
window.testCollections = testCollections;
console.log('🔧 لتشغيل الاختبار، اكتب في Console: testCollections()');