import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CategoryService } from '../../config/CategoryService';
import { NavBar, Footer, BackToTop } from '../../components';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategories();
      setCategories(response.documents);
      
      // جلب إحصائيات كل تصنيف
      const statsData = {};
      for (const category of response.documents) {
        try {
          const categoryStats = await CategoryService.getCategoryStats(category.$id);
          statsData[category.$id] = categoryStats;
        } catch (err) {
          console.warn(`Failed to get stats for category ${category.$id}:`, err);
          statsData[category.$id] = { subjectsCount: 0, filesCount: 0 };
        }
      }
      setStats(statsData);
    } catch (err) {
      setError('حدث خطأ في تحميل التصنيفات');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/subjects/${category.$id}`, {
      state: {
        categoryName: category.nameAr,
        categoryIcon: category.icon,
        categoryColor: category.color
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📚 تصفح المواد الدراسية
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            اختر التصنيف المناسب لتصفح المواد والملفات
          </p>
          <div className="text-lg">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              {categories.length} تصنيف متاح
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.$id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 overflow-hidden"
              style={{ borderLeftColor: category.color || '#3B82F6' }}
            >
              {/* Category Icon & Header */}
              <div 
                className="p-6 text-white"
                style={{ backgroundColor: category.color || '#3B82F6' }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl">
                    {category.icon || '📁'}
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">التصنيف</div>
                    <div className="text-xs opacity-75">#{category.order}</div>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.nameAr}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {category.nameEn}
                </p>
                
                {category.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Statistics */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-4 space-x-reverse">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats[category.$id]?.subjectsCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">مادة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats[category.$id]?.filesCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">ملف</div>
                    </div>
                  </div>
                  
                  <div className="text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد تصنيفات متاحة
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يرجى إضافة تصنيفات من لوحة الإدارة
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">تصنيف</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.values(stats).reduce((sum, s) => sum + (s.subjectsCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مادة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.values(stats).reduce((sum, s) => sum + (s.filesCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ملف</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                🎯
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">منظم</div>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
      <Footer />
    </div>
  );
};

export default CategoriesPage;