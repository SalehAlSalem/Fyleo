import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../Firebase/ClientApp.js';
// استخدام النظام الهجين (GitHub + Supabase) مع وضع محاكاة تلقائي في حالة نقص المتغيرات
import { uploadFileHybridFallback } from '../../utils/hybridFallback.js';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  ModernAlert,
  useTranslation 
} from '../modern/ModernComponents';

const ModernUploadForm = ({ onUploadSuccess }) => {
  const [user] = useAuthState(auth);
  const [uploadData, setUploadData] = useState({
    file: null,
    name: '',
    description: '',
    category: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();

  const categories = [
    { id: '', name: 'اختر التصنيف' },
    { id: 'Computer Science', name: 'علوم الحاسوب' },
    { id: 'Mathematics', name: 'الرياضيات' },
    { id: 'Physics', name: 'الفيزياء' },
    { id: 'Chemistry', name: 'الكيمياء' },
    { id: 'Engineering', name: 'الهندسة' },
    { id: 'Electronics', name: 'الإلكترونيات' },
    { id: 'Others', name: 'أخرى' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
        return;
      }

      setUploadData(prev => ({
        ...prev,
        file,
        name: prev.name || file.name
      }));
      setError('');
    }
  };

  const validateForm = () => {
    if (!uploadData.file) {
      setError('يرجى اختيار ملف للرفع');
      return false;
    }
    if (!uploadData.name.trim()) {
      setError('يرجى إدخال اسم الملف');
      return false;
    }
    if (!uploadData.category) {
      setError('يرجى اختيار تصنيف للملف');
      return false;
    }
    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) { setError('يجب تسجيل الدخول أولاً'); return; }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const file = uploadData.file;
      const onProgress = (p) => setUploadProgress(Math.min(99, Math.round(p)));

      // بيانات ميتاداتا موحدة للنظام الهجين
      const metadata = {
        title: uploadData.name.trim(),
        description: uploadData.description.trim(),
        category: uploadData.category,
        categorySlug: uploadData.category,
        originalName: file.name,
        tags: [uploadData.category].filter(Boolean),
        uploadedBy: user.uid,
        uploaderEmail: user.email,
        uploaderName: user.displayName || user.email || 'مستخدم',
        fileType: file.type,
        approved: true,
      };

      const result = await uploadFileHybridFallback(file, metadata, (percent) => {
        onProgress(percent);
      });

      // حفظ ميتاداتا في Firestore (حتى في المحاكاة لتظهر في الواجهة)
      const fileData = {
        name: metadata.title,
        description: metadata.description,
        category: metadata.category,
        originalName: metadata.originalName,
        downloadURL: result.downloadURL || result.url || '#',
        provider: result.storageProvider || result.provider || (result.isSimulation ? 'simulation' : 'unknown'),
        size: file.size,
        type: file.type,
        uploadedBy: user.uid,
        uploaderName: metadata.uploaderName,
        createdAt: serverTimestamp(),
        downloads: 0,
        isSimulation: !!result.isSimulation,
        hybrid: true,
      };

      await addDoc(collection(db, 'files'), fileData);

      setUploadProgress(100);
      setSuccess(`تم رفع الملف بنجاح عبر ${fileData.provider === 'simulation' ? 'وضع المحاكاة' : fileData.provider}`);

      // إعادة تعيين النموذج
      setUploadData({ file: null, name: '', description: '', category: '' });
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(`حدث خطأ أثناء رفع الملف: ${err.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ModernCard className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl">
            📤
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            رفع ملف جديد
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            شارك ملفاتك التعليمية مع زملائك في الجامعة
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <ModernAlert type="error" className="mb-6">
            {error}
          </ModernAlert>
        )}

        {success && (
          <ModernAlert type="success" className="mb-6">
            {success}
          </ModernAlert>
        )}

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اختر الملف *
            </label>
            <div className="relative">
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip,.rar"
              />
              <label
                htmlFor="file-input"
                className={`w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploadData.file
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-center">
                  {uploadData.file ? (
                    <>
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-1">
                        {uploadData.file.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(uploadData.file.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">
                        اضغط لاختيار ملف
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        PDF, DOC, PPT, الصور، أو ملفات مضغوطة (حد أقصى 10MB)
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* File Name */}
          <ModernInput
            type="text"
            name="name"
            label="اسم الملف *"
            placeholder="أدخل اسم الملف"
            value={uploadData.name}
            onChange={handleInputChange}
            required
            disabled={uploading}
            icon="📝"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              وصف الملف (اختياري)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="أضف وصفاً مختصراً عن محتوى الملف..."
              value={uploadData.description}
              onChange={handleInputChange}
              disabled={uploading}
              className="input-modern w-full resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              التصنيف *
            </label>
            <select
              name="category"
              value={uploadData.category}
              onChange={handleInputChange}
              required
              disabled={uploading}
              className="input-modern w-full"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">جاري الرفع...</span>
                <span className="text-purple-600 dark:text-purple-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <ModernButton
            type="submit"
            size="lg"
            className="w-full"
            loading={uploading}
            disabled={uploading || !uploadData.file}
          >
            {uploading ? `جاري الرفع... ${uploadProgress}%` : 'رفع الملف'}
          </ModernButton>
        </form>

        {/* Upload Guidelines */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📋 إرشادات الرفع
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• الحد الأقصى لحجم الملف: 10 ميجابايت</li>
            <li>• الصيغ المدعومة: PDF, DOC, PPT, الصور, الملفات المضغوطة</li>
            <li>• تأكد من أن المحتوى مناسب ومفيد للطلاب</li>
            <li>• لا ترفع ملفات محمية بحقوق الطبع والنشر</li>
          </ul>
        </div>
      </ModernCard>
    </div>
  );
};

export default ModernUploadForm;