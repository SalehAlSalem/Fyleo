import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryService } from '../../config/CategoryService';

const SubjectsList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  // البحث عن التصنيف المطلوب
  const category = CategoryService.MAIN_CATEGORIES.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            التصنيف غير موجود
          </h1>
          <button 
            onClick={() => navigate('/materials')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للتصنيفات
          </button>
        </div>
      </div>
    );
  }

  const handleSubjectClick = (subject, index) => {
    // توجيه لصفحة الملفات الخاصة بالمادة
    navigate(`/materials/${categoryId}/${encodeURIComponent(subject)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header مع معلومات التصنيف */}
        <div className="text-center mb-12">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-3xl">{category.icon}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {category.subjects?.length || 0} مادة متاحة في هذا التصنيف
          </div>
        </div>

        {/* زر العودة */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/materials')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            ← العودة للتصنيفات
          </button>
        </div>

        {/* قائمة المواد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.subjects?.map((subject, index) => (
            <div
              key={index}
              onClick={() => handleSubjectClick(subject, index)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 cursor-pointer group"
            >
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: category.color }}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {subject}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>اضغط لعرض الملفات</span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <span>استكشف الملفات →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة في حالة عدم وجود مواد */}
        {(!category.subjects || category.subjects.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              لا توجد مواد في هذا التصنيف حاليًا
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              سيتم إضافة المواد قريبًا
            </p>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            📊 تفاصيل التصنيف
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {category.subjects?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">المواد المتاحة</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">أنواع ملفات</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">ملفات متوقعة</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">#{category.order}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">ترتيب التصنيف</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsList;