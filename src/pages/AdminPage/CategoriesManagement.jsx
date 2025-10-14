import React, { useState, useEffect } from 'react';
import { ModernCard, ModernButton, ModernInput, ModernAlert } from '../../components/modern/ModernComponents';
import AdminService from '../../config/AdminService';

const CategoriesManagement = ({ onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    icon: '',
    color: '#3B82F6',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllCategories();
      setCategories(data);
    } catch (error) {
      setError('فشل تحميل الفئات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await AdminService.updateCategory(editingCategory.$id, formData);
        setSuccess('تم تحديث الفئة بنجاح');
      } else {
        await AdminService.createCategory(formData);
        setSuccess('تم إضافة الفئة بنجاح');
      }
      
      resetForm();
      loadCategories();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(editingCategory ? 'فشل تحديث الفئة' : 'فشل إضافة الفئة');
      console.error(error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      descriptionAr: category.descriptionAr || '',
      descriptionEn: category.descriptionEn || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6',
      order: category.order || 0,
      isActive: category.isActive !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      await AdminService.deleteCategory(categoryId);
      setSuccess('تم حذف الفئة بنجاح');
      loadCategories();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError('فشل حذف الفئة');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      icon: '',
      color: '#3B82F6',
      order: 0,
      isActive: true
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && <ModernAlert variant="error">{error}</ModernAlert>}
      {success && <ModernAlert variant="success">{success}</ModernAlert>}

      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إدارة الفئات الأكاديمية
        </h2>
        <ModernButton
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? '❌ إلغاء' : '➕ إضافة فئة جديدة'}
        </ModernButton>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <ModernCard>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم بالعربية *
                </label>
                <ModernInput
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  required
                  placeholder="مثال: متطلبات الجامعة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم بالإنجليزية *
                </label>
                <ModernInput
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                  placeholder="Example: University Requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف بالعربية
                </label>
                <ModernInput
                  type="text"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="وصف الفئة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف بالإنجليزية
                </label>
                <ModernInput
                  type="text"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Category description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأيقونة (Emoji)
                </label>
                <ModernInput
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📚"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللون
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الترتيب
                </label>
                <ModernInput
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    فئة نشطة
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit" className="bg-green-600 hover:bg-green-700">
                {editingCategory ? '💾 حفظ التعديلات' : '➕ إضافة الفئة'}
              </ModernButton>
              <ModernButton
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600"
              >
                إلغاء
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <ModernCard key={category.$id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{category.icon || '📂'}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {category.nameAr}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.nameEn}
                  </p>
                </div>
              </div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>

            {category.descriptionAr && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {category.descriptionAr}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>الترتيب: {category.order}</span>
              <span className={category.isActive ? 'text-green-600' : 'text-red-600'}>
                {category.isActive ? '✅ نشط' : '❌ غير نشط'}
              </span>
            </div>

            <div className="flex gap-2">
              <ModernButton
                onClick={() => handleEdit(category)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                ✏️ تعديل
              </ModernButton>
              <ModernButton
                onClick={() => handleDelete(category.$id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
              >
                🗑️ حذف
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {categories.length === 0 && (
        <ModernCard className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد فئات حالياً. ابدأ بإضافة فئة جديدة!
          </p>
        </ModernCard>
      )}
    </div>
  );
};

export default CategoriesManagement;
