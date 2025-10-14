import React, { useState, useEffect } from 'react';
import { ModernCard, ModernButton, ModernInput, ModernAlert } from '../../components/modern/ModernComponents';
import AdminService from '../../config/AdminService';

const MaterialsManagement = ({ onUpdate }) => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const data = await AdminService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const offset = currentPage * itemsPerPage;
      
      let result;
      if (selectedCategory === 'all') {
        result = await AdminService.getAllMaterials(itemsPerPage, offset);
      } else {
        result = await AdminService.getMaterialsByCategory(selectedCategory, itemsPerPage, offset);
      }
      
      setMaterials(result.documents);
      setTotalMaterials(result.total);
    } catch (error) {
      setError('فشل تحميل المواد');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMaterials();
      return;
    }

    try {
      setLoading(true);
      const results = await AdminService.searchMaterials(searchTerm);
      setMaterials(results);
      setTotalMaterials(results.length);
    } catch (error) {
      setError('فشل البحث');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (materialId, newCategoryId) => {
    try {
      await AdminService.reassignMaterialCategory(materialId, newCategoryId);
      setSuccess('تم نقل المادة بنجاح');
      loadMaterials();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError('فشل نقل المادة');
      console.error(error);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المادة؟')) return;

    try {
      await AdminService.deleteMaterial(materialId);
      setSuccess('تم حذف المادة بنجاح');
      loadMaterials();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError('فشل حذف المادة');
      console.error(error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.$id === categoryId);
    return category ? category.nameAr : 'غير محدد';
  };

  const totalPages = Math.ceil(totalMaterials / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && <ModernAlert variant="error">{error}</ModernAlert>}
      {success && <ModernAlert variant="success">{success}</ModernAlert>}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          إدارة المواد الدراسية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          عرض وإدارة جميع المواد الدراسية المرفوعة
        </p>
      </div>

      {/* Filters and Search */}
      <ModernCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تصفية حسب الفئة
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.$id} value={category.$id}>
                  {category.icon} {category.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البحث في المواد
            </label>
            <div className="flex gap-2">
              <ModernInput
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ابحث عن مادة..."
                className="flex-1"
              />
              <ModernButton
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                🔍 بحث
              </ModernButton>
              {searchTerm && (
                <ModernButton
                  onClick={() => {
                    setSearchTerm('');
                    loadMaterials();
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  ❌
                </ModernButton>
              )}
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Materials Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      ) : materials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <ModernCard key={material.$id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                    {material.title}
                  </h3>

                  {/* Description */}
                  {material.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {material.description}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📂</span>
                      <span>{getCategoryName(material.categoryId)}</span>
                    </div>
                    {material.subject && (
                      <div className="flex items-center gap-2">
                        <span>📚</span>
                        <span>{material.subject}</span>
                      </div>
                    )}
                    {material.fileName && (
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="truncate">{material.fileName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>{material.uploadedBy || 'غير معروف'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⬇️</span>
                      <span>{material.downloadCount || 0} تحميل</span>
                    </div>
                  </div>

                  {/* Category Reassignment */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      نقل إلى فئة أخرى
                    </label>
                    <select
                      value={material.categoryId || ''}
                      onChange={(e) => handleReassign(material.$id, e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category.$id} value={category.$id}>
                          {category.icon} {category.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <ModernButton
                      onClick={() => handleDelete(material.$id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                    >
                      🗑️ حذف
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <ModernButton
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                ← السابق
              </ModernButton>
              
              <span className="text-gray-700 dark:text-gray-300">
                صفحة {currentPage + 1} من {totalPages}
              </span>
              
              <ModernButton
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                التالي →
              </ModernButton>
            </div>
          )}
        </>
      ) : (
        <ModernCard className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'لم يتم العثور على نتائج' : 'لا توجد مواد حالياً'}
          </p>
        </ModernCard>
      )}

      {/* Summary */}
      <ModernCard className="bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            إجمالي المواد: <strong>{totalMaterials}</strong>
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-gray-700 dark:text-gray-300">
              الفئة: <strong>{getCategoryName(selectedCategory)}</strong>
            </span>
          )}
        </div>
      </ModernCard>
    </div>
  );
};

export default MaterialsManagement;
