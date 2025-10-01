// 🎓 المواد الجامعية المفصلة - الجزء الثاني
// Academic subjects continued

export const ADDITIONAL_SUBJECTS = [
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
    name: 'مختبر تراكيب البيانات والخوارزميات',
    nameAr: 'مختبر تراكيب البيانات والخوارزميات',
    nameEn: 'Data Structures & Algorithms Lab',
    categoryId: 'computer-science-programming',
    description: 'التطبيق العملي لتراكيب البيانات',
    creditHours: 1,
    level: 'SOPHOMORE',
    prerequisite: '',
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
    name: 'مختبر معمارية الحاسوب وتنظيمه',
    nameAr: 'مختبر معمارية الحاسوب وتنظيمه',
    nameEn: 'Computer Architecture Lab',
    categoryId: 'computer-science-programming',
    description: 'التطبيقات العملية لمعمارية الحاسوب',
    creditHours: 1,
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
  {
    name: 'مختبر أنظمة قواعد البيانات',
    nameAr: 'مختبر أنظمة قواعد البيانات',
    nameEn: 'Database Systems Lab',
    categoryId: 'computer-science-programming',
    description: 'التطبيق العملي لقواعد البيانات',
    creditHours: 1,
    level: 'JUNIOR',
    prerequisite: '',
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
    name: 'مختبر تصميم المنطق الرقمي',
    nameAr: 'مختبر تصميم المنطق الرقمي',
    nameEn: 'Digital Logic Design Lab',
    categoryId: 'networks-communications',
    description: 'التطبيقات العملية للمنطق الرقمي',
    creditHours: 1,
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
    name: 'مختبر أنظمة المعالجات الدقيقة',
    nameAr: 'مختبر أنظمة المعالجات الدقيقة',
    nameEn: 'Microprocessor Systems Lab',
    categoryId: 'networks-communications',
    description: 'التطبيقات العملية للمعالجات الدقيقة',
    creditHours: 1,
    level: 'JUNIOR',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'أنظمة وإشارات',
    nameAr: 'أنظمة وإشارات',
    nameEn: 'Signals & Systems',
    categoryId: 'networks-communications',
    description: 'تحليل الإشارات والأنظمة',
    creditHours: 3,
    level: 'JUNIOR',
    prerequisite: 'المعادلات التفاضلية العادية (1)',
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
    prerequisite: 'أنظمة وإشارات',
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
    name: 'مختبر شبكات الحاسوب',
    nameAr: 'مختبر شبكات الحاسوب',
    nameEn: 'Computer Networks Lab',
    categoryId: 'networks-communications',
    description: 'التطبيقات العملية لشبكات الحاسوب',
    creditHours: 1,
    level: 'JUNIOR',
    prerequisite: '',
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
    name: 'مختبر بروتوكولات الشبكات',
    nameAr: 'مختبر بروتوكولات الشبكات',
    nameEn: 'Network Protocols Lab',
    categoryId: 'networks-communications',
    description: 'تطبيق عملي لبروتوكولات الشبكات',
    creditHours: 1,
    level: 'SENIOR',
    prerequisite: '',
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
    name: 'شبكات الاستشعار اللاسلكية',
    nameAr: 'شبكات الاستشعار اللاسلكية',
    nameEn: 'Wireless Sensor Networks',
    categoryId: 'networks-communications',
    description: 'شبكات أجهزة الاستشعار اللاسلكية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'الشبكات اللاسلكية',
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
    prerequisite: 'شبكات الاستشعار اللاسلكية',
    isActive: true
  },
  {
    name: 'نمذجة ومحاكاة أداء الشبكات',
    nameAr: 'نمذجة ومحاكاة أداء الشبكات',
    nameEn: 'Network Performance Modeling & Simulation',
    categoryId: 'networks-communications',
    description: 'محاكاة وتحليل أداء الشبكات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'بروتوكولات الشبكات',
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
    name: 'أمن الشبكات اللاسلكية',
    nameAr: 'أمن الشبكات اللاسلكية',
    nameEn: 'Wireless Network Security',
    categoryId: 'cybersecurity-forensics',
    description: 'أمان الشبكات اللاسلكية',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'الشبكات اللاسلكية',
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
  {
    name: 'مختبر أنظمة التحقيقات والأدلة الرقمية',
    nameAr: 'مختبر أنظمة التحقيقات والأدلة الرقمية',
    nameEn: 'Digital Forensics Lab',
    categoryId: 'cybersecurity-forensics',
    description: 'التطبيق العملي للتحقيقات الرقمية',
    creditHours: 1,
    level: 'SENIOR',
    prerequisite: '',
    isActive: true
  },
  {
    name: 'موضوعات خاصة في هندسة أنظمة وأمن الشبكات',
    nameAr: 'موضوعات خاصة في هندسة أنظمة وأمن الشبكات',
    nameEn: 'Special Topics in Network Systems & Security Engineering',
    categoryId: 'cybersecurity-forensics',
    description: 'موضوعات متقدمة في أمن الشبكات',
    creditHours: 3,
    level: 'SENIOR',
    prerequisite: 'التشفير وأمن أنظمة الشبكات',
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

export default ADDITIONAL_SUBJECTS;