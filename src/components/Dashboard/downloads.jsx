import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from '../../components';
import Sidepanel from "./sidepanel";
import { DatabaseService } from '../../config/DatabaseService';
import { StorageService } from '../../config/StorageService';
import { useAuth } from '../../hooks/useAuth';

const Downloads = () => {
    const [open, setOpen] = useState(false);
    const [downloadedFiles, setDownloadedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadCounts, setDownloadCounts] = useState({});
    const { user } = useAuth();

    // تحميل سجل التحميلات
    useEffect(() => {
        const loadDownloads = async () => {
            if (!user?.$id) return;
            
            try {
                setLoading(true);
                setError('');
                
                // الحصول على سجل التحميلات للمستخدم
                const userDownloads = await DatabaseService.getUserDownloads(user.$id);
                
                if (userDownloads.length > 0) {
                    // جلب تفاصيل الملفات المحملة
                    const downloadedFilesData = await Promise.all(
                        userDownloads.map(async (download) => {
                            const file = await DatabaseService.getFileById(download.fileId);
                            return file ? { ...file, downloadedAt: download.$createdAt } : null;
                        })
                    );
                    const validFiles = downloadedFilesData.filter(file => file !== null);
                    setDownloadedFiles(validFiles);
                    
                    // حساب عدد التحميلات لكل ملف
                    const counts = {};
                    for (const file of validFiles) {
                        try {
                            const count = await DatabaseService.getFileDownloadCount(file.$id);
                            counts[file.$id] = count;
                        } catch (err) {
                            console.error(`Error getting download count for file ${file.$id}:`, err);
                            counts[file.$id] = 0;
                        }
                    }
                    setDownloadCounts(counts);
                }
            } catch (err) {
                setError('حدث خطأ في تحميل سجل التحميلات');
                console.error('Error loading downloads:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDownloads();
    }, [user]);

    // إعادة تحميل الملف
    const handleRedownload = async (file) => {
        try {
            const downloadUrl = await StorageService.getFileDownload(file.fileId);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name;
            link.click();
            
            // تسجيل التحميل في Downloads Collection
            if (user) {
                await DatabaseService.createDownload({
                    userId: user.$id,
                    fileId: file.$id,
                    fileName: file.name
                });
                console.log('✅ Re-download recorded in downloads collection');
                
                // تحديث عداد التحميلات فوراً
                const newCount = await DatabaseService.getFileDownloadCount(file.$id);
                setDownloadCounts(prev => ({
                    ...prev,
                    [file.$id]: newCount
                }));
            }
            
            // إعادة تحميل مكتملة
        } catch (err) {
            setError('حدث خطأ في إعادة تحميل الملف');
            console.error('Error re-downloading file:', err);
        }
    };

    // إضافة إلى المفضلة
    const handleAddBookmark = async (fileId) => {
        try {
            await DatabaseService.addBookmark(user.$id, fileId);
        } catch (err) {
            setError('حدث خطأ في إضافة الملف للمفضلة');
            console.error('Error adding bookmark:', err);
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
                                سجل التحميلات
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                الملفات التي قمت بتحميلها مؤخراً
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : downloadedFiles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📥</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    لا توجد تحميلات
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    ابدأ بتحميل ملفات لتجدها هنا
                                </p>
                                <Link 
                                    to="/materials" 
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    تصفح الملفات
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {downloadedFiles.map((file) => (
                                    <div 
                                        key={`${file.$id}-${file.downloadedAt}`} 
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    {file.name}
                                                </h3>
                                                
                                                {file.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                        {file.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                        {file.category}
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                                        {file.subject}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>📥 تم التحميل: {new Date(file.downloadedAt).toLocaleDateString('ar-SA')}</span>
                                                    <span>👥 {downloadCounts[file.$id] || 0} تحميل إجمالي</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 ml-4">
                                                <button
                                                    onClick={() => handleRedownload(file)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                >
                                                    إعادة تحميل
                                                </button>
                                                <button
                                                    onClick={() => handleAddBookmark(file.$id)}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                                                    title="إضافة للمفضلة"
                                                >
                                                    ⭐
                                                </button>
                                                <Link
                                                    to={`/file/${file.$id}`}
                                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-center"
                                                >
                                                    تفاصيل
                                                </Link>
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

export default Downloads;