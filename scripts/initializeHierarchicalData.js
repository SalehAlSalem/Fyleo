import { CategoryService, INITIAL_CATEGORIES, INITIAL_FILE_TYPES } from '../src/config/CategoryService.js';

// البيانات الأولية للمواد حسب التصنيف
const INITIAL_SUBJECTS = {
  // متطلبات الجامعة
  'category1': [
    { nameAr: 'لغة عربية تطبيقية', nameEn: 'Applied Arabic Language', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'لغة إنجليزية تطبيقية 1', nameEn: 'Applied English Language 1', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'لغة إنجليزية تطبيقية 2', nameEn: 'Applied English Language 2', creditHours: 3, level: 'سنة أولى', prerequisite: 'لغة إنجليزية تطبيقية 1' },
    { nameAr: 'التربية الوطنية والسلوك الجامعي', nameEn: 'National Education and University Behavior', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'علوم عسكرية', nameEn: 'Military Sciences', creditHours: 3, level: 'سنة ثانية' },
    { nameAr: 'مهارات الحاسوب والتعليم الالكتروني', nameEn: 'Computer Skills and E-Learning', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'الابتكار والريادة والإبداع', nameEn: 'Innovation, Entrepreneurship and Creativity', creditHours: 3, level: 'سنة رابعة' }
  ],
  
  // متطلبات ثقافية
  'category2': [
    { nameAr: 'مفاهيم ومهارات إدارية معاصرة', nameEn: 'Contemporary Management Concepts and Skills', creditHours: 3 },
    { nameAr: 'مبادئ علم النفس', nameEn: 'Principles of Psychology', creditHours: 3 },
    { nameAr: 'مهارات الاتصال', nameEn: 'Communication Skills', creditHours: 3 },
    { nameAr: 'المجتمع الأردني', nameEn: 'Jordanian Society', creditHours: 3 },
    { nameAr: 'الرياضة للجميع', nameEn: 'Sports for All', creditHours: 1 },
    { nameAr: 'الثقافة الإسلامية', nameEn: 'Islamic Culture', creditHours: 3 },
    { nameAr: 'مفاهيم اقتصادية', nameEn: 'Economic Concepts', creditHours: 3 },
    { nameAr: 'الزراعة في الأردن', nameEn: 'Agriculture in Jordan', creditHours: 3 },
    { nameAr: 'البيئة والمجتمع', nameEn: 'Environment and Society', creditHours: 3 },
    { nameAr: 'الخلفاء الراشدين', nameEn: 'The Rightly Guided Caliphs', creditHours: 3 },
    { nameAr: 'القدس (القضية الفلسطينية)', nameEn: 'Jerusalem (Palestinian Issue)', creditHours: 3 },
    { nameAr: 'القانون والإعلام والمجتمع', nameEn: 'Law, Media and Society', creditHours: 3 },
    { nameAr: 'الإسلام والحياة', nameEn: 'Islam and Life', creditHours: 3 },
    { nameAr: 'المجتمع الرقمي', nameEn: 'Digital Society', creditHours: 3 },
    { nameAr: 'السلامة المرورية', nameEn: 'Traffic Safety', creditHours: 3 }
  ],

  // الرياضيات والعلوم الأساسية
  'category3': [
    { nameAr: 'التفاضل والتكامل (1)', nameEn: 'Calculus I', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'التفاضل والتكامل (2)', nameEn: 'Calculus II', creditHours: 3, level: 'سنة أولى', prerequisite: 'التفاضل والتكامل (1)' },
    { nameAr: 'المعادلات التفاضلية العادية (1)', nameEn: 'Ordinary Differential Equations I', creditHours: 3, level: 'سنة ثانية', prerequisite: 'التفاضل والتكامل (2)' },
    { nameAr: 'جبر خطي', nameEn: 'Linear Algebra', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'إحصاء واحتمالات للهندسة', nameEn: 'Statistics and Probability for Engineering', creditHours: 3, level: 'سنة ثانية' },
    { nameAr: 'الفيزياء العامة (1)', nameEn: 'General Physics I', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'الفيزياء العامة (2)', nameEn: 'General Physics II', creditHours: 3, level: 'سنة أولى', prerequisite: 'الفيزياء العامة (1)' },
    { nameAr: 'الفيزياء العامة العملي (1)', nameEn: 'General Physics Laboratory I', creditHours: 1, level: 'سنة أولى' },
    { nameAr: 'الكيمياء العامة (1)', nameEn: 'General Chemistry I', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'الكيمياء العامة العملية (1)', nameEn: 'General Chemistry Laboratory I', creditHours: 1, level: 'سنة أولى' }
  ],

  // أساسيات الهندسة
  'category4': [
    { nameAr: 'البرمجة للمهندسين', nameEn: 'Programming for Engineers', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'الكتابة التقنية والأخلاقيات المهنية', nameEn: 'Technical Writing and Professional Ethics', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'رسم هندسي', nameEn: 'Engineering Drawing', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'مشغل هندسي', nameEn: 'Engineering Workshop', creditHours: 2, level: 'سنة أولى' },
    { nameAr: 'اقتصاد هندسي', nameEn: 'Engineering Economics', creditHours: 3, level: 'سنة رابعة' }
  ],

  // هندسة الكهرباء والإلكترونيات
  'category5': [
    { nameAr: 'دوائر كهربائية (1)', nameEn: 'Electric Circuits I', creditHours: 3, level: 'سنة ثانية' },
    { nameAr: 'دوائر كهربائية (2)', nameEn: 'Electric Circuits II', creditHours: 3, level: 'سنة ثانية', prerequisite: 'دوائر كهربائية (1)' },
    { nameAr: 'مختبر دوائر كهربائية', nameEn: 'Electric Circuits Laboratory', creditHours: 1, level: 'سنة ثانية' },
    { nameAr: 'إلكترونيات (1)', nameEn: 'Electronics I', creditHours: 3, level: 'سنة ثانية', prerequisite: 'دوائر كهربائية (1)' },
    { nameAr: 'مختبر إلكترونيات (1)', nameEn: 'Electronics Laboratory I', creditHours: 1, level: 'سنة ثانية' },
    { nameAr: 'أنظمة التحكم', nameEn: 'Control Systems', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'مختبر أنظمة التحكم', nameEn: 'Control Systems Laboratory', creditHours: 1, level: 'سنة ثالثة' },
    { nameAr: 'آلات كهربائية (1)', nameEn: 'Electric Machines I', creditHours: 3, level: 'سنة ثالثة' }
  ],

  // علوم الحاسوب والبرمجة
  'category6': [
    { nameAr: 'البرمجة بلغة الكينونة (OOP)', nameEn: 'Object Oriented Programming', creditHours: 3, level: 'سنة أولى' },
    { nameAr: 'تراكيب البيانات والخوارزميات', nameEn: 'Data Structures and Algorithms', creditHours: 3, level: 'سنة ثانية', prerequisite: 'البرمجة بلغة الكينونة' },
    { nameAr: 'مختبر تراكيب البيانات والخوارزميات', nameEn: 'Data Structures and Algorithms Laboratory', creditHours: 1, level: 'سنة ثانية' },
    { nameAr: 'معمارية الحاسوب وتنظيمه', nameEn: 'Computer Architecture and Organization', creditHours: 3, level: 'سنة ثانية' },
    { nameAr: 'مختبر معمارية الحاسوب وتنظيمه', nameEn: 'Computer Architecture and Organization Laboratory', creditHours: 1, level: 'سنة ثانية' },
    { nameAr: 'نظم التشغيل', nameEn: 'Operating Systems', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'أنظمة قواعد البيانات', nameEn: 'Database Systems', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'مختبر أنظمة قواعد البيانات', nameEn: 'Database Systems Laboratory', creditHours: 1, level: 'سنة ثالثة' }
  ],

  // شبكات الحاسوب والاتصالات
  'category7': [
    { nameAr: 'تصميم المنطق الرقمي', nameEn: 'Digital Logic Design', creditHours: 3, level: 'سنة ثانية' },
    { nameAr: 'مختبر تصميم المنطق الرقمي', nameEn: 'Digital Logic Design Laboratory', creditHours: 1, level: 'سنة ثانية' },
    { nameAr: 'أنظمة المعالجات الدقيقة', nameEn: 'Microprocessor Systems', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'مختبر أنظمة المعالجات الدقيقة', nameEn: 'Microprocessor Systems Laboratory', creditHours: 1, level: 'سنة ثالثة' },
    { nameAr: 'أنظمة وإشارات', nameEn: 'Signals and Systems', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'اتصالات وتراسل البيانات', nameEn: 'Communications and Data Transmission', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'أساسيات شبكات الحاسوب', nameEn: 'Computer Networks Fundamentals', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'مختبر شبكات الحاسوب', nameEn: 'Computer Networks Laboratory', creditHours: 1, level: 'سنة ثالثة' },
    { nameAr: 'برمجة الشبكات', nameEn: 'Network Programming', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'بروتوكولات الشبكات', nameEn: 'Network Protocols', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'مختبر بروتوكولات الشبكات', nameEn: 'Network Protocols Laboratory', creditHours: 1, level: 'سنة رابعة' },
    { nameAr: 'الشبكات اللاسلكية', nameEn: 'Wireless Networks', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'شبكات الاستشعار اللاسلكية', nameEn: 'Wireless Sensor Networks', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'إنترنت الأشياء (IoT)', nameEn: 'Internet of Things (IoT)', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'نمذجة ومحاكاة أداء الشبكات', nameEn: 'Network Performance Modeling and Simulation', creditHours: 3, level: 'سنة رابعة' }
  ],

  // الأمن السيبراني والتحقيقات الرقمية
  'category8': [
    { nameAr: 'أساسيات الأمن السيبراني', nameEn: 'Cybersecurity Fundamentals', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'التشفير وأمن أنظمة الشبكات', nameEn: 'Cryptography and Network Systems Security', creditHours: 3, level: 'سنة ثالثة' },
    { nameAr: 'القرصنة الأخلاقية', nameEn: 'Ethical Hacking', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'أمن الشبكات اللاسلكية', nameEn: 'Wireless Network Security', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'أنظمة التحقيقات والأدلة الرقمية', nameEn: 'Digital Forensics and Investigation Systems', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'مختبر أنظمة التحقيقات والأدلة الرقمية', nameEn: 'Digital Forensics and Investigation Systems Laboratory', creditHours: 1, level: 'سنة رابعة' },
    { nameAr: 'موضوعات خاصة في هندسة أنظمة وأمن الشبكات', nameEn: 'Special Topics in Network Systems Engineering and Security', creditHours: 3, level: 'سنة رابعة' }
  ],

  // تقنيات متقدمة
  'category9': [
    { nameAr: 'الذكاء الاصطناعي وتعلم الآلة', nameEn: 'Artificial Intelligence and Machine Learning', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'الحوسبة السحابية', nameEn: 'Cloud Computing', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'مقدمة إلى نظام لينكس', nameEn: 'Introduction to Linux System', creditHours: 3, level: 'سنة ثالثة' }
  ],

  // مشاريع وتدريب
  'category10': [
    { nameAr: 'التدريب الميداني', nameEn: 'Field Training', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'مشروع التخرج (1)', nameEn: 'Graduation Project I', creditHours: 3, level: 'سنة رابعة' },
    { nameAr: 'مشروع التخرج (2)', nameEn: 'Graduation Project II', creditHours: 3, level: 'سنة رابعة', prerequisite: 'مشروع التخرج (1)' }
  ]
};

