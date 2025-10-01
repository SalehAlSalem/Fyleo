import { CategoryService } from '../src/config/CategoryService.js';

console.log('🚀 بدء إدخال البيانات في Appwrite...');

async function initializeAppwriteData() {
  try {
    console.log('📂 إضافة التصنيفات...');
    
    // إضافة التصنيفات
    for (const category of CategoryService.INITIAL_CATEGORIES) {
      try {
        const result = await CategoryService.createCategory({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          description: category.description
        });
        console.log(`✅ تم إضافة تصنيف: ${category.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ التصنيف موجود بالفعل: ${category.name}`);
        } else {
          console.error(`❌ خطأ في إضافة ${category.name}:`, error.message);
        }
      }
    }

    console.log('📚 إضافة المواد...');
    
    // إضافة المواد
    for (const subject of CategoryService.INITIAL_SUBJECTS) {
      try {
        const result = await CategoryService.createSubject({
          categoryId: subject.categoryId,
          name: subject.name,
          code: subject.code,
          description: subject.description || `مادة ${subject.name} - رمز المادة: ${subject.code}`
        });
        console.log(`✅ تم إضافة مادة: ${subject.name} (${subject.code})`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ المادة موجودة بالفعل: ${subject.name}`);
        } else {
          console.error(`❌ خطأ في إضافة ${subject.name}:`, error.message);
        }
      }
    }

    console.log('📁 إضافة أنواع الملفات...');
    
    // إضافة أنواع الملفات
    for (const fileType of CategoryService.INITIAL_FILE_TYPES) {
      try {
        const result = await CategoryService.createFileType({
          id: fileType.id,
          name: fileType.name,
          extension: fileType.extension,
          icon: fileType.icon,
          color: fileType.color
        });
        console.log(`✅ تم إضافة نوع ملف: ${fileType.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ نوع الملف موجود بالفعل: ${fileType.name}`);
        } else {
          console.error(`❌ خطأ في إضافة ${fileType.name}:`, error.message);
        }
      }
    }

    console.log('🎉 تم إكمال إدخال البيانات بنجاح!');
    console.log('\n📊 الإحصائيات:');
    console.log(`- ${CategoryService.INITIAL_CATEGORIES.length} تصنيف`);
    console.log(`- ${CategoryService.INITIAL_SUBJECTS.length} مادة`);
    console.log(`- ${CategoryService.INITIAL_FILE_TYPES.length} نوع ملف`);
    
  } catch (error) {
    console.error('❌ خطأ عام في إدخال البيانات:', error);
  }
}

// تشغيل الدالة
initializeAppwriteData();