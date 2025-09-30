import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { databaseService } from '../../services/databaseService';
import { storage, STORAGE_BUCKET_ID } from '../../config/appwrite';
import { ID } from 'appwrite';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert,
  useTranslation 
} from '../modern/ModernComponents';

const AppwriteUploadForm = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: '',
    subject: '',
    tags: []
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // Categories from config
  const categories = [
    'programming', 'data-structures', 'algorithms', 'web-development',
    'mobile-development', 'databases', 'networking', 'cybersecurity',
    'ai-ml', 'graphics', 'testing', 'documentation'
  ];

  const subjects = [
    'Computer Science', 'Software Engineering', 'Information Technology',
    'Data Science', 'Cybersecurity', 'Web Development', 'Mobile Development',
    'Database Management', 'Network Administration', 'AI & Machine Learning'
  ];

  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setError(`نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`);
        return;
      }
      
      if (file.size > maxFileSize) {
        setError(`حجم الملف كبير جداً. الحد الأقصى ${formatFileSize(maxFileSize)}`);
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Auto-fill title if empty
      if (!uploadData.title) {
        setUploadData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setUploadData(prev => ({
      ...prev,
      tags
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadToAppwrite = async () => {
    if (!selectedFile || !user) {
      throw new Error('الملف أو بيانات المستخدم غير متوفرة');
    }

    setUploadStatus('🚀 بدء رفع الملف...');
    
    try {
      // Upload file to Appwrite Storage
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        fileId,
        selectedFile,
        undefined,
        (progress) => {
          const percentage = Math.round((progress.bytesUploaded / progress.bytesTotal) * 100);
          setUploadProgress(percentage);
          setUploadStatus(`📤 رفع الملف: ${percentage}%`);
        }
      );

      setUploadStatus('💾 حفظ البيانات...');

      // Save metadata to Appwrite Database
      const materialData = {
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        subject: uploadData.subject,
        fileId: uploadedFile.$id,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        tags: uploadData.tags,
        downloadUrl: storage.getFileDownload(STORAGE_BUCKET_ID, uploadedFile.$id),
        viewUrl: storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id)
      };

      const savedMaterial = await databaseService.createMaterial(materialData);
      
      setUploadStatus('✅ تم الرفع بنجاح!');
      
      return {
        success: true,
        material: savedMaterial,
        file: uploadedFile
      };
      
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`فشل الرفع: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('يرجى اختيار ملف للرفع');
      return;
    }
    
    if (!uploadData.title || !uploadData.category) {
      setError('يرجى ملء العنوان والفئة على الأقل');
      return;
    }

    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const result = await uploadToAppwrite();
      
      if (result.success) {
        // Reset form
        setUploadData({
          title: '',
          description: '',
          category: '',
          subject: '',
          tags: []
        });
        setSelectedFile(null);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadStatus('');
          setUploadProgress(0);
        }, 3000);
      }
      
    } catch (error) {
      setError(error.message);
      setUploadStatus('');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <ModernCard className="text-center p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          تسجيل الدخول مطلوب
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          يجب تسجيل الدخول لرفع الملفات
        </p>
        <ModernButton onClick={() => window.location.href = '/login'}>
          تسجيل الدخول
        </ModernButton>
      </ModernCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ModernCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 رفع ملف جديد
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            شارك الملفات التعليمية مع زملائك في الجامعة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اختر الملف *
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                accept={allowedTypes.map(type => `.${type}`).join(',')}
              />
            </div>
            {selectedFile && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  📁 {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان الملف *
            </label>
            <ModernInput
              type="text"
              name="title"
              value={uploadData.title}
              onChange={handleInputChange}
              placeholder="أدخل عنوان وصفي للملف"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              name="description"
              value={uploadData.description}
              onChange={handleInputChange}
              placeholder="وصف مختصر للملف وما يحتويه"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الفئة *
            </label>
            <select
              name="category"
              value={uploadData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">اختر الفئة</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المادة
            </label>
            <select
              name="subject"
              value={uploadData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">اختر المادة (اختياري)</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الكلمات المفتاحية
            </label>
            <ModernInput
              type="text"
              value={uploadData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="مثال: برمجة, جافا, oop (افصل بالفواصل)"
              className="w-full"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{uploadStatus}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <ModernAlert variant="error">
              {error}
            </ModernAlert>
          )}

          {/* Submit Button */}
          <ModernButton
            type="submit"
            className="w-full"
            loading={uploading}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '🚀 جاري الرفع...' : '📤 رفع الملف'}
          </ModernButton>
        </form>

        {/* System Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 معلومات النظام</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>🔐 المصادقة:</span>
              <span className="text-green-600">✅ Appwrite</span>
            </div>
            <div className="flex justify-between">
              <span>💾 قاعدة البيانات:</span>
              <span className="text-green-600">✅ Appwrite</span>
            </div>
            <div className="flex justify-between">
              <span>🗄️ التخزين:</span>
              <span className="text-green-600">✅ Appwrite Storage</span>
            </div>
            <div className="flex justify-between">
              <span>👤 المستخدم:</span>
              <span className="text-blue-600">{user?.name || 'مجهول'}</span>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default AppwriteUploadForm;