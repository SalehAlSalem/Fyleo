import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ModernCard, ModernButton, ModernInput, ModernAlert } from '@shared/ui/modern/ModernComponents';
import AdminService from '../../config/AdminService';

const CategoriesManagement = ({ onUpdate }) => {
  const { t } = useTranslation();
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
      setError(t('admin.content.messages.loadError'));
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
        setSuccess(t('admin.common.messages.success'));
      } else {
        await AdminService.createCategory(formData);
        setSuccess(t('admin.common.messages.success'));
      }
      
      resetForm();
      loadCategories();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(t('admin.common.messages.error'));
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
    if (!window.confirm(t('admin.content.confirmations.delete'))) return;

    try {
      await AdminService.deleteCategory(categoryId);
      setSuccess(t('admin.common.messages.success'));
      loadCategories();
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      // Display the specific error message from the service
      setError(error.message || t('admin.content.messages.deleteError'));
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
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('admin.common.messages.loading')}</p>
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
          {t('admin.categories.title')}
        </h2>
        <ModernButton
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? `❌ ${t('admin.categories.actions.cancel')}` : `➕ ${t('admin.categories.addNew')}`}
        </ModernButton>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <ModernCard>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingCategory ? t('admin.categories.editCategory') : t('admin.categories.addCategory')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.nameAr')} *
                </label>
                <ModernInput
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  required
                  placeholder={t('admin.categories.namePlaceholderAr')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.nameEn')} *
                </label>
                <ModernInput
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                  placeholder={t('admin.categories.namePlaceholderEn')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.descriptionAr')}
                </label>
                <ModernInput
                  type="text"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder={t('admin.categories.descriptionPlaceholderAr')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.descriptionEn')}
                </label>
                <ModernInput
                  type="text"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder={t('admin.categories.descriptionPlaceholderEn')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.icon')}
                </label>
                <ModernInput
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder={t('admin.categories.iconPlaceholder')}
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.categories.color')}
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
                  {t('admin.categories.order')}
                </label>
                <ModernInput
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder={t('admin.categories.orderPlaceholder')}
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
                    {t('admin.categories.categoryActive')}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit" className="bg-green-600 hover:bg-green-700">
                {editingCategory ? `💾 ${t('admin.categories.actions.save')}` : `➕ ${t('admin.categories.actions.add')}`}
              </ModernButton>
              <ModernButton
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600"
              >
                {t('admin.categories.actions.cancel')}
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
              <span>{t('admin.categories.order')}: {category.order}</span>
              <span className={category.isActive ? 'text-green-600' : 'text-red-600'}>
                {category.isActive ? `✅ ${t('admin.categories.active')}` : `❌ ${t('admin.categories.active')}`}
              </span>
            </div>

            <div className="flex gap-2">
              <ModernButton
                onClick={() => handleEdit(category)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                ✏️ {t('admin.categories.actions.edit')}
              </ModernButton>
              <ModernButton
                onClick={() => handleDelete(category.$id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
              >
                🗑️ {t('admin.categories.actions.delete')}
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {categories.length === 0 && (
        <ModernCard className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin.content.messages.noContent')}
          </p>
        </ModernCard>
      )}
    </div>
  );
};

export default CategoriesManagement;

