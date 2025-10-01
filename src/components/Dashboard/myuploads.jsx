import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../../config/DatabaseService.js';
import { useAuth } from '../../hooks/useAuth';

const MyUploads = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // وظيفة تحميل الملف مع تسجيل في Downloads Collection
  const handleDownload = async (file) => {
    console.log('🔍 MyUploads - Download started for:', file.name);
    try {
      // تسجيل التحميل في Downloads Collection
      if (user) {
        await DatabaseService.createDownload({
          userId: user.$id,
          fileId: file.$id
          // أزلنا fileName لأنه غير موجود في Collection
        });
        console.log('✅ Download recorded in downloads collection');
      }
      
      // تحديث إحصائيات التحميل في الملف
      await DatabaseService.incrementDownloadCount(file.$id);
      console.log('✅ Download count incremented');
      
      // تحميل الملف بطرق متعددة
      if (file.downloadURL) {
        const link = document.createElement('a');
        link.href = file.downloadURL;
        link.download = file.name || file.title || 'file';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('✅ MyUploads - Download triggered');
      }
    } catch (err) {
      console.error('Error in MyUploads download:', err);
      // حتى لو فشل التسجيل، استمر بالتحميل
      if (file.downloadURL) {
        window.open(file.downloadURL, '_blank');
      }
    }
  };

  useEffect(() => {
    const fetchUploads = async () => {
      const { user } = useAuth();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const files = await DatabaseService.getUserFiles(user.email);
        setUserFiles(files);
        const uploadsList = [];
        
        querySnapshot.forEach((doc) => {
          uploadsList.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUploads(uploadsList);
      } catch (err) {
        console.error('Error fetching uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Uploads ({uploads.length})</h2>
      <div className="grid gap-4">
        {uploads.map((file) => (
          <div key={file.id} className="border rounded p-4">
            <h3 className="font-semibold">{file.name}</h3>
            <p className="text-sm text-gray-600">{file.category}</p>
            <button 
              onClick={() => handleDownload(file)}
              className="text-blue-500 hover:underline cursor-pointer bg-transparent border-none"
            >
              View File
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUploads;