async function initializeData() {
  try {
    console.log('🚀 بدء عملية إدخال البيانات الأولية...');
    
    // 1. إنشاء التصنيفات
    console.log('📁 إنشاء التصنيفات الرئيسية...');
    const createdCategories = {};
    
    for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
      const category = INITIAL_CATEGORIES[i];
      try {
        const result = await CategoryService.createCategory(category);
        createdCategories[`category${i + 1}`] = result.$id;
        console.log(`✅ تم إنشاء تصنيف: ${category.nameAr}`);
      } catch (error) {
        console.error(`❌ خطأ في إنشاء تصنيف ${category.nameAr}:`, error);
      }
    }

    // 2. إنشاء أنواع الملفات
    console.log('📄 إنشاء أنواع الملفات...');
    for (const fileType of INITIAL_FILE_TYPES) {
      try {
        await CategoryService.createFileType?.(fileType) || 
              await databases.createDocument(DATABASE_ID, FILE_TYPES_COLLECTION_ID, ID.unique(), fileType);
        console.log(`✅ تم إنشاء نوع ملف: ${fileType.nameAr}`);
      } catch (error) {
        console.error(`❌ خطأ في إنشاء نوع ملف ${fileType.nameAr}:`, error);
      }
    }

    // 3. إنشاء المواد
    console.log('📚 إنشاء المواد الفرعية...');
    for (const [categoryKey, subjects] of Object.entries(INITIAL_SUBJECTS)) {
      const categoryId = createdCategories[categoryKey];
      if (!categoryId) {
        console.warn(`⚠️ لم يتم العثور على التصنيف: ${categoryKey}`);
        continue;
      }

      for (const subject of subjects) {
        try {
          const subjectData = {
            ...subject,
            categoryId,
            isActive: true
          };
          await CategoryService.createSubject(subjectData);
          console.log(`✅ تم إنشاء مادة: ${subject.nameAr}`);
        } catch (error) {
          console.error(`❌ خطأ في إنشاء مادة ${subject.nameAr}:`, error);
        }
      }
    }

    console.log('🎉 تم الانتهاء من إدخال البيانات الأولية بنجاح!');
    console.log(`📊 الإحصائيات:
    - التصنيفات: ${Object.keys(createdCategories).length}
    - أنواع الملفات: ${INITIAL_FILE_TYPES.length}  
    - المواد: ${Object.values(INITIAL_SUBJECTS).reduce((sum, subjects) => sum + subjects.length, 0)}`);

  } catch (error) {
    console.error('❌ حدث خطأ عام في عملية إدخال البيانات:', error);
  }
}

// تشغيل السكريبت
if (typeof window !== 'undefined') {
  // في المتصفح - يمكن استدعاؤه من Console
  window.initializeHierarchicalData = initializeData;
  console.log('💡 لتشغيل عملية إدخال البيانات، استخدم: initializeHierarchicalData()');
} else {
  // في Node.js
  initializeData();
}

export { initializeData };