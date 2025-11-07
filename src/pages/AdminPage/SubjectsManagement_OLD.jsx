import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';
import { subjectsService, categoriesService, subjectCategoriesService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';

/**
 * 📚 Subjects Management Component
 */
const SubjectsManagement = () => {
  const { t } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]); // NEW: For multi-select
  const [subjectCategoryLinks, setSubjectCategoryLinks] = useState({}); // NEW: Cache links
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    creditHours: 3,
    level: 1,
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
      
      // Load all subject-category links for filtering
      await loadAllSubjectCategoryLinks(subjectsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load all subject-category links
  const loadAllSubjectCategoryLinks = async (subjectsData) => {
    try {
      const linksMap = {};
      await Promise.all(
        subjectsData.map(async (subject) => {
          const links = await subjectCategoriesService.getBySubject(subject.$id);
          linksMap[subject.$id] = links.map(link => link.categoryId);
        })
      );
      setSubjectCategoryLinks(linksMap);
    } catch (err) {
      console.error('Error loading subject-category links:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: At least one category must be selected
    if (selectedCategories.length === 0) {
      setError(t('admin.subjects.selectAtLeastOneCategory') || 'يرجى اختيار فئة واحدة على الأقل');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      if (editingSubject) {
        // Update subject
        await subjectsService.update(editingSubject.$id, formData);
        
        // Update category links: compare old vs new
        const existingLinks = await subjectCategoriesService.getBySubject(editingSubject.$id);
        const existingCategoryIds = existingLinks.map(link => link.categoryId);
        const newCategoryIds = selectedCategories.map(cat => cat.$id);
        
        // Delete removed categories
        const toDelete = existingLinks.filter(link => !newCategoryIds.includes(link.categoryId));
        await Promise.all(toDelete.map(link => subjectCategoriesService.remove(link.$id)));
        
        // Add new categories
        const toAdd = newCategoryIds.filter(catId => !existingCategoryIds.includes(catId));
        await Promise.all(toAdd.map(catId => subjectCategoriesService.create(editingSubject.$id, catId)));
        
        setSuccess(t('admin.updateSuccess'));
      } else {
        // Create subject
        const newSubject = await subjectsService.create(formData);
        
        // Create category links
        await Promise.all(
          selectedCategories.map(cat => 
            subjectCategoriesService.create(newSubject.$id, cat.$id)
          )
        );
        
        setSuccess(t('admin.createSuccess'));
      }
      
      resetForm();
      loadData();
    } catch (err) {
      console.error('Error saving subject:', err);
      setError(t('admin.saveError'));
    }
  };

  const handleEdit = async (subject) => {
    setEditingSubject(subject);
    setFormData({
      nameAr: subject.nameAr,
      nameEn: subject.nameEn,
      descriptionAr: subject.descriptionAr || '',
      descriptionEn: subject.descriptionEn || '',
      creditHours: subject.creditHours || 3,
      level: subject.level || 1,
      isActive: subject.isActive !== false
    });
    
    // Load subject's categories
    try {
      const links = await subjectCategoriesService.getBySubject(subject.$id);
      const categoryIds = links.map(link => link.categoryId);
      const loadedCategories = categories.filter(cat => categoryIds.includes(cat.$id));
      setSelectedCategories(loadedCategories);
    } catch (err) {
      console.error('Error loading subject categories:', err);
      setSelectedCategories([]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (subjectId) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟ سيتم حذف جميع الروابط المرتبطة بها.')) return;
    
    try {
      setError('');
      
      // Delete all category links first
      await subjectCategoriesService.removeAllBySubject(subjectId);
      
      // Delete subject
      await subjectsService.delete(subjectId);
      
      setSuccess('تم حذف المادة الدراسية وجميع روابطها بنجاح');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError(err.message || 'حدث خطأ أثناء حذف المادة الدراسية');
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      creditHours: 3,
      level: 1,
      isActive: true
    });
    setSelectedCategories([]); // Clear selected categories
    setEditingSubject(null);
    setShowForm(false);
  };

  // NEW: Add category to selection
  const handleAddCategory = (category) => {
    if (!selectedCategories.find(cat => cat.$id === category.$id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // NEW: Remove category from selection
  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(cat => cat.$id !== categoryId));
  };

  const getCategoryNames = (subjectId) => {
    const categoryIds = subjectCategoryLinks[subjectId] || [];
    if (categoryIds.length === 0) return t('admin.subjects.uncategorized');
    
    const categoryNames = categoryIds
      .map(catId => {
        const cat = categories.find(c => c.$id === catId);
        return cat ? getLocalizedValue(cat, 'name') : null;
      })
      .filter(Boolean);
    
    return categoryNames.length > 0 ? categoryNames.join(', ') : t('admin.subjects.uncategorized');
  };

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : selectedCategory === 'uncategorized'
    ? subjects.filter(s => {
        const categoryIds = subjectCategoryLinks[s.$id] || [];
        return categoryIds.length === 0;
      })
    : subjects.filter(s => {
        const categoryIds = subjectCategoryLinks[s.$id] || [];
        return categoryIds.includes(selectedCategory);
      });

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
          {t('admin.subjects.title')}
        </h2>
        <ModernButton onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            resetForm(); // Clear form before showing
            setShowForm(true);
          }
        }}>
          {showForm ? t('admin.subjects.actions.cancel') : `+ ${t('admin.subjects.addNew')}`}
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
          {t('admin.subjects.all')} ({subjects.length})
        </ModernButton>
        <ModernButton
          variant={selectedCategory === 'uncategorized' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('uncategorized')}
        >
          🔍 {t('admin.subjects.uncategorized')} ({subjects.filter(s => (subjectCategoryLinks[s.$id] || []).length === 0).length})
        </ModernButton>
        {categories.map(category => {
          const count = subjects.filter(s => (subjectCategoryLinks[s.$id] || []).includes(category.$id)).length;
          return (
            <ModernButton
              key={category.$id}
              variant={selectedCategory === category.$id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.$id)}
            >
              {category.icon} {getLocalizedValue(category, 'name')} ({count})
            </ModernButton>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <ModernCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingSubject ? t('admin.subjects.editSubject') : t('admin.subjects.addSubject')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label={t('admin.subjects.nameAr')}
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder={t('admin.subjects.namePlaceholderAr')}
                required
              />
              <ModernInput
                label={t('admin.subjects.nameEn')}
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder={t('admin.subjects.namePlaceholderEn')}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group-modern">
                <label className="form-label-modern">{t('admin.subjects.descriptionAr')}</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="input-modern"
                  placeholder={t('admin.subjects.descriptionPlaceholderAr')}
                  rows="3"
                />
              </div>
              <div className="form-group-modern">
                <label className="form-label-modern">{t('admin.subjects.descriptionEn')}</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="input-modern"
                  placeholder={t('admin.subjects.descriptionPlaceholderEn')}
                  rows="3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* NEW: Multi-select Categories */}
              <div className="form-group-modern md:col-span-2">
                <label className="form-label-modern">
                  {t('admin.subjects.categories')} * 
                  <span className="text-xs text-gray-500 mr-2">(يمكن اختيار أكثر من فئة)</span>
                </label>
                
                {/* Selected Categories - Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map(cat => (
                    <span
                      key={cat.$id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 
                        text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {cat.icon} {getLocalizedValue(cat, 'name')}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat.$id)}
                        className="hover:text-red-600 dark:hover:text-red-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedCategories.length === 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.subjects.noCategoriesSelected') || 'لم يتم اختيار أي فئة'}
                    </span>
                  )}
                </div>
                
                {/* Add Category Dropdown */}
                <select
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    if (categoryId) {
                      const category = categories.find(c => c.$id === categoryId);
                      if (category) handleAddCategory(category);
                      e.target.value = ''; // Reset dropdown
                    }
                  }}
                  className="input-modern"
                >
                  <option value="">{t('admin.subjects.addCategory') || '+ إضافة فئة'}</option>
                  {categories
                    .filter(cat => !selectedCategories.find(selected => selected.$id === cat.$id))
                    .map(category => (
                      <option key={category.$id} value={category.$id}>
                        {category.icon} {getLocalizedValue(category, 'name')}
                      </option>
                    ))
                  }
                </select>
              </div>

              <ModernInput
                label={t('admin.subjects.creditHours')}
                type="number"
                value={formData.creditHours}
                onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                min="1"
                max="6"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.subjects.level')} *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">{t('admin.subjects.firstLevel')}</option>
                  <option value="2">{t('admin.subjects.secondLevel')}</option>
                  <option value="3">{t('admin.subjects.thirdLevel')}</option>
                  <option value="4">{t('admin.subjects.fourthLevel')}</option>
                  <option value="5">{t('admin.subjects.fifthLevel')}</option>
                  <option value="6">{t('admin.subjects.level1')} 6</option>
                  <option value="7">{t('admin.subjects.level1')} 7</option>
                  <option value="8">{t('admin.subjects.level1')} 8</option>
                </select>
              </div>
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
                {t('admin.subjects.active')}
              </label>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit">
                {editingSubject ? t('admin.subjects.actions.save') : t('admin.subjects.actions.add')}
              </ModernButton>
              <ModernButton type="button" variant="outline" onClick={resetForm}>
                {t('admin.subjects.actions.cancel')}
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
              {/* Display all categories */}
              {(subjectCategoryLinks[subject.$id] || []).length > 0 ? (
                (subjectCategoryLinks[subject.$id] || []).map(catId => {
                  const cat = categories.find(c => c.$id === catId);
                  return cat ? (
                    <ModernBadge key={catId} variant="info">
                      {cat.icon} {getLocalizedValue(cat, 'name')}
                    </ModernBadge>
                  ) : null;
                })
              ) : (
                <ModernBadge variant="warning">
                  {t('admin.subjects.uncategorized')}
                </ModernBadge>
              )}
              <ModernBadge variant="default">
                {subject.creditHours} {t('admin.subjects.hour')}
              </ModernBadge>
              <ModernBadge variant="default">
                {t('admin.subjects.level')} {subject.level}
              </ModernBadge>
            </div>

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(subject)}
              >
                {t('admin.subjects.actions.edit')}
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(subject.$id)}
              >
                {t('admin.subjects.actions.delete')}
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.content.messages.noContent')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;

