import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { hierarchyService } from '../../services/hierarchyService';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';
import CreatePostForm from '../../components/forms/CreatePostForm';
import { 
  ModernCard, 
  ModernButton, 
  ModernSkeleton,
  ModernAlert,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';

/**
 * 📝 Create Post Page
 * Allows users to create text or link posts for a subject
 */
const CreatePostPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const { user } = useAuth();
  const { t } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!subjectId) {
      setError('Subject ID is required');
      setLoading(false);
      return;
    }
    
    loadSubject();
  }, [user, subjectId]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      setError('');
      
      const subjectData = await hierarchyService.getSubjectHierarchy(subjectId);
      setSubject(subjectData);
      setCategory(subjectData.category);
    } catch (err) {
      console.error('Error loading subject:', err);
      setError('Failed to load subject information');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    // Navigate back to materials page after successful post creation
    navigate(`/materials/${category.$id}/${subjectId}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <ModernAlert variant="error" className="mb-6">
            {error}
          </ModernAlert>
          <ModernButton onClick={() => navigate(-1)}>
            ← {t('common.back')}
          </ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <ModernButton 
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6"
        >
          ← {t('common.back')}
        </ModernButton>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            📝 {t('posts.createPost') || 'Create Post'}
          </h1>
          {subject && (
            <>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                {t('posts.forSubject') || 'For Subject'}: <strong>{getLocalizedValue(subject, 'name')}</strong>
              </p>
              <div className="flex items-center justify-center gap-2">
                <ModernBadge variant="info">
                  {getLocalizedValue(category, 'name')}
                </ModernBadge>
                <ModernBadge variant="default">
                  {t('materials.level')} {subject.level}
                </ModernBadge>
              </div>
            </>
          )}
        </div>

        {/* Create Post Form */}
        {subject && user && (
          <CreatePostForm
            subjectId={subjectId}
            uploaderId={user.$id}
            onSuccess={handleSuccess}
          />
        )}

        {/* Info Card */}
        <ModernCard className="mt-6 p-6 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            💡 {t('posts.tips') || 'Tips'}
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• <strong>{t('posts.textPost') || 'Text Post'}:</strong> {t('posts.textTip') || 'Share notes, explanations, or announcements'}</li>
            <li>• <strong>{t('posts.linkPost') || 'Link Post'}:</strong> {t('posts.linkTip') || 'Share useful external resources, videos, or articles'}</li>
            <li>• {t('posts.guideline') || 'Posts will be visible to all students in this subject'}</li>
          </ul>
        </ModernCard>
      </div>
    </div>
  );
};

export default CreatePostPage;

