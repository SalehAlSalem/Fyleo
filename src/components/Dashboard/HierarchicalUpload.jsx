import React, { useState } from "react";
import classNames from "classnames";
import { CategoryService } from '../../config/CategoryService';

const HierarchicalUpload = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // النظام الهرمي الجديد
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // الحصول على البيانات للقوائم المنسدلة
  const categories = CategoryService.MAIN_CATEGORIES || [];
  const subjects = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.subjects || []
    : [];
  const fileTypes = CategoryService.INITIAL_FILE_TYPES || [];

  // دوال التحكم في القوائم المنسدلة الهرمية
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubject(""); // إعادة تعيين المادة عند تغيير التصنيف
    setSelectedFileType(""); // إعادة تعيين نوع الملف
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setSelectedFileType(""); // إعادة تعيين نوع الملف عند تغيير المادة
  };

  const handleFileTypeChange = (fileType) => {
    setSelectedFileType(fileType);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    // التحقق من البيانات المطلوبة
    if (!title.trim()) {
      setStatus('❌ يرجى إدخال عنوان الملف');
      return;
    }

    if (!selectedCategory) {
      setStatus('❌ يرجى اختيار التصنيف الرئيسي');
      return;
    }

    if (!selectedSubject) {
      setStatus('❌ يرجى اختيار المادة');
      return;
    }

    if (!selectedFileType) {
      setStatus('❌ يرجى اختيار نوع الملف');
      return;
    }

    if (files.length === 0) {
      setStatus('❌ يرجى اختيار ملف واحد على الأقل');
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setStatus('🚀 بدء عملية الرفع...');

    try {
      // محاكاة عملية الرفع
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus(`📤 رفع: ${file.name}...`);
        
        // محاكاة التقدم
        for (let p = 0; p <= 100; p += 20) {
          setProgress(((i * 100 + p) / files.length));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setStatus('✅ تم رفع الملفات بنجاح!');
      setProgress(100);

      // إعادة تعيين النموذج بعد نجاح الرفع
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      setStatus(`❌ خطأ في الرفع: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedFileType('');
    setFiles([]);
    setStatus('');
    setProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="flex items-center flex-col">
      <div className="w-[78vw] bg-gray-100 dark:bg-gray-800 flex items-center justify-center m-5 shadow-md rounded-2xl flex-col px-3 py-5">
        
        {/* العنوان والوصف */}
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          type="text" 
          className="w-[85%] h-10 rounded-lg border border-gray-400 text-gray-700 py-2 pl-4 m-2" 
          placeholder="عنوان الملف" 
        />
        
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          cols={30} 
          rows={4} 
          className="w-[85%] h-32 rounded-lg border border-gray-400 text-gray-700 py-2 pl-4 mb-2" 
          placeholder="وصف الملف (اختياري)" 
        />

        {/* اختيار الملفات */}
        <label className="text-xl mb-2 w-[85%] dark:text-white">📎 الملفات:</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="w-[85%] h-12 rounded-lg border border-gray-400 text-gray-700 py-2 pl-4 mb-4" 
          multiple 
        />

        {/* النظام الهرمي - القوائم المنسدلة المتتالية */}
        
        {/* 1. التصنيف الرئيسي */}
        <div className="w-[85%] mb-4">
          <label className="text-gray-700 dark:text-gray-300 block mb-2">🗂️ التصنيف الرئيسي</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)} 
            className="w-full h-12 rounded-lg border border-gray-400 text-gray-700 py-2 px-4 bg-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">اختر التصنيف الرئيسي</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. المادة (تظهر فقط بعد اختيار التصنيف) */}
        {selectedCategory && (
          <div className="w-[85%] mb-4">
            <label className="text-gray-700 dark:text-gray-300 block mb-2">📚 المادة</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => handleSubjectChange(e.target.value)} 
              className="w-full h-12 rounded-lg border border-gray-400 text-gray-700 py-2 px-4 bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">اختر المادة</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subjects.length} مادة متاحة في هذا التصنيف
            </div>
          </div>
        )}

        {/* 3. نوع الملف (تظهر فقط بعد اختيار المادة) */}
        {selectedSubject && (
          <div className="w-[85%] mb-4">
            <label className="text-gray-700 dark:text-gray-300 block mb-2">📁 نوع الملف</label>
            <select 
              value={selectedFileType} 
              onChange={(e) => handleFileTypeChange(e.target.value)} 
              className="w-full h-12 rounded-lg border border-gray-400 text-gray-700 py-2 px-4 bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">اختر نوع الملف</option>
              {fileTypes.map((fileType, index) => (
                <option key={index} value={fileType.name}>
                  {fileType.icon} {fileType.name}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {fileTypes.length} نوع ملف متاح
            </div>
          </div>
        )}

        {/* معاينة الاختيار */}
        {selectedCategory && selectedSubject && selectedFileType && (
          <div className="w-[85%] mb-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ مسار الرفع:</div>
            <div className="text-xs text-green-700 dark:text-green-300">
              <div>📂 {categories.find(c => c.id === selectedCategory)?.name}</div>
              <div className="ml-4">📚 {selectedSubject}</div>
              <div className="ml-8">📁 {selectedFileType}</div>
            </div>
          </div>
        )}

        {/* شريط التقدم */}
        {progress > 0 && (
          <div className="w-[85%] mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تقدم الرفع</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* رسالة الحالة */}
        {status && (
          <div className={`w-[85%] mt-3 p-3 rounded-lg border ${
            status.includes('✅') 
              ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200' 
              : status.includes('❌') 
              ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
              : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
          }`}>
            <div className="text-sm font-medium">{status}</div>
          </div>
        )}

        {/* أزرار التحكم */}
        <div className="w-[85%] flex justify-between gap-4 mt-6">
          <button 
            onClick={handleSubmit}
            disabled={isUploading}
            className={classNames({
              'rounded-xl flex-1 px-4 py-2 text-sm font-normal transition-all': true,
              'bg-blue-600 text-white hover:bg-blue-700': !isUploading,
              'bg-gray-400 text-gray-600 cursor-not-allowed': isUploading,
            })}
          >
            {isUploading ? 'جاري الرفع...' : 'رفع الملفات'}
          </button>
          
          <button 
            onClick={resetForm}
            className="rounded-xl bg-gray-500 hover:bg-gray-600 text-white flex-1 px-4 py-2 text-sm font-normal transition-all"
          >
            مسح النموذج
          </button>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalUpload;