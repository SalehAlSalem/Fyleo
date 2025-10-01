import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { CategoryService } from '../../config/CategoryService';
import { NavBar, Footer, BackToTop } from '../../components';

const SubjectsPage = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});

  // البيانات المرسلة من صفحة التصنيفات
  const categoryData = location.state || {};

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndSubjects();
    }
  }, [categoryId]);

  const fetchCategoryAndSubjects = async () => {
    try {
      setLoading(true);
      
      // جلب بيانات التصنيف
      const categoryResponse = await CategoryService.getCategoryById(categoryId);
      setCategory(categoryResponse);
      
      // جلب المواد الفرعية
      const subjectsResponse = await CategoryService.getSubjectsByCategory(categoryId);
      setSubjects(subjectsResponse.documents);
      
      // جلب إحصائيات كل مادة
      const statsData = {};
      for (const subject of subjectsResponse.documents) {
        try {
          const subjectStats = await CategoryService.getSubjectStats(subject.$id);
          statsData[subject.$id] = subjectStats;
        } catch (err) {
          console.warn(`Failed to get stats for subject ${subject.$id}:`, err);
          statsData[subject.$id] = { filesCount: 0, filesByType: {} };
        }
      }
      setStats(statsData);
    } catch (err) {
      setError('حدث خطأ في تحميل المواد');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    navigate(`/materials/${categoryId}/${subject.$id}`, {
      state: {
        categoryName: category?.nameAr || categoryData.categoryName,
        categoryIcon: category?.icon || categoryData.categoryIcon,
        categoryColor: category?.color || categoryData.categoryColor,
        subjectName: subject.nameAr,
        subjectDescription: subject.description,
        subjectLevel: subject.level,
        subjectCreditHours: subject.creditHours
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            التصنيف غير موجود
          </h2>
          <Link to="/categories" className="text-blue-600 hover:text-blue-800">
            العودة للتصنيفات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-600 dark:text-gray-400">
            <Link to="/categories" className="hover:text-blue-600">
              التصنيفات
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">
              {category.nameAr}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div 
        className="text-white py-16"
        style={{ backgroundColor: category.color || '#3B82F6' }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">
            {category.icon || '📁'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {category.nameAr}
          </h1>
          <p className="text-xl mb-2 opacity-90">
            {category.nameEn}
          </p>
          {category.description && (
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <div className="mt-8">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              {subjects.length} مادة متاحة
            </span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.$id}
              onClick={() => handleSubjectClick(subject)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Subject Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {subject.nameAr}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.nameEn}
                </p>
                
                {subject.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                    {subject.description}
                  </p>
                )}

                {/* Subject Details */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {subject.creditHours && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {subject.creditHours} ساعة معتمدة
                    </span>
                  )}
                  {subject.level && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {subject.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject Stats */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats[subject.$id]?.filesCount || 0}
                    </div>
                    <div className="text-xs text-gray-500">ملف</div>
                  </div>
                  
                  <div className="text-blue-600 dark:text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* File Types Preview */}
                {stats[subject.$id]?.filesByType && Object.keys(stats[subject.$id].filesByType).length > 0 && (
                  <div className="text-xs text-gray-500">
                    متوفر: {Object.keys(stats[subject.$id].filesByType).length} نوع ملف
                  </div>
                )}

                {/* Prerequisites */}
                {subject.prerequisite && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 mb-1">المتطلبات السابقة:</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                      {subject.prerequisite}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد مواد في هذا التصنيف
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              يرجى إضافة مواد من لوحة الإدارة
            </p>
            <Link 
              to="/categories"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للتصنيفات
            </Link>
          </div>
        )}
      </div>

      <BackToTop />
      <Footer />
    </div>
  );
};

export default SubjectsPage;