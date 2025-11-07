import React, { useState, useEffect, useRef } from 'react';
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
 * 📚 Subjects Management Component (Updated with Modal & Level Buttons)
 */
const SubjectsManagement = () => {
  const { t, i18n } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false); // Changed from showForm
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subjectCategoryLinks, setSubjectCategoryLinks] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const dropdownRef = useRef(null);
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      await loadAllSubjectCategoryLinks(subjectsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

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
    
    if (selectedCategories.length === 0) {
      setError(t('admin.subjects.selectAtLeastOneCategory'));
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      if (editingSubject) {
        await subjectsService.update(editingSubject.$id, formData);
        const existingLinks = await subjectCategoriesService.getBySubject(editingSubject.$id);
        const existingCategoryIds = existingLinks.map(link => link.categoryId);
        const newCategoryIds = selectedCategories.map(cat => cat.$id);
        
        const toDelete = existingLinks.filter(link => !newCategoryIds.includes(link.categoryId));
        await Promise.all(toDelete.map(link => subjectCategoriesService.remove(link.$id)));
        
        const toAdd = newCategoryIds.filter(catId => !existingCategoryIds.includes(catId));
        await Promise.all(toAdd.map(catId => subjectCategoriesService.create(editingSubject.$id, catId)));
        
        setSuccess(t('admin.updateSuccess'));
      } else {
        const newSubject = await subjectsService.create(formData);
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
    
    try {
      const links = await subjectCategoriesService.getBySubject(subject.$id);
      const categoryIds = links.map(link => link.categoryId);
      const loadedCategories = categories.filter(cat => categoryIds.includes(cat.$id));
      setSelectedCategories(loadedCategories);
    } catch (err) {
      console.error('Error loading subject categories:', err);
      setSelectedCategories([]);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (!confirm(t('admin.subjects.confirmDelete') || 'هل أنت متأكد من حذف هذه المادة؟')) return;
    
    try {
      setError('');
      await subjectCategoriesService.removeAllBySubject(subjectId);
      await subjectsService.delete(subjectId);
      setSuccess(t('admin.deleteSuccess'));
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError(err.message || t('admin.deleteError'));
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
    setSelectedCategories([]);
    setEditingSubject(null);
    setShowModal(false);
    setShowCategoryDropdown(false);
  };

  const handleAddCategory = (category) => {
    if (!selectedCategories.find(cat => cat.$id === category.$id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(cat => cat.$id !== categoryId));
  };

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : selectedCategory === 'uncategorized'
    ? subjects.filter(s => (subjectCategoryLinks[s.$id] || []).length === 0)
    : subjects.filter(s => (subjectCategoryLinks[s.$id] || []).includes(selectedCategory));

  // Search filter
  const searchedSubjects = searchQuery.trim() === ''
    ? filteredSubjects
    : filteredSubjects.filter(subject => {
        const query = searchQuery.toLowerCase();
        const nameAr = (subject.nameAr || '').toLowerCase();
        const nameEn = (subject.nameEn || '').toLowerCase();
        const descAr = (subject.descriptionAr || '').toLowerCase();
        const descEn = (subject.descriptionEn || '').toLowerCase();
        return nameAr.includes(query) || nameEn.includes(query) || 
               descAr.includes(query) || descEn.includes(query);
      });

  const isRTL = i18n.language === 'ar';

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
          resetForm();
          setShowModal(true);
        }}>
          + {t('admin.subjects.addNew')}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      {/* Search Bar */}
      <div className="max-w-2xl">
        <ModernInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isRTL ? '🔍 ابحث عن مادة (الاسم، الوصف...)' : '🔍 Search for a subject (name, description...)'}
          className="w-full"
        />
        {searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isRTL ? `تم العثور على ${searchedSubjects.length} مادة` : `Found ${searchedSubjects.length} subjects`}
          </p>
        )}
      </div>

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

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingSubject ? t('admin.subjects.editSubject') : t('admin.subjects.addSubject')}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Fields */}
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
              
              {/* Description Fields */}
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

              {/* Categories Multi-Select with Checkboxes */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  {t('admin.subjects.categories')} * 
                  <span className="text-xs text-gray-500 dark:text-gray-400 mx-2">
                    ({t('admin.subjects.multiSelectHint')})
                  </span>
                </label>
                
                {/* Selected Categories Tags */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(cat => (
                      <span
                        key={cat.$id}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 
                          text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium shadow-sm"
                      >
                        <span>{cat.icon} {getLocalizedValue(cat, 'name')}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat.$id)}
                          className="hover:text-red-600 dark:hover:text-red-400 font-bold text-lg"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400 py-2">
                      {t('admin.subjects.noCategoriesSelected')}
                    </span>
                  )}
                </div>
                
                {/* Dropdown with Checkboxes (stays open) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right
                      hover:border-blue-500 dark:hover:border-blue-400 transition-colors
                      flex items-center justify-between"
                  >
                    <span>{t('admin.subjects.selectCategories')}</span>
                    <span className={`transform transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map(category => {
                          const isSelected = selectedCategories.find(cat => cat.$id === category.$id);
                          return (
                            <label
                              key={category.$id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleAddCategory(category);
                                  } else {
                                    handleRemoveCategory(category.$id);
                                  }
                                }}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-900 dark:text-white flex-1">
                                {category.icon} {getLocalizedValue(category, 'name')}
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                          {t('admin.subjects.noCategoriesAvailable')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Level as Small Square Buttons (1-8) */}
              <div className="form-group-modern">
                <label className="form-label-modern mb-3">
                  {t('admin.subjects.level')} *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, level })}
                      className={`
                        w-10 h-10 flex items-center justify-center text-sm font-bold rounded-md
                        transition-all duration-200 transform hover:scale-110
                        ${formData.level === level 
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 border-2 border-indigo-700 ring-2 ring-indigo-300 dark:ring-indigo-700' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'
                        }
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t(`admin.subjects.${
                    formData.level === 1 ? 'firstLevel' :
                    formData.level === 2 ? 'secondLevel' :
                    formData.level === 3 ? 'thirdLevel' :
                    formData.level === 4 ? 'fourthLevel' :
                    formData.level === 5 ? 'fifthLevel' :
                    formData.level === 6 ? 'sixthLevel' :
                    formData.level === 7 ? 'seventhLevel' :
                    'eighthLevel'
                  }`)}
                </p>
              </div>

              {/* Credit Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernInput
                  label={t('admin.subjects.creditHours')}
                  type="number"
                  value={formData.creditHours}
                  onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                  min="1"
                  max="6"
                />
                
                {/* Active Checkbox */}
                <div className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('admin.subjects.active')}
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ModernButton type="submit" className="flex-1">
                  {editingSubject ? t('admin.subjects.actions.save') : t('admin.subjects.actions.add')}
                </ModernButton>
                <ModernButton type="button" variant="outline" onClick={resetForm} className="flex-1">
                  {t('admin.subjects.actions.cancel')}
                </ModernButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchedSubjects.map(subject => (
          <ModernCard key={subject.$id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {getLocalizedValue(subject, 'name')}
                </h3>
                <ModernBadge variant={subject.isActive ? 'success' : 'error'}>
                  {subject.isActive ? '✓ نشط' : '✗ غير نشط'}
                </ModernBadge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {i18n.language === 'ar' ? subject.nameEn : subject.nameAr}
              </p>
            </div>
            
            {(subject.descriptionAr || subject.descriptionEn) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {getLocalizedValue(subject, 'description')}
              </p>
            )}

            <div className="flex gap-2 mb-4 flex-wrap">
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
                  🔍 {t('admin.subjects.uncategorized')}
                </ModernBadge>
              )}
              <ModernBadge variant="default">
                ⏱ {subject.creditHours} {t('admin.subjects.hour')}
              </ModernBadge>
              <ModernBadge variant="default">
                📊 {t('admin.subjects.level')} {subject.level}
              </ModernBadge>
            </div>

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(subject)}
                className="flex-1"
              >
                ✏️ {t('admin.subjects.actions.edit')}
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(subject.$id)}
                className="flex-1"
              >
                🗑️ {t('admin.subjects.actions.delete')}
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {searchedSubjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery 
              ? (isRTL ? 'لا توجد مواد مطابقة للبحث' : 'No subjects match your search')
              : selectedCategory === 'all' 
                ? t('admin.subjects.noSubjects') || 'لا توجد مواد دراسية'
                : t('admin.subjects.noSubjectsInCategory') || 'لا توجد مواد في هذا التصنيف'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;
