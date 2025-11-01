import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postsService } from '../../services/appwriteService';
import { ModernButton, ModernAlert } from '../modern/ModernComponents';

/**
 * 📝 Create Post Form Component
 * Allows users to create text or link posts
 */
const CreatePostForm = ({ subjectId, uploaderId, onSuccess }) => {
  const { t } = useTranslation();
  
  const [contentText, setContentText] = useState('');
  const [linkURL, setLinkURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Validate that at least one field is provided
      if (!contentText.trim() && !linkURL.trim()) {
        setError(t('posts.errors.emptyPost') || 'Please enter text content or a link URL');
        setLoading(false);
        return;
      }
      
      // Validate URL format if provided
      if (linkURL.trim()) {
        try {
          new URL(linkURL);
        } catch {
          setError(t('posts.errors.invalidURL') || 'Please enter a valid URL (e.g., https://example.com)');
          setLoading(false);
          return;
        }
      }
      
      // Create post
      const postData = {
        subjectId,
        uploaderId,
        contentText,
        linkURL
      };
      
      await postsService.create(postData);
      
      setSuccess(t('posts.success.created') || 'Post created successfully!');
      
      // Reset form
      setContentText('');
      setLinkURL('');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || t('posts.errors.createFailed') || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📝 {t('posts.createPost') || 'Create Post'}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('posts.formHint') || 'Share text, a link, or both!'}
      </p>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Text Content Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📝 {t('posts.textContent') || 'Text Content'} <span className="text-gray-400">({t('common.optional') || 'optional'})</span>
          </label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder={t('posts.textPlaceholder') || 'Write your post here...'}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {contentText.length} / 10,000 characters
          </p>
        </div>
        
        {/* Link URL Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔗 {t('posts.linkURL') || 'Link URL'} <span className="text-gray-400">({t('common.optional') || 'optional'})</span>
          </label>
          <input
            type="url"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('posts.linkHint') || 'Enter a complete URL including https://'}
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <ModernAlert variant="error" className="mb-4">
            {error}
          </ModernAlert>
        )}
        
        {/* Success Message */}
        {success && (
          <ModernAlert variant="success" className="mb-4">
            {success}
          </ModernAlert>
        )}
        
        {/* Submit Button */}
        <ModernButton
          type="submit"
          loading={loading}
          className="w-full"
        >
          📝 {t('posts.publish') || 'Publish Post'}
        </ModernButton>
      </form>
    </div>
  );
};

export default CreatePostForm;
