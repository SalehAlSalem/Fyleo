import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { StorageService } from '../../config/StorageService'

const MaterialCard = (props) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // استخدام MinIO للتحميل
      const downloadResult = await StorageService.getFileDownload(props.material.$id || props.id);
      
      // فتح الرابط في تبويب جديد
      window.open(downloadResult, '_blank');
      
    } catch (error) {
      console.error('خطأ في التحميل:', error);
      alert(`فشل في تحميل الملف: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return "/file-icon.svg";
    
    if (fileType.includes('pdf')) return "/pdf-icon.svg";
    if (fileType.includes('image')) return "/image-icon.svg";
    if (fileType.includes('doc')) return "/doc-icon.svg";
    return "/file-icon.svg";
  };

  let key=0;
  return (
    <div className='flex items-center justify-center flex-col'>
     <div className='w-[90vw] bg-[#f1f5f9] dark:bg-[#E7E5E4] flex items-center justify-center m-5 shadow-[2px_4px_8px_rgba(0,0,0,0.25)] rounded-2xl max-md:flex-col px-3'>
        {props.material.resource_type === 'image' || props.material.type?.includes('image') ? (
          <img className='w-64 rounded-2xl m-3' src={props.material.previewUrl || props.material.url || props.material.image} alt={props.material.name || props.material.title} />
        ) : (
          <div className='w-64 rounded-2xl m-3 flex items-center justify-center bg-white shadow-inner'>
            <img src={getFileIcon(props.material.type || props.material.mimeType)} alt="file" className='w-20' />
          </div>
        )}
        <div className='flex items-center justify-center w-full flex-col m-2 max-md:p-3'>
          <div className='flex items-center justify-center w-full'>
            <div className='flex items-center justify-left text-3xl text-black/[0.75] w-full'>
              {props.material.title || props.material.name}
            </div>
              <div className='rounded-md m-2 p-1 flex items-center justify-center bg-[#FBBF24] shadow-[1.3333px_1.33333px_2.66667px_rgba(0,0,0,0.25)]'>
              <button>
                <img className='w-7' src="/Bookmark.svg" alt="" />
            </button>
              </div>
          </div>
          
          {/* عرض معلومات النظام الهرمي الجديد */}
          <div className='flex items-center justify-left w-full flex-wrap'>
            {props.material.category && (
              <div className='bg-blue-600 m-1 px-3 py-1 text-sm rounded-2xl text-white'>
                {props.material.category}
              </div>
            )}
            {props.material.subject && (
              <div className='bg-green-600 m-1 px-3 py-1 text-sm rounded-2xl text-white'>
                {props.material.subject}
              </div>
            )}
            {props.material.fileType && (
              <div className='bg-purple-600 m-1 px-3 py-1 text-sm rounded-2xl text-white'>
                {props.material.fileType}
              </div>
            )}
            {props.material.storageProvider && (
              <div className='bg-orange-600 m-1 px-3 py-1 text-sm rounded-2xl text-white'>
                📦 {props.material.storageProvider}
              </div>
            )}
            {/* عرض الحقول التقليدية إذا كانت موجودة */}
            {props.material.fields && props.material.fields.map((item, index) => (
              <div className='bg-black/[0.68] m-1 px-5 py-1 text-sm rounded-2xl text-white' key={index}>
                {item}
              </div> 
            ))}
          </div>
          
          <div className='flex items-end justify-end w-full h-28'>
            {/* زر التحميل المحدث */}
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className={`theme-btn-shadow m-2 px-5 py-2 shadow-[0px_4px_11.3333px_rgba(0,0,0,0.25)] text-white rounded-lg ${
                isDownloading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : props.material.resource_type === 'image' || props.material.type?.includes('image')
                    ? 'bg-[#3B82F6]' 
                    : 'bg-[#10B981]'
              }`}
            >
              {isDownloading ? '🔄 جاري التحميل...' : props.material.resource_type === 'image' || props.material.type?.includes('image') ? 'Download' : 'Open file'}
            </button>
            
            <Link to={`/details/${props.material.$id || props.id}`}>
              <button className='theme-btn-shadow m-2 px-5 py-2 bg-[#3B82F6] shadow-[0px_4px_11.3333px_rgba(0,0,0,0.25)] text-white rounded-lg'>
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialCard;