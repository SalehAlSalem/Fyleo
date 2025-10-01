// 🎓 سكريبت تهيئة النظام الجامعي الهرمي الكامل
// Complete University Hierarchical System Initialization

import { Client, Databases, ID } from 'appwrite';
import { 
  DATABASE_ID, 
  CATEGORIES_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID,
  FILE_TYPES_COLLECTION_ID
} from '../src/config/appwrite.js';
import { INITIAL_CATEGORIES, INITIAL_FILE_TYPES } from '../src/config/CategoryService.js';

// إعداد Appwrite Client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const databases = new Databases(client);

// 🎓 جميع المواد الجامعية المنظمة حسب التصنيف
const COMPLETE_SUBJECTS = [
  // 1. متطلبات الجامعة (University Requirements)
  {
    name: 'لغة عربية تطبيقية',
    nameAr: 'لغة عربية تطبيقية',
    nameEn: 'Applied Arabic Language',
    categoryId: 'university-requirements',
    description: 'مهارات اللغة العربية الأساسية',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'لغة إنجليزية تطبيقية 1',
    nameAr: 'لغة إنجليزية تطبيقية 1',
    nameEn: 'Applied English Language 1',
    categoryId: 'university-requirements',
    description: 'مهارات اللغة الإنجليزية الأساسية',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'لغة إنجليزية تطبيقية 2',
    nameAr: 'لغة إنجليزية تطبيقية 2',
    nameEn: 'Applied English Language 2',
    categoryId: 'university-requirements',
    description: 'مهارات اللغة الإنجليزية المتقدمة',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: 'لغة إنجليزية تطبيقية 1',
    isActive: true
  },
  {
    name: 'التربية الوطنية والسلوك الجامعي',
    nameAr: 'التربية الوطنية والسلوك الجامعي',
    nameEn: 'National Education & University Behavior',
    categoryId: 'university-requirements',
    description: 'التربية الوطنية والسلوك الجامعي',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'علوم عسكرية',
    nameAr: 'علوم عسكرية',
    nameEn: 'Military Sciences',
    categoryId: 'university-requirements',
    description: 'العلوم العسكرية والدفاع',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'مهارات الحاسوب والتعليم الالكتروني',
    nameAr: 'مهارات الحاسوب والتعليم الالكتروني',
    nameEn: 'Computer Skills & E-Learning',
    categoryId: 'university-requirements',
    description: 'مهارات الحاسوب الأساسية والتعليم الإلكتروني',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'الابتكار والريادة والإبداع',
    nameAr: 'الابتكار والريادة والإبداع',
    nameEn: 'Innovation, Entrepreneurship & Creativity',
    categoryId: 'university-requirements',
    description: 'مهارات الابتكار والريادة في الأعمال',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: '',
    isActive: true
  },

  // 2. متطلبات ثقافية (Cultural Requirements)
  {
    name: 'مفاهيم ومهارات إدارية معاصرة',
    nameAr: 'مفاهيم ومهارات إدارية معاصرة',
    nameEn: 'Contemporary Management Concepts & Skills',
    categoryId: 'cultural-requirements',
    description: 'المفاهيم الحديثة في الإدارة',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'مبادئ علم النفس',
    nameAr: 'مبادئ علم النفس',
    nameEn: 'Principles of Psychology',
    categoryId: 'cultural-requirements',
    description: 'الأسس النفسية للسلوك الإنساني',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'مهارات الاتصال',
    nameAr: 'مهارات الاتصال',
    nameEn: 'Communication Skills',
    categoryId: 'cultural-requirements',
    description: 'مهارات التواصل الفعال',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'المجتمع الأردني',
    nameAr: 'المجتمع الأردني',
    nameEn: 'Jordanian Society',
    categoryId: 'cultural-requirements',
    description: 'دراسة المجتمع الأردني وتاريخه',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'الثقافة الإسلامية',
    nameAr: 'الثقافة الإسلامية',
    nameEn: 'Islamic Culture',
    categoryId: 'cultural-requirements',
    description: 'أسس الثقافة والحضارة الإسلامية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },

  // 3. الرياضيات والعلوم الأساسية (Math & Basic Sciences)  
  {
    name: 'التفاضل والتكامل (1)',
    nameAr: 'التفاضل والتكامل (1)',
    nameEn: 'Calculus I',
    categoryId: 'math-basic-sciences',
    description: 'مبادئ التفاضل والتكامل',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'التفاضل والتكامل (2)',
    nameAr: 'التفاضل والتكامل (2)',
    nameEn: 'Calculus II',
    categoryId: 'math-basic-sciences',
    description: 'التفاضل والتكامل المتقدم',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: 'التفاضل والتكامل (1)',
    isActive: true
  },
  {
    name: 'المعادلات التفاضلية العادية (1)',
    nameAr: 'المعادلات التفاضلية العادية (1)',
    nameEn: 'Ordinary Differential Equations I',
    categoryId: 'math-basic-sciences',
    description: 'حل المعادلات التفاضلية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'التفاضل والتكامل (2)',
    isActive: true
  },
  {
    name: 'جبر خطي',
    nameAr: 'جبر خطي',
    nameEn: 'Linear Algebra',
    categoryId: 'math-basic-sciences',
    description: 'المصفوفات والفضاءات الخطية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'التفاضل والتكامل (1)',
    isActive: true
  },
  {
    name: 'إحصاء واحتمالات للهندسة',
    nameAr: 'إحصاء واحتمالات للهندسة',
    nameEn: 'Statistics & Probability for Engineering',
    categoryId: 'math-basic-sciences',
    description: 'الإحصاء والاحتمالات في التطبيقات الهندسية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'التفاضل والتكامل (2)',
    isActive: true
  },
  {
    name: 'الفيزياء العامة (1)',
    nameAr: 'الفيزياء العامة (1)',
    nameEn: 'General Physics I',
    categoryId: 'math-basic-sciences',
    description: 'مبادئ الفيزياء الكلاسيكية',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'الفيزياء العامة (2)',
    nameAr: 'الفيزياء العامة (2)',
    nameEn: 'General Physics II',
    categoryId: 'math-basic-sciences',
    description: 'الكهرباء والمغناطيسية',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: 'الفيزياء العامة (1)',
    isActive: true
  },
  {
    name: 'الكيمياء العامة (1)',
    nameAr: 'الكيمياء العامة (1)',
    nameEn: 'General Chemistry I',
    categoryId: 'math-basic-sciences',
    description: 'مبادئ الكيمياء العامة',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },

  // 4. أساسيات الهندسة (Engineering Fundamentals)
  {
    name: 'البرمجة للمهندسين',
    nameAr: 'البرمجة للمهندسين',
    nameEn: 'Programming for Engineers',
    categoryId: 'engineering-fundamentals',
    description: 'مبادئ البرمجة للتطبيقات الهندسية',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'الكتابة التقنية والأخلاقيات المهنية',
    nameAr: 'الكتابة التقنية والأخلاقيات المهنية',
    nameEn: 'Technical Writing & Professional Ethics',
    categoryId: 'engineering-fundamentals',
    description: 'مهارات الكتابة التقنية والأخلاقيات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'رسم هندسي',
    nameAr: 'رسم هندسي',
    nameEn: 'Engineering Drawing',
    categoryId: 'engineering-fundamentals',
    description: 'أساسيات الرسم الهندسي',
    creditHours: 3,
    level: 'FRESHMAN',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'اقتصاد هندسي',
    nameAr: 'اقتصاد هندسي',
    nameEn: 'Engineering Economics',
    categoryId: 'engineering-fundamentals',
    description: 'الجوانب الاقتصادية في الهندسة',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: '',
    isActive: true
  },

  // 5. هندسة الكهرباء والإلكترونيات
  {
    name: 'دوائر كهربائية (1)',
    nameAr: 'دوائر كهربائية (1)',
    nameEn: 'Electric Circuits I',
    categoryId: 'electrical-electronics',
    description: 'تحليل الدوائر الكهربائية الأساسية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'الفيزياء العامة (2)',
    isActive: true
  },
  {
    name: 'دوائر كهربائية (2)',
    nameAr: 'دوائر كهربائية (2)',
    nameEn: 'Electric Circuits II',
    categoryId: 'electrical-electronics',
    description: 'تحليل الدوائر المتقدم',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'دوائر كهربائية (1)',
    isActive: true
  },
  {
    name: 'إلكترونيات (1)',
    nameAr: 'إلكترونيات (1)',
    nameEn: 'Electronics I',
    categoryId: 'electrical-electronics',
    description: 'العناصر الإلكترونية الأساسية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'دوائر كهربائية (1)',
    isActive: true
  },
  {
    name: 'أنظمة التحكم',
    nameAr: 'أنظمة التحكم',
    nameEn: 'Control Systems',
    categoryId: 'electrical-electronics',
    description: 'تصميم وتحليل أنظمة التحكم',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'المعادلات التفاضلية العادية (1)',
    isActive: true
  },

  // 6. علوم الحاسوب والبرمجة (Computer Science & Programming)
  {
    name: 'البرمجة بلغة الكينونة (OOP)',
    nameAr: 'البرمجة بلغة الكينونة (OOP)',
    nameEn: 'Object-Oriented Programming',
    categoryId: 'computer-science-programming',
    description: 'مبادئ البرمجة كائنية التوجه',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'البرمجة للمهندسين',
    isActive: true
  },
  {
    name: 'تراكيب البيانات والخوارزميات',
    nameAr: 'تراكيب البيانات والخوارزميات',
    nameEn: 'Data Structures & Algorithms',
    categoryId: 'computer-science-programming',
    description: 'هياكل البيانات والخوارزميات الأساسية',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: 'البرمجة بلغة الكينونة (OOP)',
    isActive: true
  },
  {
    name: 'معمارية الحاسوب وتنظيمه',
    nameAr: 'معمارية الحاسوب وتنظيمه',
    nameEn: 'Computer Architecture & Organization',
    categoryId: 'computer-science-programming',
    description: 'بنية ومعمارية أنظمة الحاسوب',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'نظم التشغيل',
    nameAr: 'نظم التشغيل',
    nameEn: 'Operating Systems',
    categoryId: 'computer-science-programming',
    description: 'مبادئ وتصميم نظم التشغيل',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'معمارية الحاسوب وتنظيمه',
    isActive: true
  },
  {
    name: 'أنظمة قواعد البيانات',
    nameAr: 'أنظمة قواعد البيانات',
    nameEn: 'Database Systems',
    categoryId: 'computer-science-programming',
    description: 'تصميم وإدارة قواعد البيانات',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'تراكيب البيانات والخوارزميات',
    isActive: true
  },

  // 7. شبكات الحاسوب والاتصالات (Networks & Communications)
  {
    name: 'تصميم المنطق الرقمي',
    nameAr: 'تصميم المنطق الرقمي',
    nameEn: 'Digital Logic Design',
    categoryId: 'networks-communications',
    description: 'أساسيات التصميم المنطقي الرقمي',
    creditHours: 3,
    level: 'SOPHOMORE',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'أنظمة المعالجات الدقيقة',
    nameAr: 'أنظمة المعالجات الدقيقة',
    nameEn: 'Microprocessor Systems',
    categoryId: 'networks-communications',
    description: 'تصميم وبرمجة المعالجات الدقيقة',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'تصميم المنطق الرقمي',
    isActive: true
  },
  {
    name: 'اتصالات وتراسل البيانات',
    nameAr: 'اتصالات وتراسل البيانات',
    nameEn: 'Communications & Data Transmission',
    categoryId: 'networks-communications',
    description: 'مبادئ الاتصالات وتراسل البيانات',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'أساسيات شبكات الحاسوب',
    nameAr: 'أساسيات شبكات الحاسوب',
    nameEn: 'Computer Networks Fundamentals',
    categoryId: 'networks-communications',
    description: 'المبادئ الأساسية لشبكات الحاسوب',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'اتصالات وتراسل البيانات',
    isActive: true
  },
  {
    name: 'برمجة الشبكات',
    nameAr: 'برمجة الشبكات',
    nameEn: 'Network Programming',
    categoryId: 'networks-communications',
    description: 'برمجة تطبيقات الشبكات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'أساسيات شبكات الحاسوب',
    isActive: true
  },
  {
    name: 'بروتوكولات الشبكات',
    nameAr: 'بروتوكولات الشبكات',
    nameEn: 'Network Protocols',
    categoryId: 'networks-communications',
    description: 'بروتوكولات الاتصال في الشبكات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'أساسيات شبكات الحاسوب',
    isActive: true
  },
  {
    name: 'الشبكات اللاسلكية',
    nameAr: 'الشبكات اللاسلكية',
    nameEn: 'Wireless Networks',
    categoryId: 'networks-communications',
    description: 'تقنيات الشبكات اللاسلكية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'بروتوكولات الشبكات',
    isActive: true
  },
  {
    name: 'إنترنت الأشياء (IoT)',
    nameAr: 'إنترنت الأشياء (IoT)',
    nameEn: 'Internet of Things (IoT)',
    categoryId: 'networks-communications',
    description: 'تقنيات إنترنت الأشياء',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'الشبكات اللاسلكية',
    isActive: true
  },

  // 8. الأمن السيبراني والتحقيقات الرقمية
  {
    name: 'أساسيات الأمن السيبراني',
    nameAr: 'أساسيات الأمن السيبراني',
    nameEn: 'Cybersecurity Fundamentals',
    categoryId: 'cybersecurity-forensics',
    description: 'المبادئ الأساسية للأمن السيبراني',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'أساسيات شبكات الحاسوب',
    isActive: true
  },
  {
    name: 'التشفير وأمن أنظمة الشبكات',
    nameAr: 'التشفير وأمن أنظمة الشبكات',
    nameEn: 'Cryptography & Network Security',
    categoryId: 'cybersecurity-forensics',
    description: 'خوارزميات التشفير وأمن الشبكات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'أساسيات الأمن السيبراني',
    isActive: true
  },
  {
    name: 'القرصنة الأخلاقية',
    nameAr: 'القرصنة الأخلاقية',
    nameEn: 'Ethical Hacking',
    categoryId: 'cybersecurity-forensics',
    description: 'اختبار الاختراق والقرصنة الأخلاقية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'التشفير وأمن أنظمة الشبكات',
    isActive: true
  },
  {
    name: 'أنظمة التحقيقات والأدلة الرقمية',
    nameAr: 'أنظمة التحقيقات والأدلة الرقمية',
    nameEn: 'Digital Forensics & Investigation Systems',
    categoryId: 'cybersecurity-forensics',
    description: 'التحقيق في الجرائم الرقمية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'أساسيات الأمن السيبراني',
    isActive: true
  },

  // 9. تقنيات متقدمة (Advanced Technologies)
  {
    name: 'الذكاء الاصطناعي وتعلم الآلة',
    nameAr: 'الذكاء الاصطناعي وتعلم الآلة',
    nameEn: 'Artificial Intelligence & Machine Learning',
    categoryId: 'advanced-technologies',
    description: 'مبادئ الذكاء الاصطناعي وتعلم الآلة',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'تراكيب البيانات والخوارزميات',
    isActive: true
  },
  {
    name: 'الحوسبة السحابية',
    nameAr: 'الحوسبة السحابية',
    nameEn: 'Cloud Computing',
    categoryId: 'advanced-technologies',
    description: 'تقنيات وخدمات الحوسبة السحابية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'أساسيات شبكات الحاسوب',
    isActive: true
  },
  {
    name: 'مقدمة إلى نظام لينكس',
    nameAr: 'مقدمة إلى نظام لينكس',
    nameEn: 'Introduction to Linux Systems',
    categoryId: 'advanced-technologies',
    description: 'إدارة واستخدام أنظمة لينكس',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'نظم التشغيل',
    isActive: true
  },

  // 10. مشاريع وتدريب (Projects & Training)
  {
    name: 'التدريب الميداني',
    nameAr: 'التدريب الميداني',
    nameEn: 'Field Training',
    categoryId: 'projects-training',
    description: 'التدريب العملي في الشركات والمؤسسات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'إنجاز 120 ساعة معتمدة',
    isActive: true
  },
  {
    name: 'مشروع التخرج (1)',
    nameAr: 'مشروع التخرج (1)',
    nameEn: 'Graduation Project I',
    categoryId: 'projects-training',
    description: 'المرحلة الأولى من مشروع التخرج',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'إنجاز 130 ساعة معتمدة',
    isActive: true
  },
  {
    name: 'مشروع التخرج (2)',
    nameAr: 'مشروع التخرج (2)',
    nameEn: 'Graduation Project II',
    categoryId: 'projects-training',
    description: 'المرحلة الثانية من مشروع التخرج',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'مشروع التخرج (1)',
    isActive: true
  }
];

// 🔧 دوال التهيئة
async function initializeCategories() {
  console.log('🏗️ بدء تهيئة التصنيفات...');
  
  for (const category of INITIAL_CATEGORIES) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        category
      );
      console.log(`✅ تم إنشاء التصنيف: ${category.nameAr}`, response.$id);
    } catch (error) {
      console.error(`❌ خطأ في إنشاء التصنيف: ${category.nameAr}`, error.message);
    }
  }
  
  console.log('✅ انتهت تهيئة التصنيفات');
}

