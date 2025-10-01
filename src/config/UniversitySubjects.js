// 🎓 المواد الجامعية المفصلة لكل تصنيف
// Academic subjects organized by categories

export const INITIAL_SUBJECTS = [
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
    name: 'الرياضة للجميع',
    nameAr: 'الرياضة للجميع',
    nameEn: 'Sports for All',
    categoryId: 'cultural-requirements',
    description: 'الأنشطة الرياضية والصحة',
    creditHours: 1,
    level: 'FRESHMAN',
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
    name: 'الفيزياء العامة العملي (1)',
    nameAr: 'الفيزياء العامة العملي (1)',
    nameEn: 'General Physics Lab I',
    categoryId: 'math-basic-sciences',
    description: 'التجارب العملية في الفيزياء',
    creditHours: 1,
    level: 'FRESHMAN',
    prerequisite: '',
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
  {
    name: 'الكيمياء العامة العملية (1)',
    nameAr: 'الكيمياء العامة العملية (1)',
    nameEn: 'General Chemistry Lab I',
    categoryId: 'math-basic-sciences',
    description: 'التجارب العملية في الكيمياء',
    creditHours: 1,
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
    name: 'مشغل هندسي',
    nameAr: 'مشغل هندسي',
    nameEn: 'Engineering Workshop',
    categoryId: 'engineering-fundamentals',
    description: 'التدريب العملي في المشغل',
    creditHours: 1,
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
    name: 'مختبر دوائر كهربائية',
    nameAr: 'مختبر دوائر كهربائية',
    nameEn: 'Electric Circuits Lab',
    categoryId: 'electrical-electronics',
    description: 'التجارب العملية للدوائر الكهربائية',
    creditHours: 1,
    level: 'SOPHOMORE',
    prerequisite: '',
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
    name: 'مختبر إلكترونيات (1)',
    nameAr: 'مختبر إلكترونيات (1)',
    nameEn: 'Electronics Lab I',
    categoryId: 'electrical-electronics',
    description: 'التجارب العملية في الإلكترونيات',
    creditHours: 1,
    level: 'SOPHOMORE',
    prerequisite: '',
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
  {
    name: 'مختبر أنظمة التحكم',
    nameAr: 'مختبر أنظمة التحكم',
    nameEn: 'Control Systems Lab',
    categoryId: 'electrical-electronics',
    description: 'التطبيقات العملية لأنظمة التحكم',
    creditHours: 1,
    level: 'JUNIOR',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'آلات كهربائية (1)',
    nameAr: 'آلات كهربائية (1)',
    nameEn: 'Electric Machines I',
    categoryId: 'electrical-electronics',
    description: 'المحركات والمولدات الكهربائية',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'دوائر كهربائية (2)',
    isActive: true
  }

  // سأكمل باقي المواد في الجزء التالي...
];

export default INITIAL_SUBJECTS;