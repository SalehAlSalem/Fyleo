import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fileTypesService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';

/**
 * 🗂️ File Types Management Component
 */
const FileTypesManagement = () => {
  const { t } = useTranslation();
  const [fileTypes, setFileTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFileType, setEditingFileType] = useState(null);
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    icon: '📄',
    color: '#3B82F6',
    allowedFormats: '',
    educationalPurposeId: '' // Managed from Educational Purposes page
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const fileTypesData = await fileTypesService.getAll();
      setFileTypes(fileTypesData);
    } catch (err) {
      console.error('Error loading file types:', err);
      setError(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      // Keep allowedFormats as string (database expects string, not array)
      // Add educationalPurposeId (empty string means not assigned yet)
      const dataToSave = {
        ...formData,
        allowedFormats: formData.allowedFormats.trim(),
        educationalPurposeId: formData.educationalPurposeId || '' // Required by database schema
      };
      
      if (editingFileType) {
        await fileTypesService.update(editingFileType.$id, dataToSave);
        setSuccess(t('admin.updateSuccess'));
      } else {
        await fileTypesService.create(dataToSave);
        setSuccess(t('admin.createSuccess'));
      }
      
      resetForm();
      loadData();
    } catch (err) {
      console.error('Error saving file type:', err);
      setError(t('admin.saveError'));
    }
  };

  const handleEdit = (fileType) => {
    setEditingFileType(fileType);
    setFormData({
      nameAr: fileType.nameAr || '',
      nameEn: fileType.nameEn || '',
      icon: fileType.icon || '📄',
      color: fileType.color || '#3B82F6',
      allowedFormats: fileType.allowedFormats || '',
      educationalPurposeId: fileType.educationalPurposeId || '' // Preserve existing assignment
    });
    setShowForm(true);
  };

  const handleDelete = async (fileTypeId) => {
    if (!confirm('هل أنت متأكد من حذف هذا النوع؟')) return;
    
    try {
      setError('');
      await fileTypesService.delete(fileTypeId);
      setSuccess('تم حذف نوع الملف بنجاح');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting file type:', err);
      setError(err.message || 'حدث خطأ أثناء حذف نوع الملف');
    }
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      icon: '📄',
      color: '#3B82F6',
      allowedFormats: '',
      educationalPurposeId: '' // Reset to empty (not assigned)
    });
    setEditingFileType(null);
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
          {t('admin.fileTypes.title')}
        </h2>
        <ModernButton onClick={() => setShowForm(!showForm)}>
          {showForm ? t('admin.fileTypes.actions.cancel') : `+ ${t('admin.fileTypes.addNew')}`}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      {/* Form */}
      {showForm && (
        <ModernCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingFileType ? t('admin.fileTypes.editFileType') : t('admin.fileTypes.addFileType')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label={t('admin.fileTypes.nameAr')}
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder={t('admin.fileTypes.namePlaceholderAr')}
                required
              />
              <ModernInput
                label={t('admin.fileTypes.nameEn')}
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder={t('admin.fileTypes.namePlaceholderEn')}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label={t('admin.fileTypes.icon')}
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder={t('admin.fileTypes.iconPlaceholder')}
              />
              <ModernInput
                label={t('admin.fileTypes.color')}
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div>
              <ModernInput
                label={t('admin.fileTypes.allowedExtensions')}
                value={formData.allowedFormats}
                onChange={(e) => setFormData({ ...formData, allowedFormats: e.target.value })}
                placeholder={t('admin.fileTypes.extensionsPlaceholder')}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('admin.fileTypes.extensionsPlaceholder')}</p>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit">
                {editingFileType ? t('admin.fileTypes.actions.save') : t('admin.fileTypes.actions.add')}
              </ModernButton>
              <ModernButton type="button" variant="outline" onClick={resetForm}>
                {t('admin.fileTypes.actions.cancel')}
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      )}

      {/* File Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fileTypes.map(fileType => (
          <ModernCard key={fileType.$id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: fileType.color }}
                >
                  {fileType.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {fileType.nameAr}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fileType.nameEn}
                  </p>
                </div>
              </div>
            </div>
            
            {fileType.allowedFormats && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('admin.fileTypes.allowedExtensionsLabel')}</p>
                <div className="flex gap-1 flex-wrap">
                  {(Array.isArray(fileType.allowedFormats) 
                    ? fileType.allowedFormats 
                    : fileType.allowedFormats.split(',').map(f => f.trim())
                  ).map((format, index) => (
                    <ModernBadge key={index} variant="info" size="sm">
                      .{format}
                    </ModernBadge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(fileType)}
              >
                {t('admin.fileTypes.actions.edit')}
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(fileType.$id)}
              >
                {t('admin.fileTypes.actions.delete')}
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {fileTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.content.messages.noContent')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileTypesManagement;

