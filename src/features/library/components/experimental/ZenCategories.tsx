import { motion } from 'framer-motion';
import type { Category } from '../../../../types/database';

interface ZenCategoriesProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  nameKey: 'nameEn' | 'nameAr';
  descriptionKey: 'descriptionEn' | 'descriptionAr';
}

/**
 * Zen Categories - Level 1
 * "Focus is about saying NO to the good ideas"
 * 
 * One category. One action. Pure focus.
 */
export default function ZenCategories({
  categories,
  onCategoryClick,
  nameKey,
  descriptionKey,
}: ZenCategoriesProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title - massive, centered */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-bold text-center mb-20 text-gray-900 dark:text-white"
        >
          Choose Your Path
        </motion.h1>

        {/* Categories - large, breathing space */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.$id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ scale: 1.02, x: 20 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryClick(category)}
              className="w-full group"
            >
              <div className="bg-white dark:bg-gray-800 border-l-8 border-blue-500 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl rounded-r-3xl overflow-hidden">
                <div className="p-12 flex items-center gap-8">
                  {/* Icon - huge, eye-catching */}
                  <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon || '📚'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category[nameKey]}
                    </h2>
                    {category[descriptionKey] && (
                      <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        {category[descriptionKey]}
                      </p>
                    )}
                  </div>

                  {/* Arrow - animated */}
                  <div className="text-5xl text-gray-400 group-hover:text-blue-600 group-hover:translate-x-4 transition-all duration-300">
                    →
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
