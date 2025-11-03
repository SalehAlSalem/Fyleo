import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';
import { educationalPurposesService, fileTypesService } from '../../services/appwriteService';
import {
  ModernCard,
  ModernButton,
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';

/**
 * 🎯 Educational Purposes Management Page
 * Admin panel for managing educational purposes and assigning file types
 */
const EducationalPurposesManagement = () => {
  const { t } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  
  const [loading, setLoading] = useState(true);
  const [purposes, setPurposes] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    icon: '📚',
    isLinkAllowed: false
  });
  
  // File type assignment
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [purposesData, fileTypesData] = await Promise.all([
        educationalPurposesService.getAll(),
        fileTypesService.getAll()
      ]);
      
      setPurposes(purposesData);
      setFileTypes(fileTypesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await educationalPurposesService.create(formData);
      setSuccess('Educational purpose created successfully!');
      setShowCreateModal(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating purpose:', err);
      setError('Failed to create educational purpose.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await educationalPurposesService.update(selectedPurpose.$id, formData);
      setSuccess('Educational purpose updated successfully!');
      setShowEditModal(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating purpose:', err);
      setError('Failed to update educational purpose.');
    }
  };

  const handleDelete = async (purposeId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الغرض التعليمي؟')) {
      return;
    }
    
    try {
      setError('');
      await educationalPurposesService.delete(purposeId);
      setSuccess('تم حذف الغرض التعليمي بنجاح');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting purpose:', err);
      setError(err.message || 'حدث خطأ أثناء حذف الغرض التعليمي');
    }
  };

  const openEditModal = (purpose) => {
    setSelectedPurpose(purpose);
    setFormData({
      nameAr: purpose.nameAr,
      nameEn: purpose.nameEn,
      icon: purpose.icon || '📚',
      isLinkAllowed: purpose.isLinkAllowed
    });
    setShowEditModal(true);
  };

  const openAssignModal = (purpose) => {
    setSelectedPurpose(purpose);
    // Pre-select file types that belong to this purpose
    const assignedTypes = fileTypes
      .filter(ft => ft.educationalPurposeId === purpose.$id)
      .map(ft => ft.$id);
    setSelectedFileTypes(assignedTypes);
    setShowAssignModal(true);
  };

  const handleAssignFileTypes = async () => {
    try {
      setError('');
      
      // Update all selected file types to have this purpose
      // We need to fetch each fileType first to preserve all attributes
      const updatePromises = selectedFileTypes.map(async (fileTypeId) => {
        const fileType = fileTypes.find(ft => ft.$id === fileTypeId);
        if (!fileType) {
          throw new Error(`FileType ${fileTypeId} not found`);
        }
        
        // Update with all required fields preserved
        return fileTypesService.update(fileTypeId, {
          nameAr: fileType.nameAr,
          nameEn: fileType.nameEn,
          icon: fileType.icon,
          color: fileType.color,
          allowedFormats: fileType.allowedFormats,
          educationalPurposeId: selectedPurpose.$id
        });
      });
      
      await Promise.all(updatePromises);
      
      setSuccess('File types assigned successfully!');
      setShowAssignModal(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error assigning file types:', err);
      setError(`Failed to assign file types: ${err.message}`);
    }
  };

  const toggleFileType = (fileTypeId) => {
    setSelectedFileTypes(prev =>
      prev.includes(fileTypeId)
        ? prev.filter(id => id !== fileTypeId)
        : [...prev, fileTypeId]
    );
  };

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      icon: '📚',
      isLinkAllowed: false
    });
    setSelectedPurpose(null);
    setSelectedFileTypes([]);
  };

  const getFileTypesByPurpose = (purposeId) => {
    return fileTypes.filter(ft => ft.educationalPurposeId === purposeId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <ModernSkeleton lines={5} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🎯 {t('admin.educationalPurposes.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin.educationalPurposes.description')}
          </p>
        </div>
        <ModernButton onClick={() => setShowCreateModal(true)}>
          ➕ {t('admin.educationalPurposes.addNew')}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && (
        <ModernAlert type="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </ModernAlert>
      )}
      {success && (
        <ModernAlert type="success" className="mb-4" onClose={() => setSuccess('')}>
          {success}
        </ModernAlert>
      )}

      {/* Purposes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purposes.map(purpose => {
          const assignedFileTypes = getFileTypesByPurpose(purpose.$id);
          
          return (
            <ModernCard key={purpose.$id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{purpose.icon || '📚'}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {getLocalizedValue(purpose, 'name')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {purpose.nameEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Link Allowed Badge */}
              <div className="mb-4">
                {purpose.isLinkAllowed ? (
                  <ModernBadge variant="success">
                    🔗 Links Allowed
                  </ModernBadge>
                ) : (
                  <ModernBadge variant="default">
                    📄 Files Only
                  </ModernBadge>
                )}
              </div>

              {/* Assigned File Types */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.educationalPurposes.assignedFileTypes')} ({assignedFileTypes.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedFileTypes.length > 0 ? (
                    assignedFileTypes.map(ft => (
                      <ModernBadge key={ft.$id} variant="info">
                        {ft.icon} {getLocalizedValue(ft, 'name')}
                      </ModernBadge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.content.messages.noContent')}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <ModernButton
                  size="sm"
                  variant="outline"
                  onClick={() => openAssignModal(purpose)}
                  className="flex-1"
                >
                  📎 {t('admin.educationalPurposes.assignTypes')}
                </ModernButton>
                <ModernButton
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(purpose)}
                >
                  ✏️
                </ModernButton>
                <ModernButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(purpose.$id)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️
                </ModernButton>
              </div>
            </ModernCard>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ModernCard className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Create Educational Purpose
            </h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Arabic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="المواد الأساسية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Core Materials"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="📚"
                    maxLength={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLinkAllowed"
                    checked={formData.isLinkAllowed}
                    onChange={(e) => setFormData({ ...formData, isLinkAllowed: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="isLinkAllowed" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Allow Links for this Purpose
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <ModernButton type="submit" className="flex-1">
                  Create
                </ModernButton>
                <ModernButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </ModernButton>
              </div>
            </form>
          </ModernCard>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPurpose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ModernCard className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Edit Educational Purpose
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Arabic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    maxLength={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsLinkAllowed"
                    checked={formData.isLinkAllowed}
                    onChange={(e) => setFormData({ ...formData, isLinkAllowed: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="editIsLinkAllowed" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Allow Links for this Purpose
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <ModernButton type="submit" className="flex-1">
                  Update
                </ModernButton>
                <ModernButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </ModernButton>
              </div>
            </form>
          </ModernCard>
        </div>
      )}

      {/* Assign File Types Modal */}
      {showAssignModal && selectedPurpose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ModernCard className="w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Assign File Types to "{getLocalizedValue(selectedPurpose, 'name')}"
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select which file types belong to this educational purpose
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {fileTypes.map(fileType => (
                <div
                  key={fileType.$id}
                  onClick={() => toggleFileType(fileType.$id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFileTypes.includes(fileType.$id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFileTypes.includes(fileType.$id)}
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                    <span className="text-2xl">{fileType.icon}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {getLocalizedValue(fileType, 'name')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <ModernButton onClick={handleAssignFileTypes} className="flex-1">
                Assign ({selectedFileTypes.length} selected)
              </ModernButton>
              <ModernButton
                variant="outline"
                onClick={() => {
                  setShowAssignModal(false);
                  resetForm();
                }}
              >
                Cancel
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      )}
    </div>
  );
};

export default EducationalPurposesManagement;

