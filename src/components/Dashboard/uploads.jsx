import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from '../../components';
import Sidepanel from "./sidepanel";
import { DatabaseService } from '../../config/DatabaseService';
import { StorageService } from '../../config/StorageService';
import { useAuth } from '../../hooks/useAuth';

const Uploads = () => {
    const [open, setOpen] = useState(false);
    const [userUploads, setUserUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // تحميل ملفات المستخدم
    useEffect(() => {
        const loadUserUploads = async () => {
            if (!user?.$id) return;
            
            try {
                setLoading(true);
                setError('');
                
                // الحصول على ملفات المستخدم
                const uploads = await DatabaseService.getUserFiles(user.$id);
                setUserUploads(uploads);
                console.log('✅ User uploads loaded:', uploads.documents?.length);
                
            } catch (err) {
                setError('حدث خطأ في تحميل ملفاتك');
                console.error('Error loading user uploads:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUserUploads();
    }, [user]);

    // حذف ملف
    const handleDeleteFile = async (fileId) => {
        if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
        
        try {
            // أولاً احصل على بيانات الملف من Database
            const fileData = await DatabaseService.getFileById(fileId);
            
            // احذف من Database
            await DatabaseService.deleteFile(fileId);
            
            // احذف من Storage باستخدام fileId المحفوظ في Database
            if (fileData.fileId) {
                await StorageService.deleteFile(fileData.fileId);
                console.log('✅ File deleted from Storage:', fileData.fileId);
            }
            
            setUserUploads(prev => ({
                ...prev,
                documents: prev.documents?.filter(file => file.$id !== fileId) || []
            }));
        } catch (err) {
            setError('حدث خطأ في حذف الملف');
            console.error('Error deleting file:', err);
        }
    };

    // تحميل الملف
    const handleDownload = async (file) => {
        try {
            console.log('🔄 Starting download for file:', {
                '$id': file.$id,
                'fileId': file.fileId,
                'title': file.title
            });
            
            // تسجيل التحميل في Downloads Collection
            if (user) {
                const downloadData = {
                    userId: user.$id,
                    fileId: file.$id // نسجل معرف الملف من جدول materials
                };
                console.log('📝 Recording download with data:', downloadData);
                
                await DatabaseService.createDownload(downloadData);
                console.log('✅ Download recorded in downloads collection');
                
                // تحديث عداد التحميلات في الملف نفسه
                await DatabaseService.incrementDownloadCount(file.$id);
                console.log('✅ Download count incremented');
                
                // تحديث قائمة الملفات محلياً
                setUserUploads(prev => ({
                    ...prev,
                    documents: prev.documents?.map(f => 
                        f.$id === file.$id 
                            ? { ...f, downloads: (f.downloads || 0) + 1 }
                            : f
                    )
                }));
            }
            
            const downloadUrl = await StorageService.getFileDownload(file.fileId);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.title || file.name || file.fileName;
            link.click();
            
            // تحميل مكتمل
        } catch (err) {
            setError('حدث خطأ في تحميل الملف');
            console.error('Error downloading file:', err);
        }
    };

    return (
        <div className={`main w-screen h-screen`}>
            <NavBar />
            <div className={`flex justify-start w-full h-full `}>
                <Sidepanel open={open} setOpen={setOpen} />
                <div className={`uploads ${open ? "w-[95%]" :"w-[80%]"} h-full ${open? "ml-[12%]" : "ml-[18%]"} `}>
                    <div className={`w-full h-full p-6`}>
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                ملفاتي المرفوعة
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                إدارة الملفات التي قمت برفعها
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <Link 
                                to="/dashboard/upload" 
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                📤 رفع ملف جديد
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                            </div>
                        ) : !userUploads.documents || userUploads.documents.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📂</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    لم تقم برفع أي ملفات بعد
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    ابدأ بمشاركة ملفاتك التعليمية مع زملائك
                                </p>
                                <Link 
                                    to="/dashboard/upload" 
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    رفع أول ملف
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(userUploads.documents || []).map((file) => (
                                    <div 
                                        key={file.$id} 
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                                                {file.name}
                                            </h3>
                                            
                                            {file.description && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {file.description}
                                                </p>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                                    {file.category}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                    {file.subject}
                                                </span>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                                    {StorageService.formatFileSize(file.fileSize)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span>👥 {file.downloads || 0} تحميل</span>
                                                <span>📅 {new Date(file.$createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(file)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                                                >
                                                    تحميل
                                                </button>
                                                <Link
                                                    to={`/file/${file.$id}`}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-center text-sm"
                                                >
                                                    تفاصيل
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteFile(file.$id)}
                                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                                    title="حذف الملف"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>     
        </div>
    );
};

export default Uploads;