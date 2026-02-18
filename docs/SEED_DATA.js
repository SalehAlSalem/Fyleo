// Seed data for Fyleo Platform
// Run this in PocketBase console to populate initial data

const pb = new PocketBase('http://localhost:8090')

async function seedData() {
  try {
    console.log('🌱 بدء ملء البيانات...')

    // 1. Create Categories
    console.log('📁 إضافة التصنيفات...')
    const categoriesData = [
      {
        nameAr: 'الرياضيات',
        nameEn: 'Mathematics',
        descriptionAr: 'مواد الرياضيات والإحصاء',
        icon: '📐',
        color: '#3b82f6',
        slug: 'mathematics',
        order: 1,
      },
      {
        nameAr: 'العلوم',
        nameEn: 'Science',
        descriptionAr: 'الفيزياء والكيمياء والأحياء',
        icon: '🔬',
        color: '#10b981',
        slug: 'science',
        order: 2,
      },
      {
        nameAr: 'اللغات',
        nameEn: 'Languages',
        descriptionAr: 'اللغة الإنجليزية والفرنسية والعربية',
        icon: '🗣️',
        color: '#f59e0b',
        slug: 'languages',
        order: 3,
      },
      {
        nameAr: 'التقنية',
        nameEn: 'Technology',
        descriptionAr: 'البرمجة وعلوم الحاسوب',
        icon: '💻',
        color: '#8b5cf6',
        slug: 'technology',
        order: 4,
      },
      {
        nameAr: 'الاجتماعيات',
        nameEn: 'Social Sciences',
        descriptionAr: 'التاريخ والجغرافيا والاقتصاد',
        icon: '🌍',
        color: '#ef4444',
        slug: 'social-sciences',
        order: 5,
      },
    ]

    const categories = {}
    for (const catData of categoriesData) {
      const category = await pb.collection('categories').create(catData)
      categories[catData.slug] = category.id
      console.log(`  ✓ ${catData.nameAr}`)
    }

    // 2. Create File Types
    console.log('📄 إضافة أنواع الملفات...')
    const fileTypesData = [
      {
        nameAr: 'ملف PDF',
        nameEn: 'PDF File',
        mimeType: 'application/pdf',
        extension: 'pdf',
        icon: '📕',
        color: '#ff4444',
        allowedInBrowser: true,
      },
      {
        nameAr: 'ملف Word',
        nameEn: 'Word Document',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx',
        icon: '📗',
        color: '#4472c4',
        allowedInBrowser: false,
      },
      {
        nameAr: 'صورة',
        nameEn: 'Image',
        mimeType: 'image/',
        extension: 'jpg,png',
        icon: '🖼️',
        color: '#52c41a',
        allowedInBrowser: true,
      },
      {
        nameAr: 'ملف PowerPoint',
        nameEn: 'PowerPoint',
        mimeType: 'application/vnd.ms-powerpoint',
        extension: 'pptx',
        icon: '📊',
        color: '#ed7d31',
        allowedInBrowser: false,
      },
    ]

    const fileTypes = {}
    for (const ftData of fileTypesData) {
      const ft = await pb.collection('fileTypes').create(ftData)
      fileTypes[ftData.extension] = ft.id
      console.log(`  ✓ ${ftData.nameAr}`)
    }

    // 3. Create Subjects
    console.log('📚 إضافة المواد الدراسية...')
    const subjectsData = [
      {
        nameAr: 'الكيمياء العامة',
        nameEn: 'General Chemistry',
        descriptionAr: 'أساسيات الكيمياء والجداول الدورية',
        categoryId: categories['science'],
        code: 'CHEM101',
        creditHours: 3,
        level: '1',
      },
      {
        nameAr: 'حساب التفاضل والتكامل',
        nameEn: 'Calculus',
        descriptionAr: 'الدوال والتفاضل والتكامل',
        categoryId: categories['mathematics'],
        code: 'MATH101',
        creditHours: 4,
        level: '1',
      },
      {
        nameAr: 'اللغة الإنجليزية',
        nameEn: 'English Language',
        descriptionAr: 'تعلم اللغة الإنجليزية من الصفر',
        categoryId: categories['languages'],
        code: 'ENG101',
        creditHours: 3,
        level: '1',
      },
      {
        nameAr: 'البرمجة بـ Python',
        nameEn: 'Python Programming',
        descriptionAr: 'تعلم البرمجة باستخدام Python',
        categoryId: categories['technology'],
        code: 'CS101',
        creditHours: 3,
        level: '1',
      },
      {
        nameAr: 'الفيزياء الحديثة',
        nameEn: 'Modern Physics',
        descriptionAr: 'الفيزياء الكمية والنسبية',
        categoryId: categories['science'],
        code: 'PHYS201',
        creditHours: 4,
        level: '2',
      },
      {
        nameAr: 'التاريخ الإسلامي',
        nameEn: 'Islamic History',
        descriptionAr: 'تاريخ الحضارة الإسلامية',
        categoryId: categories['social-sciences'],
        code: 'HIST101',
        creditHours: 3,
        level: '1',
      },
    ]

    const subjects = {}
    for (const subjData of subjectsData) {
      const subject = await pb.collection('subjects').create(subjData)
      subjects[subjData.code] = subject.id
      console.log(`  ✓ ${subjData.nameAr}`)
    }

    console.log(
      '\n✅ انتهى ملء البيانات بنجاح!\n',
      'يمكنك الآن استخدام المنصة.'
    )
  } catch (error) {
    console.error('❌ خطأ في ملء البيانات:', error)
  }
}

// Run seed
seedData()
