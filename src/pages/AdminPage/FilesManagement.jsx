import React, { useState, useEffect } from 'react';
import { ModernCard, ModernButton, ModernInput, ModernAlert } from '../../components/modern/ModernComponents';
import AdminService from '../../config/AdminService';

const FilesManagement = () => {
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    loadCategories();
    loadFiles();
  }, [currentPage, filterCategory]);

  const loadCategories = async () => {
    try {
      const data = await AdminService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadFiles = async () => {
    try {
      setLoading(true);
      const offset = currentPage * itemsPerPage;
      
      let result;
      if (filterCategory === 'all') {
        result = await AdminService.getAllMaterials(itemsPerPage, offset);
      } else {
        result = await AdminService.getMaterialsByCategory(filterCategory, itemsPerPage, offset);
      }
      
      setFiles(result.documents);
      setTotalFiles(result.total);
    } catch (error) {
      setError('فشل تحميل الملفات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = files.filter(file => {
      const matchesSearch = !searchTerm || 
        file.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUser = !filterUser || 
        file.uploadedBy?.toLowerCase().includes(filterUser.toLowerCase());
      
      return matchesSearch && matchesUser;
    });
    
    return filtered;
  };

  const handleUpdateFileName = async (fileId, newFileName) => {
    try {
      await AdminService.updateMaterial(fileId, { fileName: newFileName });
      setSuccess('تم تحديث اسم الملف بنجاح');
      loadFiles();
    } catch (error) {
      setError('فشل تحديث اسم الملف');
      console.error(error);
    }
  };

  const handleReassignCategory = async (fileId, newCategoryId) => {
    try {
      await AdminService.reassignMaterialCategory(fileId, newCategoryId);
      setSuccess('تم نقل الملف بنجاح');
      loadFiles();
    } catch (error) {
      setError('فشل نقل الملف');
      console.error(error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟ سيتم حذف المادة المرتبطة به أيضاً.')) return;

    try {
      await AdminService.deleteMaterial(fileId);
      setSuccess('تم حذف الملف بنجاح');
      loadFiles();
    } catch (error) {
      setError('فشل حذف الملف');
      console.error(error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.$id === categoryId);
    return category ? category.nameAr : 'غير محدد';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'غير معروف';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  const displayedFiles = handleSearch();
  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && <ModernAlert variant="error">{error}</ModernAlert>}
      {success && <ModernAlert variant="success">{success}</ModernAlert>}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          إدارة الملفات المرفوعة
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          عرض وإدارة جميع الملفات المرفوعة من جميع المستخدمين
        </p>
      </div>

      {/* Filters */}
      <ModernCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الفئة
            </label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
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

          {/* File Name Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الملف
            </label>
            <ModernInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن ملف..."
            />
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المستخدم
            </label>
            <ModernInput
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="اسم المستخدم..."
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <ModernButton
              onClick={() => {
                setSearchTerm('');
                setFilterUser('');
                setFilterCategory('all');
                setCurrentPage(0);
              }}
              className="w-full bg-gray-500 hover:bg-gray-600"
            >
              ❌ مسح الفلاتر
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Files Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      ) : displayedFiles.length > 0 ? (
        <>
          <ModernCard className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">اسم الملف</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">المالك</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">المادة</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">الفئة</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">الحجم</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">التحميلات</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedFiles.map((file) => (
                  <tr key={file.$id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {file.fileName || 'بدون اسم'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {file.uploadedBy || 'غير معروف'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      {file.title || 'غير محدد'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={file.categoryId || ''}
                        onChange={(e) => handleReassignCategory(file.$id, e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {categories.map((category) => (
                          <option key={category.$id} value={category.$id}>
                            {category.nameAr}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {file.downloadCount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newName = prompt('أدخل الاسم الجديد:', file.fileName);
                            if (newName && newName !== file.fileName) {
                              handleUpdateFileName(file.$id, newName);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          title="تعديل الاسم"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.$id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModernCard>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
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
            لم يتم العثور على ملفات
          </p>
        </ModernCard>
      )}

      {/* Summary */}
      <ModernCard className="bg-purple-50 dark:bg-purple-900/20">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            إجمالي الملفات: <strong>{totalFiles}</strong>
          </span>
          <span className="text-gray-700 dark:text-gray-300">
            معروض: <strong>{displayedFiles.length}</strong>
          </span>
        </div>
      </ModernCard>
    </div>
  );
};

export default FilesManagement;