async function initializeSubjects() {
  console.log('📚 بدء تهيئة المواد...');
  
  for (const subject of COMPLETE_SUBJECTS) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        ID.unique(),
        subject
      );
      console.log(`✅ تم إنشاء المادة: ${subject.nameAr}`, response.$id);
    } catch (error) {
      console.error(`❌ خطأ في إنشاء المادة: ${subject.nameAr}`, error.message);
    }
  }
  
  console.log('✅ انتهت تهيئة المواد');
}

async function initializeFileTypes() {
  console.log('📁 بدء تهيئة أنواع الملفات...');
  
  for (const fileType of INITIAL_FILE_TYPES) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        ID.unique(),
        fileType
      );
      console.log(`✅ تم إنشاء نوع الملف: ${fileType.nameAr}`, response.$id);
    } catch (error) {
      console.error(`❌ خطأ في إنشاء نوع الملف: ${fileType.nameAr}`, error.message);
    }
  }
  
  console.log('✅ انتهت تهيئة أنواع الملفات');
}

// 🚀 دالة التهيئة الكاملة
async function initializeCompleteSystem() {
  console.log('🎓 بدء تهيئة النظام الجامعي الهرمي الكامل...');
  console.log('📊 الإحصائيات:');
  console.log(`   - التصنيفات: ${INITIAL_CATEGORIES.length}`);
  console.log(`   - المواد: ${COMPLETE_SUBJECTS.length}`);
  console.log(`   - أنواع الملفات: ${INITIAL_FILE_TYPES.length}`);
  
  try {
    await initializeCategories();
    await initializeSubjects();
    await initializeFileTypes();
    
    console.log('🎉 تم إنشاء النظام الجامعي الهرمي بنجاح!');
    console.log('📋 يمكنك الآن:');
    console.log('   1. استعراض التصنيفات في صفحة Categories');
    console.log('   2. استعراض المواد لكل تصنيف');
    console.log('   3. رفع الملفات بتنظيم هرمي');
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة النظام:', error);
  }
}

// تشغيل السكريبت
initializeCompleteSystem();