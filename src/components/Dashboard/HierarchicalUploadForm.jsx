import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { CategoryService } from '../../config/CategoryService';
import { DatabaseService } from '../../config/DatabaseService';
import { StorageService } from '../../config/StorageService';
import { useAuth } from '../../hooks/useAuth';

const HierarchicalUploadForm = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    try {
      const [categoriesResponse, fileTypesResponse] = await Promise.all([
        CategoryService.getAllCategories(),
        CategoryService.getAllFileTypes()
      ]);
      
      setCategories(categoriesResponse.documents);
      setFileTypes(fileTypesResponse.documents);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setStatus('❌ حدث خطأ في تحميل البيانات');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await CategoryService.getSubjectsByCategory(selectedCategory);
      setSubjects(response.documents);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
  };

  const validateForm = () => {
    if (!isAuthenticated || !user) {
      setStatus('❌ يرجى تسجيل الدخول أولاً');
      return false;
    }

    if (!file) {
      setStatus('❌ يرجى اختيار ملف للرفع');
      return false;
    }

    if (!title.trim()) {
      setStatus('❌ يرجى إدخال عنوان الملف');
      return false;
    }

    if (!selectedCategory) {
      setStatus('❌ يرجى اختيار التصنيف');
      return false;
    }

    if (!selectedSubject) {
      setStatus('❌ يرجى اختيار المادة');
      return false;
    }

    if (!selectedFileType) {
      setStatus('❌ يرجى اختيار نوع الملف');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setProgress(0);
    setStatus('⏳ جاري رفع الملف...');

    try {
      // 1. رفع الملف إلى Storage
      setStatus('⏳ جاري رفع الملف إلى التخزين...');
      setProgress(25);
      
      const uploadResult = await StorageService.uploadFile(file, {
        onProgress: (progressValue) => {
          setProgress(25 + (progressValue * 0.5)); // 25% to 75%
        }
      });

      // 2. حفظ بيانات الملف في Database
      setStatus('⏳ جاري حفظ بيانات الملف...');
      setProgress(80);

      const fileData = {
        title: title.trim(),
        description: description.trim() || null,
        categoryId: selectedCategory,
        subjectId: selectedSubject,
        fileTypeId: selectedFileType,
        semester: semester.trim() || null,
        year: year.trim() || null,
        tags: tags.trim() || null,
        
        // بيانات الملف الأصلية (متوافقة مع النظام الحالي)
        fileId: uploadResult.fileId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        downloadURL: uploadResult.downloadURL,
        viewURL: uploadResult.viewURL,
        uploadedBy: user.email,
        
        // بيانات إضافية للتوافق
        category: getCategorySlug(selectedCategory), // للتوافق مع النظام القديم
        subject: getSubjectName(selectedSubject)
      };

      const dbResult = await DatabaseService.createFile(fileData);
      
      setProgress(100);
      setStatus('✅ تم رفع الملف بنجاح!');
      
      // إعادة تعيين النموذج
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('❌ حدث خطأ في رفع الملف: ' + (error.message || 'خطأ غير معروف'));
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    setSelectedSubject("");
    setSelectedFileType("");
    setSemester("");
    setYear("");
    setTags("");
    setFile(null);
    setStatus("");
    setProgress(0);
  };

  const getCategorySlug = (categoryId) => {
    const category = categories.find(c => c.$id === categoryId);
    return category ? category.nameEn.toLowerCase().replace(/\s+/g, '-') : '';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.$id === subjectId);
    return subject ? subject.nameAr : '';
  };

  const getFileTypeInfo = (fileTypeId) => {
    return fileTypes.find(ft => ft.$id === fileTypeId) || {};
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📤 رفع ملف جديد
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اختيار الملف *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.mp4,.avi,.mkv,.mov"
            />
            {file && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                📁 {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان الملف *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الملف"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Hierarchical Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التصنيف الرئيسي *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((category) => (
                  <option key={category.$id} value={category.$id}>
                    {category.icon} {category.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المادة *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!selectedCategory}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">اختر المادة</option>
                {subjects.map((subject) => (
                  <option key={subject.$id} value={subject.$id}>
                    {subject.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع الملف *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {fileTypes.map((fileType) => (
                <button
                  key={fileType.$id}
                  type="button"
                  onClick={() => setSelectedFileType(fileType.$id)}
                  className={classNames(
                    "p-3 rounded-lg border text-center transition-all",
                    selectedFileType === fileType.$id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  )}
                >
                  <div className="text-2xl mb-1">{fileType.icon}</div>
                  <div className="text-xs">{fileType.nameAr}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              وصف الملف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف اختياري للملف"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الفصل الدراسي
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">اختياري</option>
                <option value="الفصل الأول">الفصل الأول</option>
                <option value="الفصل الثاني">الفصل الثاني</option>
                <option value="الفصل الصيفي">الفصل الصيفي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                السنة الدراسية
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="مثال: 2024-2025"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاغات
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="مثال: مهم، امتحان نهائي"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Progress & Status */}
          {status && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {status}
              </div>
              {progress > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                جاري الرفع...
              </>
            ) : (
              <>
                📤 رفع الملف
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalUploadForm;