import { Client, Databases, ID } from 'appwrite';
import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// Appwrite configuration
const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68d97982002b686c7151';

// البيانات المبدئية
const initialCategories = [
    {
        id: 'comp-sci',
        name: 'علوم الكمبيوتر',
        icon: '💻',
        color: '#3B82F6',
        description: 'برمجة، خوارزميات، هياكل البيانات، أمن المعلومات'
    },
    {
        id: 'engineering',
        name: 'الهندسة',
        icon: '⚙️',
        color: '#F59E0B',
        description: 'هندسة مدنية، كهربائية، ميكانيكية، كيميائية'
    },
    {
        id: 'medicine',
        name: 'الطب',
        icon: '🏥',
        color: '#DC2626',
        description: 'طب عام، تخصصات طبية، تمريض، صيدلة'
    },
    {
        id: 'business',
        name: 'إدارة الأعمال',
        icon: '💼',
        color: '#059669',
        description: 'إدارة، تسويق، محاسبة، اقتصاد'
    },
    {
        id: 'science',
        name: 'العلوم الطبيعية',
        icon: '🔬',
        color: '#7C3AED',
        description: 'فيزياء، كيمياء، أحياء، رياضيات'
    },
    {
        id: 'arts',
        name: 'الآداب والفنون',
        icon: '🎨',
        color: '#EC4899',
        description: 'لغة عربية، إنجليزية، تاريخ، فلسفة، فنون'
    },
    {
        id: 'law',
        name: 'القانون',
        icon: '⚖️',
        color: '#374151',
        description: 'قانون مدني، جنائي، تجاري، دولي'
    },
    {
        id: 'education',
        name: 'التربية والتعليم',
        icon: '📚',
        color: '#0891B2',
        description: 'أصول التربية، مناهج، علم النفس التربوي'
    },
    {
        id: 'social',
        name: 'العلوم الاجتماعية',
        icon: '👥',
        color: '#EA580C',
        description: 'علم الاجتماع، علم النفس، الخدمة الاجتماعية'
    },
    {
        id: 'islamic',
        name: 'الدراسات الإسلامية',
        icon: '☪️',
        color: '#16A34A',
        description: 'القرآن الكريم، الحديث الشريف، الفقه، التفسير'
    }
];

const initialSubjects = [
    // علوم الكمبيوتر
    { categoryId: 'comp-sci', name: 'مقدمة في البرمجة', code: 'CS101' },
    { categoryId: 'comp-sci', name: 'هياكل البيانات', code: 'CS201' },
    { categoryId: 'comp-sci', name: 'الخوارزميات', code: 'CS202' },
    { categoryId: 'comp-sci', name: 'برمجة الويب', code: 'CS301' },
    { categoryId: 'comp-sci', name: 'قواعد البيانات', code: 'CS302' },
    { categoryId: 'comp-sci', name: 'أمن المعلومات', code: 'CS401' },
    { categoryId: 'comp-sci', name: 'الذكاء الاصطناعي', code: 'CS402' },
    { categoryId: 'comp-sci', name: 'هندسة البرمجيات', code: 'CS403' },

    // الهندسة
    { categoryId: 'engineering', name: 'الرياضيات الهندسية', code: 'ENG101' },
    { categoryId: 'engineering', name: 'الفيزياء الهندسية', code: 'ENG102' },
    { categoryId: 'engineering', name: 'الرسم الهندسي', code: 'ENG103' },
    { categoryId: 'engineering', name: 'مقاومة المواد', code: 'ENG201' },
    { categoryId: 'engineering', name: 'الديناميكا الحرارية', code: 'ENG202' },
    { categoryId: 'engineering', name: 'الدوائر الكهربائية', code: 'ENG301' },
    { categoryId: 'engineering', name: 'هندسة التحكم', code: 'ENG401' },

    // الطب
    { categoryId: 'medicine', name: 'التشريح', code: 'MED101' },
    { categoryId: 'medicine', name: 'علم وظائف الأعضاء', code: 'MED102' },
    { categoryId: 'medicine', name: 'الكيمياء الحيوية', code: 'MED201' },
    { categoryId: 'medicine', name: 'علم الأمراض', code: 'MED202' },
    { categoryId: 'medicine', name: 'الطب الباطني', code: 'MED301' },
    { categoryId: 'medicine', name: 'الجراحة العامة', code: 'MED302' },
    { categoryId: 'medicine', name: 'طب الأطفال', code: 'MED401' },

    // إدارة الأعمال
    { categoryId: 'business', name: 'مبادئ الإدارة', code: 'BUS101' },
    { categoryId: 'business', name: 'مبادئ المحاسبة', code: 'BUS102' },
    { categoryId: 'business', name: 'مبادئ التسويق', code: 'BUS201' },
    { categoryId: 'business', name: 'الاقتصاد الجزئي', code: 'BUS202' },
    { categoryId: 'business', name: 'إدارة الموارد البشرية', code: 'BUS301' },
    { categoryId: 'business', name: 'إدارة العمليات', code: 'BUS302' },
    { categoryId: 'business', name: 'الإدارة الاستراتيجية', code: 'BUS401' },

    // العلوم الطبيعية
    { categoryId: 'science', name: 'الرياضيات العامة', code: 'SCI101' },
    { categoryId: 'science', name: 'الفيزياء العامة', code: 'SCI102' },
    { categoryId: 'science', name: 'الكيمياء العامة', code: 'SCI103' },
    { categoryId: 'science', name: 'علم الأحياء', code: 'SCI104' },
    { categoryId: 'science', name: 'التفاضل والتكامل', code: 'SCI201' },
    { categoryId: 'science', name: 'الفيزياء الحديثة', code: 'SCI202' },
    { categoryId: 'science', name: 'الكيمياء العضوية', code: 'SCI203' },

    // الآداب والفنون
    { categoryId: 'arts', name: 'النحو والصرف', code: 'ART101' },
    { categoryId: 'arts', name: 'الأدب العربي', code: 'ART102' },
    { categoryId: 'arts', name: 'اللغة الإنجليزية', code: 'ART103' },
    { categoryId: 'arts', name: 'التاريخ الإسلامي', code: 'ART201' },
    { categoryId: 'arts', name: 'الفلسفة', code: 'ART202' },
    { categoryId: 'arts', name: 'الفنون الجميلة', code: 'ART301' },

    // القانون
    { categoryId: 'law', name: 'مدخل إلى القانون', code: 'LAW101' },
    { categoryId: 'law', name: 'القانون المدني', code: 'LAW201' },
    { categoryId: 'law', name: 'القانون الجنائي', code: 'LAW202' },
    { categoryId: 'law', name: 'القانون التجاري', code: 'LAW301' },
    { categoryId: 'law', name: 'القانون الدولي', code: 'LAW401' },

    // التربية والتعليم
    { categoryId: 'education', name: 'أصول التربية', code: 'EDU101' },
    { categoryId: 'education', name: 'علم النفس التربوي', code: 'EDU102' },
    { categoryId: 'education', name: 'المناهج وطرق التدريس', code: 'EDU201' },
    { categoryId: 'education', name: 'القياس والتقويم', code: 'EDU301' },

    // العلوم الاجتماعية
    { categoryId: 'social', name: 'مدخل إلى علم الاجتماع', code: 'SOC101' },
    { categoryId: 'social', name: 'علم النفس العام', code: 'SOC102' },
    { categoryId: 'social', name: 'الخدمة الاجتماعية', code: 'SOC201' },
    { categoryId: 'social', name: 'علم النفس الاجتماعي', code: 'SOC301' },

    // الدراسات الإسلامية
    { categoryId: 'islamic', name: 'تلاوة وتجويد', code: 'ISL101' },
    { categoryId: 'islamic', name: 'التفسير', code: 'ISL102' },
    { categoryId: 'islamic', name: 'الحديث الشريف', code: 'ISL201' },
    { categoryId: 'islamic', name: 'الفقه', code: 'ISL202' },
    { categoryId: 'islamic', name: 'العقيدة', code: 'ISL301' }
];

