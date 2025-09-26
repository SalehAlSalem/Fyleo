import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../Firebase/ClientApp.js';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  useTranslation 
} from '../../components/modern/ModernComponents';

const ModernMaterials = () => {
  const { category } = useParams();
  const [user] = useAuthState(auth);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    { id: 'all', name: 'جميع المواد', icon: '📚', color: 'from-gray-500 to-gray-600' },
    { id: 'Computer Science', name: 'علوم الحاسوب', icon: '💻', color: 'from-blue-500 to-blue-600' },
    { id: 'Mathematics', name: 'الرياضيات', icon: '🔢', color: 'from-green-500 to-green-600' },
    { id: 'Physics', name: 'الفيزياء', icon: '⚛️', color: 'from-purple-500 to-purple-600' },
    { id: 'Chemistry', name: 'الكيمياء', icon: '🧪', color: 'from-red-500 to-red-600' },
    { id: 'Engineering', name: 'الهندسة', icon: '⚙️', color: 'from-orange-500 to-orange-600' },
    { id: 'Electronics', name: 'الإلكترونيات', icon: '🔌', color: 'from-yellow-500 to-yellow-600' },
    { id: 'Others', name: 'أخرى', icon: '📖', color: 'from-indigo-500 to-indigo-600' }
  ];

  useEffect(() => {
    fetchMaterials();
  }, [selectedCategory]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const materialsRef = collection(db, 'files');
      let q;
      
      if (selectedCategory === 'all') {
        q = query(
          materialsRef,
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      } else {
        q = query(
          materialsRef,
          where('category', '==', selectedCategory),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      const querySnapshot = await getDocs(q);
      const materialsList = [];
      
      querySnapshot.forEach((doc) => {
        materialsList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setMaterials(materialsList);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/materials');
    } else {
      navigate(`/materials/${categoryId}`);
    }
  };

  const handleFileClick = (material) => {
    if (material.downloadURL) {
      window.open(material.downloadURL, '_blank');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container-modern py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            📚 مكتبة المواد التعليمية
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف وحمل الملفات التعليمية المشاركة من قبل طلاب جامعة IIITDMJ
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <ModernInput
            type="text"
            placeholder="ابحث عن الملفات والمواد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
            className="text-lg"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            التصنيفات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`group p-4 rounded-xl transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-105'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className={`text-sm font-medium ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {cat.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {loading ? 'جاري التحميل...' : `النتائج: ${filteredMaterials.length} ملف`}
          </h3>
          {!user && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>سجل دخول لرفع الملفات</span>
            </div>
          )}
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ModernCard key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </ModernCard>
            ))}
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <ModernCard key={material.id} className="p-6 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                      📄
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                      {material.name}
                    </h3>
                    {material.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {material.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {material.category}
                      </span>
                      {material.size && (
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {formatFileSize(material.size)}
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {formatDate(material.createdAt)}
                      </span>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <ModernButton
                        size="sm"
                        onClick={() => handleFileClick(material)}
                        className="flex-1"
                      >
                        <span className="flex items-center space-x-1 rtl:space-x-reverse">
                          <span>👁️</span>
                          <span>عرض</span>
                        </span>
                      </ModernButton>
                      <ModernButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = material.downloadURL;
                          link.download = material.name;
                          link.click();
                        }}
                      >
                        <span className="flex items-center space-x-1 rtl:space-x-reverse">
                          <span>📥</span>
                          <span>تحميل</span>
                        </span>
                      </ModernButton>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              لا توجد ملفات
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              لم يتم العثور على ملفات في هذا التصنيف حالياً
            </p>
            {user && (
              <ModernButton onClick={() => navigate('/dashboard')}>
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span>📤</span>
                  <span>رفع ملف جديد</span>
                </span>
              </ModernButton>
            )}
          </div>
        )}

        {/* Upload CTA for non-users */}
        {!user && (
          <div className="mt-12 text-center">
            <ModernCard className="p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                شارك ملفاتك مع الطلاب
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                انضم إلى منصة Fyleo وابدأ في مشاركة المواد التعليمية مع زملائك في الجامعة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ModernButton onClick={() => navigate('/signup')}>
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>✨</span>
                    <span>إنشاء حساب</span>
                  </span>
                </ModernButton>
                <ModernButton variant="secondary" onClick={() => navigate('/login')}>
                  تسجيل الدخول
                </ModernButton>
              </div>
            </ModernCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernMaterials;