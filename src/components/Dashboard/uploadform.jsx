import React, { useState } from "react";
import classNames from "classnames";
// استخدام النظام الهجين مع fallback محلي
import { uploadFileHybridFallback } from '../../utils/hybridFallback.js';
import { auth } from '../../../Firebase/ClientApp.js';
import cardData from '../../config/CardData.mjs';

const Upload = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [lastFailDetails, setLastFailDetails] = useState(null);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handlePdfChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setPdfFile(f || null);
  };

  const handleSubmit = async () => {
    // التحقق من تسجيل الدخول
    if (!auth || !auth.currentUser) {
      setStatus('❌ يرجى تسجيل الدخول أولاً');
      setLastFailDetails('يجب تسجيل الدخول قبل رفع الملفات');
      return;
    }

    // التحقق من وجود ملفات
    const totalFiles = imageFiles.length + (pdfFile ? 1 : 0);
    if (totalFiles === 0) {
      setStatus('❌ يرجى اختيار ملف واحد على الأقل');
      setLastFailDetails('لا توجد ملفات محددة للرفع');
      return;
    }

    // التحقق من البيانات المطلوبة
    if (!title.trim()) {
      setStatus('❌ يرجى إدخال عنوان الملف');
      setLastFailDetails('العنوان مطلوب');
      return;
    }

    if (!category) {
      setStatus('❌ يرجى اختيار الفئة');
      setLastFailDetails('الفئة مطلوبة');
      return;
    }

    // Start upload process
    setStatus('⚡ تحضير الملفات للرفع...');
    setProgress(5);
    setLastFailDetails(null);

    // Show initial status
    setTimeout(() => {
      setStatus('🔄 جاري بدء عملية الرفع...');
      setProgress(10);
    }, 500);

    try {
      let done = 0;
      const results = [];
      const user = auth.currentUser;

      // رفع الصور
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const categoryObj = cardData.find(c => c.domain === category) || null;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        setStatus(`� رفع صورة: ${file.name} (${fileSize}MB)...`);
        
        const onFileProgress = (percent) => {
          const fileProgress = ((done + (percent / 100)) / totalFiles) * 100;
          setProgress(Math.round(fileProgress));
        };
        
        try {
          const res = await uploadFileHybridFallback(file, {
            category: categoryObj ? categoryObj.domain : category,
            categorySlug: categoryObj ? categoryObj.urlparams : (category || null),
            description: description.trim(),
            tags: [category].filter(Boolean),
            title: title.trim(),
            uploadedBy: user.uid,
            uploaderEmail: user.email,
            uploaderName: user.displayName || 'مستخدم',
            approved: true,
            fileType: file.type,
          }, onFileProgress);
          
          results.push({ 
            file: file.name, 
            result: res,
            success: true,
            provider: res.storageProvider || res.provider
          });
          
          setStatus(`✅ تم رفع ${file.name} بنجاح على ${res.storageProvider || res.provider}`);
          
        } catch (fileError) {
          console.error(`خطأ رفع ${file.name}:`, fileError);
          results.push({ 
            file: file.name, 
            error: fileError.message,
            success: false 
          });
          setStatus(`❌ فشل رفع ${file.name}: ${fileError.message}`);
        }
        
        done++;
        setProgress(Math.round((done / totalFiles) * 100));
      }

      // رفع PDF إذا كان موجود
      if (pdfFile) {
        const categoryObj = cardData.find(c => c.domain === category) || null;
        const fileSize = (pdfFile.size / 1024 / 1024).toFixed(2);
        
        setStatus(`📄 رفع PDF: ${pdfFile.name} (${fileSize}MB)...`);
        
        const onFileProgress = (percent) => {
          const fileProgress = ((done + (percent / 100)) / totalFiles) * 100;
          setProgress(Math.round(fileProgress));
        };
        
        try {
          const res = await uploadFileHybridFallback(pdfFile, {
            category: categoryObj ? categoryObj.domain : category,
            categorySlug: categoryObj ? categoryObj.urlparams : (category || null),
            description: description.trim(),
            tags: [category].filter(Boolean),
            title: title.trim(),
            uploadedBy: user.uid,
            uploaderEmail: user.email,
            uploaderName: user.displayName || 'مستخدم',
            approved: true,
            fileType: pdfFile.type,
          }, onFileProgress);
          
          results.push({ 
            file: pdfFile.name, 
            result: res,
            success: true,
            provider: res.storageProvider || res.provider
          });
          
          setStatus(`✅ تم رفع ${pdfFile.name} بنجاح على ${res.storageProvider || res.provider}`);
          
        } catch (fileError) {
          console.error(`خطأ رفع ${pdfFile.name}:`, fileError);
          results.push({ 
            file: pdfFile.name, 
            error: fileError.message,
            success: false 
          });
          setStatus(`❌ فشل رفع ${pdfFile.name}: ${fileError.message}`);
        }
        
        done++;
        setProgress(Math.round((done / totalFiles) * 100));
      }

      // تحليل النتائج
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);
      
      if (successfulUploads.length === 0) {
        setStatus(`❌ فشل رفع جميع الملفات (${failedUploads.length})`);
        setLastFailDetails(failedUploads.map(f => `${f.file}: ${f.error}`).join('\n'));
      } else if (failedUploads.length > 0) {
        setStatus(`⚠️ تم رفع ${successfulUploads.length} من ${totalFiles} ملف. ${failedUploads.length} فشل`);
        setLastFailDetails(failedUploads.map(f => `${f.file}: ${f.error}`).join('\n'));
      } else {
        setStatus(`🎉 تم رفع جميع الملفات بنجاح! (${successfulUploads.length})`);
        setLastFailDetails(null);
        
        // مسح النموذج عند النجاح
        setTitle('');
        setDescription('');
        setCategory('');
        setImageFiles([]);
        setPdfFile(null);
        setProgress(0);
        
        // تسجيل تفاصيل الرفع
        console.log('✅ الملفات المرفوعة بنجاح:', successfulUploads.map(r => ({
          name: r.file,
          url: r.result.downloadURL,
          id: r.result.id,
          provider: r.provider,
          size: r.result.fileSize
        })));
      }
      
    } catch (err) {
      console.error('❌ خطأ عام في الرفع:', err);
      setStatus(`❌ خطأ غير متوقع: ${err.message}`);
      setLastFailDetails(err.message);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFiles([]);
    setPdfFile(null);
    setProgress(0);
    setStatus('');
  };

  return (
    <div className="flex items-center flex-col">
      <div className="w-[78vw] bg-gray-100 dark:bg-[#E7E5E4] flex items-center justify-center m-5 shadow-md rounded-2xl flex-col px-3 py-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} cols={30} rows={6} className="w-[85%] h-40 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" placeholder="Description" />

        <label className="text-xl mb-2 w-[85%]">Images:</label>
        <input type="file" onChange={handleImageChange} className="w-[85%] h-12 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" accept="image/*" multiple />

        <label className="text-xl mb-2 w-[85%]">PDF:</label>
        <input type="file" onChange={handlePdfChange} className="w-[85%] h-12 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" accept="application/pdf" />

        <label className="text-gray-500 w-[85%]">Category / Subject</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2">
          <option value="">Select a category</option>
          {cardData.map(c => (
            <option key={c.id} value={c.domain}>{c.domain}</option>
          ))}
        </select>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-[85%] mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Upload Progress</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {status && (
          <div className={`w-[85%] mt-3 p-3 rounded-lg border ${
            status.includes('✅') || status.includes('🎉') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : status.includes('❌') 
              ? 'bg-red-50 border-red-200 text-red-800'
              : status.includes('⚠️')
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="text-sm font-medium">{status}</div>
            {lastFailDetails && (
              <div className="text-xs mt-2 p-2 bg-red-100 rounded border border-red-200">
                <strong>Error Details:</strong>
                <pre className="whitespace-pre-wrap">{lastFailDetails}</pre>
              </div>
            )}
          </div>
        )}

        {/* حالة النظام الهجين */}
        <div className="w-[85%] mt-2 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-800 font-semibold mb-2">� نظام Firebase Storage:</div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>📁 GitHub (ملفات &lt; 25MB)</span>
              <span className={`px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_GITHUB_TOKEN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_GITHUB_TOKEN ? '✅ متاح' : '❌ غير متاح'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>⚡ Supabase (ملفات 25-100MB)</span>
              <span className={`px-2 py-1 rounded text-xs ${
                (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) ? '✅ متاح' : '❌ غير متاح'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>� Firebase (البيانات)</span>
              <span className={`px-2 py-1 rounded text-xs ${
                auth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {auth ? '✅ متصل' : '❌ غير متصل'}
              </span>
            </div>
          </div>
        </div>

        {/* رسائل الخطأ التفصيلية */}
        {lastFailDetails && (
          <div className="w-[85%] mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800 font-medium mb-1">❌ تفاصيل الخطأ:</div>
            <div className="text-xs text-red-700 whitespace-pre-line">{lastFailDetails}</div>
          </div>
        )}

        <div className="w-[85%] flex justify-between gap-4 mt-6">
          <button 
            onClick={handleSubmit}
            disabled={progress > 0 && progress < 100}
            className={classNames({
              'theme-btn-shadow rounded-xl flex-1 px-4 py-2 monu text-sm font-normal mobile:text-xs transition-all': true,
              'bg-[#3B82F6] text-white hover:bg-blue-600': !(progress > 0 && progress < 100),
              'bg-gray-400 text-gray-600 cursor-not-allowed': progress > 0 && progress < 100,
            })}
          >
            {progress > 0 && progress < 100 ? 'جاري الرفع...' : 'رفع الملفات'}
          </button>
          
          <button 
            onClick={resetForm}
            className="theme-btn-shadow rounded-xl bg-gray-500 hover:bg-gray-600 text-white flex-1 px-4 py-2 monu text-sm font-normal mobile:text-xs transition-all"
          >
            مسح النموذج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;