const initialFileTypes = [
    {
        id: 'pdf',
        name: 'PDF',
        extension: 'pdf',
        icon: '📄',
        color: '#DC2626'
    },
    {
        id: 'doc',
        name: 'Word Document',
        extension: 'docx',
        icon: '📝',
        color: '#2563EB'
    },
    {
        id: 'ppt',
        name: 'PowerPoint',
        extension: 'pptx',
        icon: '📊',
        color: '#DC2626'
    },
    {
        id: 'excel',
        name: 'Excel',
        extension: 'xlsx',
        icon: '📈',
        color: '#059669'
    },
    {
        id: 'image',
        name: 'صورة',
        extension: 'jpg,png,gif',
        icon: '🖼️',
        color: '#7C3AED'
    },
    {
        id: 'video',
        name: 'فيديو',
        extension: 'mp4,avi,mov',
        icon: '🎥',
        color: '#EA580C'
    },
    {
        id: 'audio',
        name: 'صوت',
        extension: 'mp3,wav,m4a',
        icon: '🎵',
        color: '#EC4899'
    },
    {
        id: 'archive',
        name: 'أرشيف',
        extension: 'zip,rar,7z',
        icon: '📦',
        color: '#374151'
    }
];

// دوال إضافة البيانات
async function addCategories() {
    console.log('📂 إضافة التصنيفات...');
    for (const category of initialCategories) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                'categories',
                category.id,
                {
                    name: category.name,
                    icon: category.icon,
                    color: category.color,
                    description: category.description,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            console.log(`✅ تم إضافة تصنيف: ${category.name}`);
        } catch (error) {
            console.error(`❌ خطأ في إضافة ${category.name}:`, error.message);
        }
    }
}

async function addSubjects() {
    console.log('📚 إضافة المواد...');
    for (const subject of initialSubjects) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                'subjects',
                ID.unique(),
                {
                    categoryId: subject.categoryId,
                    name: subject.name,
                    code: subject.code,
                    description: `مادة ${subject.name} - رمز المادة: ${subject.code}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            console.log(`✅ تم إضافة مادة: ${subject.name} (${subject.code})`);
        } catch (error) {
            console.error(`❌ خطأ في إضافة ${subject.name}:`, error.message);
        }
    }
}

async function addFileTypes() {
    console.log('📁 إضافة أنواع الملفات...');
    for (const fileType of initialFileTypes) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                'fileTypes',
                fileType.id,
                {
                    name: fileType.name,
                    extension: fileType.extension,
                    icon: fileType.icon,
                    color: fileType.color,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            console.log(`✅ تم إضافة نوع ملف: ${fileType.name}`);
        } catch (error) {
            console.error(`❌ خطأ في إضافة ${fileType.name}:`, error.message);
        }
    }
}

// تشغيل السكريبت
async function initializeDatabase() {
    console.log('🚀 بدء تهيئة قاعدة البيانات...');
    
    try {
        await addCategories();
        await addSubjects();
        await addFileTypes();
        
        console.log('🎉 تم إكمال تهيئة قاعدة البيانات بنجاح!');
        console.log('\n📊 الإحصائيات:');
        console.log(`- ${initialCategories.length} تصنيف`);
        console.log(`- ${initialSubjects.length} مادة`);
        console.log(`- ${initialFileTypes.length} نوع ملف`);
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    }
}

// تشغيل السكريبت
initializeDatabase();