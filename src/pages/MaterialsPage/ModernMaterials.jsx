import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../config/CategoryService';

const ModernMaterials = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/materials/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            التصنيفات الأكاديمية الجامعية
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            النظام الهرمي المتكامل للمواد الجامعية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CategoryService.MAIN_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 cursor-pointer group"
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernMaterials;
