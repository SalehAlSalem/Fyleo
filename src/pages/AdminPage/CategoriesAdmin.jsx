import React, { useState, useEffect } from 'react';
import { categoriesService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '../../components/modern/ModernComponents';

/**
 * 📁 Categories Management
 */
const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    icon: '📚',
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
      setError('');
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('فشل تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      if (editingCategory) {
        await categoriesService.update(editingCategory.$id, formData);
        setSuccess('تم تحديث التصنيف بنجاح');
      } else {
        await categoriesService.create(formData);
        setSuccess('تم إضافة التصنيف بنجاح');
      }
      
      resetForm();
      loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('فشل حفظ التصنيف');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      descriptionAr: category.descriptionAr || '',
      descriptionEn: category.descriptionEn || '',
      icon: category.icon || '📚',
      color: category.color || '#3B82F6',
      order: category.order || 0,
      isActive: category.isActive !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    
    try {
      setError('');
      await categoriesService.delete(categoryId);
      setSuccess('تم حذف التصنيف بنجاح');
      loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('فشل حذف التصنيف');
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      icon: '📚',
      color: '#3B82F6',
      order: 0,
      isActive: true
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <ModernSkeleton lines={3} />
        <ModernSkeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          إدارة التصنيفات
        </h2>
        <ModernButton onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ إضافة تصنيف'}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      {/* Form */}
      {showForm && (
        <ModernCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="الاسم بالعربية"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
              />
              <ModernInput
                label="الاسم بالإنجليزية"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="الوصف بالعربية"
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              />
              <ModernInput
                label="الوصف بالإنجليزية"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModernInput
                label="الأيقونة (Emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📚"
              />
              <ModernInput
                label="اللون (Hex)"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <ModernInput
                label="الترتيب"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-gray-700 dark:text-gray-300">
                نشط
              </label>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit">
                {editingCategory ? 'تحديث' : 'إضافة'}
              </ModernButton>
              <ModernButton type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <ModernCard key={category.$id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {category.nameAr}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.nameEn}
                  </p>
                </div>
              </div>
              <ModernBadge variant={category.isActive ? 'success' : 'error'}>
                {category.isActive ? 'نشط' : 'غير نشط'}
              </ModernBadge>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {category.descriptionAr || category.descriptionEn}
            </p>

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(category)}
              >
                تعديل
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(category.$id)}
              >
                حذف
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد تصنيفات حالياً
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;
