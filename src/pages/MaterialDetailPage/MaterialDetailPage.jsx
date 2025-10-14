import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';
import { formatDate } from '../../utils/dateFormatter';
import { 
  hierarchyService 
} from '../../services/hierarchyService';
import {
  materialsService,
  bookmarksService,
  downloadsService,
  storageService
} from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernBadge,
  ModernAlert,
  ModernSkeleton
} from '../../components/modern/ModernComponents';

/**
 * 📄 Material Detail Page
 * Shows detailed information about a material with download and bookmark options
 */
const MaterialDetailPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [material, setMaterial] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadMaterial();
  }, [materialId]);

  const loadMaterial = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load material with hierarchy
      const materialData = await hierarchyService.getMaterialHierarchy(materialId);
      setMaterial(materialData);
      
      // Load breadcrumb
      const breadcrumbData = await hierarchyService.getBreadcrumb(materialId);
      setBreadcrumb(breadcrumbData);
      
      // Check if bookmarked
      if (user) {
        const bookmark = await bookmarksService.getByUserAndFile(user.$id, materialId);
        setIsBookmarked(!!bookmark);
      }
    } catch (err) {
      console.error('Error loading material:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Record download if user is logged in
      if (user) {
        await downloadsService.create(materialId);
      }
      
      // Get download URL and trigger download
      const downloadURL = material.downloadURL;
      window.open(downloadURL, '_blank');
      
      // Update local download count
      setMaterial(prev => ({
        ...prev,
        downloadCount: (prev.downloadCount || 0) + 1
      }));
      
    } catch (err) {
      console.error('Error downloading file:', err);
      setError(t('messages.downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const result = await bookmarksService.toggle(materialId);
      setIsBookmarked(result.bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError(t('common.error'));
    }
  };

  const handleView = () => {
    if (material.viewURL) {
      window.open(material.viewURL, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <ModernCard className="p-6">
            <ModernSkeleton lines={8} />
          </ModernCard>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <ModernAlert type="error">{error || t('materials.noFilesAvailable')}</ModernAlert>
          <ModernButton onClick={() => navigate('/materials')} className="mt-4">
            {t('common.back')}
          </ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => {
                  if (item.type === 'category') {
                    navigate(`/materials/${item.id}`);
                  } else if (item.type === 'subject') {
                    navigate(`/materials/${breadcrumb[0].id}/${item.id}`);
                  }
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {getLocalizedValue(item, 'name') || item.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ModernCard className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {material.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {material.description}
                  </p>
                </div>
                <span className="text-5xl">📄</span>
              </div>

              {/* Tags */}
              {material.tags && material.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {material.tags.map((tag, index) => (
                    <ModernBadge key={index} variant="info">
                      {tag}
                    </ModernBadge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <ModernButton 
                  onClick={handleDownload}
                  loading={downloading}
                  className="flex-1"
                >
                  📥 {t('common.download')}
                </ModernButton>
                
                {material.viewURL && (
                  <ModernButton 
                    onClick={handleView}
                    variant="outline"
                  >
                    👁️ {t('fileInfo.preview')}
                  </ModernButton>
                )}
                
                <ModernButton 
                  onClick={handleBookmark}
                  variant={isBookmarked ? 'primary' : 'outline'}
                >
                  {isBookmarked ? '⭐' : '☆'}
                </ModernButton>
              </div>

              {/* File Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {t('fileInfo.fileInfo')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.fileName')}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{material.fileName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.fileSize')}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {(material.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.fileType')}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{material.mimeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.downloads')}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {material.downloadCount || 0}
                    </p>
                  </div>
                  {material.semester && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.semester')}</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{material.semester}</p>
                    </div>
                  )}
                  {material.year && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('fileInfo.year')}</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{material.year}</p>
                    </div>
                  )}
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Info */}
            {material.category && (
              <ModernCard className="p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {t('fileInfo.category')}
                </h3>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: material.category.color }}
                  >
                    {material.category.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {getLocalizedValue(material.category, 'name')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getLocalizedValue(material.category, 'description')}
                    </p>
                  </div>
                </div>
              </ModernCard>
            )}

            {/* Subject Info */}
            {material.subject && (
              <ModernCard className="p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {t('fileInfo.subject')}
                </h3>
                <p className="font-semibold text-gray-800 dark:text-white mb-2">
                  {getLocalizedValue(material.subject, 'name')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {getLocalizedValue(material.subject, 'description')}
                </p>
                <div className="flex gap-2">
                  <ModernBadge variant="info">
                    {material.subject.creditHours} {t('materials.creditHours')}
                  </ModernBadge>
                  <ModernBadge variant="default">
                    {t('materials.level')} {material.subject.level}
                  </ModernBadge>
                </div>
              </ModernCard>
            )}

            {/* Upload Info */}
            <ModernCard className="p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t('fileInfo.uploadInfo')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('fileInfo.uploadDate')}</span>
                  <span className="text-gray-800 dark:text-white">
                    {formatDate(material.$createdAt, i18n.language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('fileInfo.lastUpdate')}</span>
                  <span className="text-gray-800 dark:text-white">
                    {formatDate(material.$updatedAt, i18n.language)}
                  </span>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailPage;
