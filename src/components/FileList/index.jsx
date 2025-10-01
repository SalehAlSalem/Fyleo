import React, { useEffect, useState, useMemo } from 'react';
import { DatabaseService } from '../../config/DatabaseService';
import { useAuth } from '../../hooks/useAuth';
import { DownloadHelper } from '../../utils/DownloadHelper';

// أيقونات مزود التخزين
const providerBadge = (p) => {
  if (p === 'github' || p === 'GitHub (مجاني)') return '🐙 GitHub';
  if (p === 'supabase' || p === 'Supabase (احتياطي)') return '⚡ Supabase';
  if (p === 'local-simulation') return '🧪 Simulation';
  return '📦 أخرى';
};

const humanSize = (bytes) => {
  if (!bytes) return '0B';
  const u = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(1024));
  return (bytes/Math.pow(1024,i)).toFixed(i===0?0:1)+u[i];
};

const FileList = ({ max=50, enableSearch=true, categorySlug=null }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qText, setQText] = useState('');

  // وظيفة تحميل الملف مع تسجيل في Downloads Collection
  const handleDownload = async (file) => {
    console.log('🔍 handleDownload called with file:', file);
    console.log('🔍 User:', user);
    console.log('🔍 File downloadURL:', file.downloadURL);
    
    try {
      // تسجيل التحميل في Downloads Collection
      if (user) {
        await DatabaseService.createDownload({
          userId: user.$id,
          fileId: file.$id
        });
        console.log('✅ Download recorded in downloads collection');
      } else {
        console.log('⚠️ No user logged in, skipping download recording');
      }
      
      // تحميل الملف مباشرة
      if (file.downloadURL) {
        console.log('📥 Starting download...');
        
        // طريقة مباشرة وبسيطة
        const link = document.createElement('a');
        link.href = file.downloadURL;
        link.download = file.name || file.title || 'file';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Download initiated successfully');
      } else {
        console.error('❌ No downloadURL found for file:', file);
        alert('رابط التحميل غير متوفر');
      }
    } catch (err) {
      console.error('Error in download process:', err);
      
      // حتى لو فشل التسجيل، جرب التحميل المباشر
      if (file.downloadURL) {
        console.log('🔄 Attempting direct download despite error...');
        window.open(file.downloadURL, '_blank');
      } else {
        alert('خطأ في تحميل الملف: ' + err.message);
      }
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log('🔄 Fetching files from database...');
        const filesResponse = await DatabaseService.getAllFiles();
        const files = filesResponse.documents || [];
        console.log('📂 Files fetched:', files.length);
        console.log('📂 Sample file data:', files[0]);
        setFiles(files);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  const filtered = useMemo(() => {
    return files.filter(f => {
      if (categorySlug && f.categorySlug !== categorySlug) return false;
      if (!qText) return true;
      const term = qText.toLowerCase();
      return (f.name || '').toLowerCase().includes(term) || (f.title || '').toLowerCase().includes(term);
    }).slice(0, max);
  }, [files, qText, max, categorySlug]);

  return (
    <div className="w-full mx-auto mt-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">📂 أحدث الملفات ({filtered.length})</h3>
        {enableSearch && (
          <input
            type="text"
            placeholder="بحث..."
            value={qText}
            onChange={e=>setQText(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring w-48"
          />
        )}
      </div>
      {loading && <div className="text-sm text-gray-600">⏳ تحميل...</div>}
      {error && <div className="text-sm text-red-600">❌ {error}</div>}
      {!loading && filtered.length === 0 && (
        <div className="text-sm text-gray-500">لا توجد ملفات متاحة حالياً.</div>
      )}
      <div className="grid gap-3">
        {filtered.map(f => {
          const isImage = f.type?.startsWith('image/');
          const isPdf = f.type === 'application/pdf';
          const isSim = f.isSimulation || f.storageProvider === 'local-simulation';
          return (
            <div key={f.id} className="border rounded-lg p-3 bg-white/70 dark:bg-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded border bg-gray-50">
                {isImage ? (
                  <img src={f.downloadURL} alt={f.name} className="object-cover w-full h-full" />
                ) : isPdf ? (
                  <span className="text-red-600 text-3xl font-bold">PDF</span>
                ) : (
                  <span className="text-gray-500 text-sm">FILE</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate max-w-[220px]" title={f.name}>{f.name || f.title || 'بدون اسم'}</span>
                  {isSim && <span className="px-2 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 font-semibold">محاكاة</span>}
                  <span className="px-2 py-0.5 rounded text-[10px] bg-gray-200 text-gray-700">
                    {providerBadge(f.provider || f.storageProvider)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 flex gap-4 flex-wrap">
                  <span>{humanSize(f.size || f.fileSize)}</span>
                  {f.category && <span>{f.category}</span>}
                  {f.uploadedAt?.toDate && <span>{f.uploadedAt.toDate().toLocaleString('ar-SA')}</span>}
                </div>
                {f.description && <div className="text-xs mt-1 line-clamp-2 text-gray-500">{f.description}</div>}
              </div>
              <div className="flex flex-col gap-2 w-32">
                {f.downloadURL ? (
                  <button 
                    onClick={() => {
                      console.log('🖱️ Download button clicked!');
                      console.log('📂 File object:', f);
                      console.log('🔗 Download URL:', f.downloadURL);
                      handleDownload(f);
                    }}
                    className="text-center text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 font-medium cursor-pointer"
                  >
                    📥 تنزيل
                  </button>
                ) : (
                  <div className="text-center text-xs bg-gray-400 text-white rounded px-2 py-1 font-medium">
                    رابط غير متوفر
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;