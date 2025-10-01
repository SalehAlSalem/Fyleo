import { Client, Databases, Query, ID } from 'appwrite';
import { 
  DATABASE_ID, 
  CATEGORIES_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID,
  FILE_TYPES_COLLECTION_ID,
  FILES_COLLECTION_ID
} from './appwrite.js';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const databases = new Databases(client);

export const CategoryService = {
  // ============= التصنيفات الجامعية الـ10 الرئيسية =============
  MAIN_CATEGORIES: [
    {
      id: 'university-requirements',
      name: 'متطلبات الجامعة',
      nameEn: 'University Requirements',
      description: 'المواد الإجبارية لجميع طلاب الجامعة',
      icon: '🎓',
      color: '#3B82F6',
      order: 1,
      subjects: [
        'لغة عربية تطبيقية',
        'لغة إنجليزية تطبيقية 1',
        'لغة إنجليزية تطبيقية 2', 
        'التربية الوطنية والسلوك الجامعي',
        'علوم عسكرية',
        'مهارات الحاسوب والتعليم الالكتروني',
        'الابتكار والريادة والإبداع'
      ]
    },
    {
      id: 'cultural-requirements',
      name: 'متطلبات ثقافية',
      nameEn: 'Cultural Requirements',
      description: 'المواد الثقافية والاختيارية للطلاب',
      icon: '📚',
      color: '#10B981',
      order: 2,
      subjects: [
        'مفاهيم ومهارات إدارية معاصرة',
        'مبادئ علم النفس',
        'مهارات الاتصال',
        'المجتمع الأردني',
        'الرياضة للجميع',
        'الثقافة الإسلامية',
        'مفاهيم اقتصادية',
        'الزراعة في الأردن',
        'البيئة والمجتمع',
        'الخلفاء الراشدين',
        'القدس (القضية الفلسطينية)',
        'القانون والإعلام والمجتمع',
        'الإسلام والحياة',
        'المجتمع الرقمي',
        'السلامة المرورية'
      ]
    },
    {
      id: 'math-basic-sciences',
      name: 'الرياضيات والعلوم الأساسية',
      nameEn: 'Math & Basic Sciences',
      description: 'المواد الأساسية للرياضيات والعلوم',
      icon: '🔢',
      color: '#8B5CF6',
      order: 3,
      subjects: [
        'التفاضل والتكامل (1)',
        'التفاضل والتكامل (2)',
        'المعادلات التفاضلية العادية (1)',
        'جبر خطي',
        'إحصاء واحتمالات للهندسة',
        'الفيزياء العامة (1)',
        'الفيزياء العامة (2)',
        'الفيزياء العامة العملي (1)',
        'الكيمياء العامة (1)',
        'الكيمياء العامة العملية (1)'
      ]
    },
    {
      id: 'engineering-fundamentals',
      name: 'أساسيات الهندسة',
      nameEn: 'Engineering Fundamentals',
      description: 'المبادئ الأساسية للهندسة',
      icon: '⚙️',
      color: '#F59E0B',
      order: 4,
      subjects: [
        'البرمجة للمهندسين',
        'الكتابة التقنية والأخلاقيات المهنية',
        'رسم هندسي',
        'مشغل هندسي',
        'اقتصاد هندسي'
      ]
    },
    {
      id: 'electrical-electronics',
      name: 'هندسة الكهرباء والإلكترونيات',
      nameEn: 'Electrical & Electronics Engineering',
      description: 'مواد الهندسة الكهربائية والإلكترونية',
      icon: '⚡',
      color: '#EF4444',
      order: 5,
      subjects: [
        'دوائر كهربائية (1)',
        'دوائر كهربائية (2)',
        'مختبر دوائر كهربائية',
        'إلكترونيات (1)',
        'مختبر إلكترونيات (1)',
        'أنظمة التحكم',
        'مختبر أنظمة التحكم',
        'آلات كهربائية (1)'
      ]
    },
    {
      id: 'computer-science-programming',
      name: 'علوم الحاسوب والبرمجة',
      nameEn: 'Computer Science & Programming',
      description: 'مواد البرمجة وعلوم الحاسوب',
      icon: '💻',
      color: '#06B6D4',
      order: 6,
      subjects: [
        'البرمجة بلغة الكينونة (OOP)',
        'تراكيب البيانات والخوارزميات',
        'مختبر تراكيب البيانات والخوارزميات',
        'معمارية الحاسوب وتنظيمه',
        'مختبر معمارية الحاسوب وتنظيمه',
        'نظم التشغيل',
        'أنظمة قواعد البيانات',
        'مختبر أنظمة قواعد البيانات'
      ]
    },
    {
      id: 'networks-communications',
      name: 'شبكات الحاسوب والاتصالات',
      nameEn: 'Networks & Communications',
      description: 'مواد الشبكات والاتصالات',
      icon: '🌐',
      color: '#84CC16',
      order: 7,
      subjects: [
        'تصميم المنطق الرقمي',
        'مختبر تصميم المنطق الرقمي',
        'أنظمة المعالجات الدقيقة',
        'مختبر أنظمة المعالجات الدقيقة',
        'أنظمة وإشارات',
        'اتصالات وتراسل البيانات',
        'أساسيات شبكات الحاسوب',
        'مختبر شبكات الحاسوب',
        'برمجة الشبكات',
        'بروتوكولات الشبكات',
        'مختبر بروتوكولات الشبكات',
        'الشبكات اللاسلكية',
        'شبكات الاستشعار اللاسلكية',
        'إنترنت الأشياء (IoT)',
        'نمذجة ومحاكاة أداء الشبكات'
      ]
    },
    {
      id: 'cybersecurity-forensics',
      name: 'الأمن السيبراني والتحقيقات الرقمية',
      nameEn: 'Cybersecurity & Digital Forensics',
      description: 'مواد الأمن السيبراني والتحقيقات',
      icon: '🔒',
      color: '#DC2626',
      order: 8,
      subjects: [
        'أساسيات الأمن السيبراني',
        'التشفير وأمن أنظمة الشبكات',
        'القرصنة الأخلاقية',
        'أمن الشبكات اللاسلكية',
        'أنظمة التحقيقات والأدلة الرقمية',
        'مختبر أنظمة التحقيقات والأدلة الرقمية',
        'موضوعات خاصة في هندسة أنظمة وأمن الشبكات'
      ]
    },
    {
      id: 'advanced-technologies',
      name: 'تقنيات متقدمة',
      nameEn: 'Advanced Technologies',
      description: 'التقنيات الحديثة والمتطورة',
      icon: '🚀',
      color: '#7C3AED',
      order: 9,
      subjects: [
        'الذكاء الاصطناعي وتعلم الآلة',
        'الحوسبة السحابية',
        'مقدمة إلى نظام لينكس'
      ]
    },
    {
      id: 'projects-training',
      name: 'مشاريع وتدريب',
      nameEn: 'Projects & Training',
      description: 'المشاريع والتدريب العملي',
      icon: '🎯',
      color: '#059669',
      order: 10,
      subjects: [
        'التدريب الميداني',
        'مشروع التخرج (1)',
        'مشروع التخرج (2)'
      ]
    }
  ],

  // ============= Categories Management =============
  async getAllCategories() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order')
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  },

  async getCategoryById(categoryId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId
      );
      return response;
    } catch (error) {
      console.error('Error getting category:', error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        categoryData
      );
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // ============= Subjects Management =============
  async getSubjectsByCategory(categoryId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
          Query.equal('isActive', true),
          Query.orderAsc('name')
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting subjects:', error);
      throw error;
    }
  },

  async getAllSubjects() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('name')
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting all subjects:', error);
      throw error;
    }
  },

  async getSubjectById(subjectId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId
      );
      return response;
    } catch (error) {
      console.error('Error getting subject:', error);
      throw error;
    }
  },

  async createSubject(subjectData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        ID.unique(),
        subjectData
      );
      return response;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  },

  // ============= File Types Management =============
  async getAllFileTypes() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        [
          Query.orderAsc('name')
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting file types:', error);
      throw error;
    }
  },

  async getFileTypeById(fileTypeId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        fileTypeId
      );
      return response;
    } catch (error) {
      console.error('Error getting file type:', error);
      throw error;
    }
  },

  // ============= Materials with Hierarchy =============
  async getFilesBySubject(subjectId, fileTypeId = null) {
    try {
      const queries = [
        Query.equal('subjectId', subjectId),
        Query.orderDesc('$createdAt')
      ];
      
      if (fileTypeId) {
        queries.push(Query.equal('fileTypeId', fileTypeId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );
      return response;
    } catch (error) {
      console.error('Error getting files by subject:', error);
      throw error;
    }
  },

  // دالة محسنة للحصول على الملفات حسب التصنيف والمادة معاً
  async getFilesByCategoryAndSubject(categoryId, subjectName, fileTypeId = null) {
    try {
      console.log('Getting files for:', { categoryId, subjectName, fileTypeId });
      
      // البحث بالاسم بدلاً من الـ ID
      const queries = [
        Query.equal('categoryId', categoryId),
        Query.equal('subject', subjectName), // استخدام subject بدلاً من subjectId
        Query.orderDesc('$createdAt')
      ];
      
      if (fileTypeId) {
        queries.push(Query.equal('fileTypeId', fileTypeId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );
      
      console.log('Files response from DB:', response);
      return response.documents || [];
    } catch (error) {
      console.error('Error getting files by category and subject:', error);
      
      // إذا فشل البحث بـ subject، جرب بـ subjectId
      try {
        console.log('Trying with subjectId instead...');
        const fallbackQueries = [
          Query.equal('categoryId', categoryId),
          Query.equal('subjectId', subjectName),
          Query.orderDesc('$createdAt')
        ];
        
        if (fileTypeId) {
          fallbackQueries.push(Query.equal('fileTypeId', fileTypeId));
        }

        const fallbackResponse = await databases.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          fallbackQueries
        );
        
        console.log('Fallback response:', fallbackResponse);
        return fallbackResponse.documents || [];
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return []; // إرجاع array فارغ بدلاً من throw
      }
    }
  },

  async getFilesByCategory(categoryId, fileTypeId = null) {
    try {
      const queries = [
        Query.equal('categoryId', categoryId),
        Query.orderDesc('$createdAt')
      ];
      
      if (fileTypeId) {
        queries.push(Query.equal('fileTypeId', fileTypeId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );
      return response;
    } catch (error) {
      console.error('Error getting files by category:', error);
      throw error;
    }
  },

  // ============= Statistics =============
  async getCategoryStats(categoryId) {
    try {
      // عدد المواد في التصنيف
      const subjectsResponse = await this.getSubjectsByCategory(categoryId);
      const subjectsCount = subjectsResponse.total;

      // عدد الملفات في التصنيف
      const filesResponse = await this.getFilesByCategory(categoryId);
      const filesCount = filesResponse.total;

      return {
        subjectsCount,
        filesCount,
        subjects: subjectsResponse.documents
      };
    } catch (error) {
      console.error('Error getting category stats:', error);
      throw error;
    }
  },

  async getSubjectStats(subjectId) {
    try {
      const filesResponse = await this.getFilesBySubject(subjectId);
      const filesCount = filesResponse.total;

      // تجميع الملفات حسب النوع
      const filesByType = {};
      filesResponse.documents.forEach(file => {
        const typeId = file.fileTypeId;
        if (!filesByType[typeId]) {
          filesByType[typeId] = 0;
        }
        filesByType[typeId]++;
      });

      return {
        filesCount,
        filesByType,
        files: filesResponse.documents
      };
    } catch (error) {
      console.error('Error getting subject stats:', error);
      throw error;
    }
  },

  // أنواع الملفات المتاحة
  INITIAL_FILE_TYPES: [
    {
      id: 'lectures',
      name: 'محاضرات',
      nameAr: 'محاضرات',
      nameEn: 'Lectures',
      icon: '📖',
      color: '#3B82F6',
      allowedFormats: 'pdf,ppt,pptx,doc,docx'
    },
    {
      id: 'slides',
      name: 'سلايدات',
      nameAr: 'سلايدات', 
      nameEn: 'Slides',
      icon: '📊',
      color: '#10B981',
      allowedFormats: 'pdf,ppt,pptx'
    },
    {
      id: 'books',
      name: 'كتب',
      nameAr: 'كتب',
      nameEn: 'Books',
      icon: '📚',
      color: '#8B5CF6',
      allowedFormats: 'pdf,epub'
    },
    {
      id: 'sheets',
      name: 'شيتات',
      nameAr: 'شيتات',
      nameEn: 'Sheets',
      icon: '📋',
      color: '#F59E0B',
      allowedFormats: 'pdf,doc,docx,xls,xlsx'
    },
    {
      id: 'exams',
      name: 'امتحانات',
      nameAr: 'امتحانات',
      nameEn: 'Exams',
      icon: '📝',
      color: '#EF4444',
      allowedFormats: 'pdf,doc,docx'
    },
    {
      id: 'projects',
      name: 'مشاريع',
      nameAr: 'مشاريع',
      nameEn: 'Projects',
      icon: '🗂️',
      color: '#06B6D4',
      allowedFormats: 'pdf,zip,rar,doc,docx'
    },
    {
      id: 'videos',
      name: 'فيديوهات',
      nameAr: 'فيديوهات',
      nameEn: 'Videos',
      icon: '🎥',
      color: '#DC2626',
      allowedFormats: 'mp4,avi,mkv,mov'
    },
    {
      id: 'notes',
      name: 'ملاحظات',
      nameAr: 'ملاحظات',
      nameEn: 'Notes',
      icon: '📝',
      color: '#84CC16',
      allowedFormats: 'pdf,doc,docx,txt'
    }
  ]
};

// البيانات الأولية للتصنيفات - تطابق MAIN_CATEGORIES
export const INITIAL_CATEGORIES = [
  {
    id: 'university-requirements',
    name: 'متطلبات الجامعة',
    nameAr: 'متطلبات الجامعة', 
    nameEn: 'University Requirements',
    description: 'المواد الإجبارية لجميع طلاب الجامعة',
    icon: '�',
    color: '#3B82F6',
    order: 1,
    isActive: true
  },
  {
    id: 'cultural-requirements',
    name: 'متطلبات ثقافية',
    nameAr: 'متطلبات ثقافية',
    nameEn: 'Cultural Requirements', 
    description: 'المواد الثقافية والاختيارية للطلاب',
    icon: '📚',
    color: '#10B981',
    order: 2,
    isActive: true
  },
  {
    id: 'math-basic-sciences',
    name: 'الرياضيات والعلوم الأساسية',
    nameAr: 'الرياضيات والعلوم الأساسية',
    nameEn: 'Math & Basic Sciences',
    description: 'المواد الأساسية للرياضيات والعلوم',
    icon: '🔢',
    color: '#8B5CF6',
    order: 3,
    isActive: true
  },
  {
    id: 'engineering-fundamentals',
    name: 'أساسيات الهندسة',
    nameAr: 'أساسيات الهندسة',
    nameEn: 'Engineering Fundamentals',
    description: 'المبادئ الأساسية للهندسة',
    icon: '⚙️',
    color: '#F59E0B',
    order: 4,
    isActive: true
  },
  {
    id: 'electrical-electronics',
    name: 'هندسة الكهرباء والإلكترونيات',
    nameAr: 'هندسة الكهرباء والإلكترونيات',
    nameEn: 'Electrical & Electronics Engineering',
    description: 'مواد الهندسة الكهربائية والإلكترونية',
    icon: '⚡',
    color: '#EF4444',
    order: 5,
    isActive: true
  },
  {
    id: 'computer-science-programming',
    name: 'علوم الحاسوب والبرمجة',
    nameAr: 'علوم الحاسوب والبرمجة',
    nameEn: 'Computer Science & Programming',
    description: 'مواد البرمجة وعلوم الحاسوب',
    icon: '💻',
    color: '#06B6D4',
    order: 6,
    isActive: true
  },
  {
    id: 'networks-communications',
    name: 'شبكات الحاسوب والاتصالات',
    nameAr: 'شبكات الحاسوب والاتصالات',
    nameEn: 'Networks & Communications',
    description: 'مواد الشبكات والاتصالات',
    icon: '🌐',
    color: '#84CC16',
    order: 7,
    isActive: true
  },
  {
    id: 'cybersecurity-forensics',
    name: 'الأمن السيبراني والتحقيقات الرقمية',
    nameAr: 'الأمن السيبراني والتحقيقات الرقمية',
    nameEn: 'Cybersecurity & Digital Forensics',
    description: 'مواد الأمن السيبراني والتحقيقات',
    icon: '🔒',
    color: '#DC2626',
    order: 8,
    isActive: true
  },
  {
    id: 'advanced-technologies',
    name: 'تقنيات متقدمة',
    nameAr: 'تقنيات متقدمة',
    nameEn: 'Advanced Technologies',
    description: 'التقنيات الحديثة والمتطورة',
    icon: '🚀',
    color: '#7C3AED',
    order: 9,
    isActive: true
  },
  {
    id: 'projects-training',
    name: 'مشاريع وتدريب',
    nameAr: 'مشاريع وتدريب',
    nameEn: 'Projects & Training',
    description: 'المشاريع والتدريب العملي',
    icon: '🎯',
    color: '#059669',
    order: 10,
    isActive: true
  }
];

// البيانات الأولية لأنواع الملفات
export const INITIAL_FILE_TYPES = [
  {
    name: 'محاضرات',
    nameAr: 'محاضرات',
    nameEn: 'Lectures',
    icon: '📖',
    color: '#3B82F6',
    allowedFormats: 'pdf,ppt,pptx,doc,docx'
  },
  {
    name: 'سلايدات',
    nameAr: 'سلايدات', 
    nameEn: 'Slides',
    icon: '📊',
    color: '#10B981',
    allowedFormats: 'pdf,ppt,pptx'
  },
  {
    name: 'كتب',
    nameAr: 'كتب',
    nameEn: 'Books',
    icon: '📚',
    color: '#8B5CF6',
    allowedFormats: 'pdf,epub'
  },
  {
    name: 'شيتات',
    nameAr: 'شيتات',
    nameEn: 'Sheets',
    icon: '📋',
    color: '#F59E0B',
    allowedFormats: 'pdf,doc,docx,xls,xlsx'
  },
  {
    name: 'امتحانات',
    nameAr: 'امتحانات',
    nameEn: 'Exams',
    icon: '📝',
    color: '#EF4444',
    allowedFormats: 'pdf,doc,docx'
  },
  {
    name: 'مشاريع',
    nameAr: 'مشاريع',
    nameEn: 'Projects',
    icon: '🗂️',
    color: '#06B6D4',
    allowedFormats: 'pdf,zip,rar,doc,docx'
  },
  {
    name: 'فيديوهات',
    nameAr: 'فيديوهات',
    nameEn: 'Videos',
    icon: '🎥',
    color: '#DC2626',
    allowedFormats: 'mp4,avi,mkv,mov'
  },
  {
    name: 'ملاحظات',
    nameAr: 'ملاحظات',
    nameEn: 'Notes',
    icon: '📝',
    color: '#84CC16',
    allowedFormats: 'pdf,doc,docx,txt'
  }
];