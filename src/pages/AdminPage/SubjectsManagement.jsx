import React, { useState, useEffect } from 'react';
import { subjectsService, categoriesService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '../../components/modern/ModernComponents';

/**
 * 📚 Subjects Management Component
 */
const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    categoryId: '',
    creditHours: 3,
    level: 1,
    prerequisite: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [subjectsData, categoriesData] = await Promise.all([
        subjectsService.getAll(),
        categoriesService.getAll()
      ]);
      setSubjects(subjectsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      if (editingSubject) {
        await subjectsService.update(editingSubject.$id, formData);
        setSuccess('تم تحديث المادة بنجاح');
      } else {
        await subjectsService.create(formData);
        setSuccess('تم إضافة المادة بنجاح');
      }
      
      resetForm();
      loadData();
    } catch (err) {
      console.error('Error saving subject:', err);
      setError('فشل حفظ المادة');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      nameAr: subject.nameAr,
      nameEn: subject.nameEn,
      descriptionAr: subject.descriptionAr || '',
      descriptionEn: subject.descriptionEn || '',
      categoryId: subject.categoryId,
      creditHours: subject.creditHours || 3,
      level: subject.level || 1,
      prerequisite: subject.prerequisite || '',
      isActive: subject.isActive !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (subjectId) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;
    
    try {
      setError('');
      await subjectsService.delete(subjectId);
      setSuccess('تم حذف المادة بنجاح');
      loadData();
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError('فشل حذف المادة');
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      categoryId: '',
      creditHours: 3,
      level: 1,
      prerequisite: '',
      isActive: true
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.$id === categoryId);
    return category ? category.nameAr : 'غير محدد';
  };

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : subjects.filter(s => s.categoryId === selectedCategory);

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
          إدارة المواد الدراسية
        </h2>
        <ModernButton onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ إضافة مادة'}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <ModernButton
          variant={selectedCategory === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          الكل ({subjects.length})
        </ModernButton>
        {categories.map(category => (
          <ModernButton
            key={category.$id}
            variant={selectedCategory === category.$id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.$id)}
          >
            {category.icon} {category.nameAr}
          </ModernButton>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <ModernCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingSubject ? 'تعديل المادة' : 'إضافة مادة جديدة'}
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
              <div className="form-group-modern">
                <label className="form-label-modern">الوصف بالعربية</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="input-modern"
                  rows="3"
                />
              </div>
              <div className="form-group-modern">
                <label className="form-label-modern">الوصف بالإنجليزية</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="input-modern"
                  rows="3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group-modern">
                <label className="form-label-modern">التصنيف</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="input-modern"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map(category => (
                    <option key={category.$id} value={category.$id}>
                      {category.icon} {category.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <ModernInput
                label="الساعات المعتمدة"
                type="number"
                value={formData.creditHours}
                onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                min="1"
                max="6"
              />
              <ModernInput
                label="المستوى"
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                min="1"
                max="8"
              />
            </div>

            <ModernInput
              label="المتطلب السابق (اختياري)"
              value={formData.prerequisite}
              onChange={(e) => setFormData({ ...formData, prerequisite: e.target.value })}
              placeholder="مثال: CS101"
            />

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
                {editingSubject ? 'تحديث' : 'إضافة'}
              </ModernButton>
              <ModernButton type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      )}

      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map(subject => (
          <ModernCard key={subject.$id} className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {subject.nameAr}
                </h3>
                <ModernBadge variant={subject.isActive ? 'success' : 'error'}>
                  {subject.isActive ? 'نشط' : 'غير نشط'}
                </ModernBadge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subject.nameEn}
              </p>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {subject.descriptionAr || subject.descriptionEn}
            </p>

            <div className="flex gap-2 mb-4 flex-wrap">
              <ModernBadge variant="info">
                {getCategoryName(subject.categoryId)}
              </ModernBadge>
              <ModernBadge variant="default">
                {subject.creditHours} ساعة
              </ModernBadge>
              <ModernBadge variant="default">
                المستوى {subject.level}
              </ModernBadge>
            </div>

            {subject.prerequisite && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                المتطلب: {subject.prerequisite}
              </p>
            )}

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(subject)}
              >
                تعديل
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(subject.$id)}
              >
                حذف
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد مواد دراسية حالياً
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;
