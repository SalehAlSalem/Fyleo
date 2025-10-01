import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from '../../components';
import Sidepanel from "./sidepanel";
import { DatabaseService } from '../../config/DatabaseService';
import { StorageService } from '../../config/StorageService';
import { useAuth } from '../../hooks/useAuth';

const Bookmarks = () => {
    const [open, setOpen] = useState(false);
    const [bookmarkedFiles, setBookmarkedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadCounts, setDownloadCounts] = useState({});
    const { user } = useAuth();

    // تحميل الملفات المفضلة
    useEffect(() => {
        const loadBookmarks = async () => {
            if (!user?.$id) return;
            
            try {
                setLoading(true);
                setError('');
                
                // الحصول على معرفات الملفات المفضلة للمستخدم
                const userBookmarks = await DatabaseService.getUserBookmarks(user.$id);
                
                if (userBookmarks.length > 0) {
                    // جلب تفاصيل الملفات المفضلة
                    const bookmarkedFilesData = await Promise.all(
                        userBookmarks.map(bookmark => 
                            DatabaseService.getFileById(bookmark.fileId)
                        )
                    );
                    const validFiles = bookmarkedFilesData.filter(file => file !== null);
                    setBookmarkedFiles(validFiles);
                    
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
                setError('حدث خطأ في تحميل الملفات المفضلة');
                console.error('Error loading bookmarks:', err);
            } finally {
                setLoading(false);
            }
        };

        loadBookmarks();
    }, [user]);

    // إزالة من المفضلة
    const handleRemoveBookmark = async (fileId) => {
        try {
            await DatabaseService.removeBookmark(user.$id, fileId);
            setBookmarkedFiles(prev => prev.filter(file => file.$id !== fileId));
        } catch (err) {
            setError('حدث خطأ في إزالة الملف من المفضلة');
            console.error('Error removing bookmark:', err);
        }
    };

    // تحميل الملف
    const handleDownload = async (file) => {
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
                console.log('✅ Download recorded in downloads collection');
                
                // تحديث عداد التحميلات فوراً
                const newCount = await DatabaseService.getFileDownloadCount(file.$id);
                setDownloadCounts(prev => ({
                    ...prev,
                    [file.$id]: newCount
                }));
            }
            
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
                                الملفات المفضلة
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                الملفات التي أضفتها إلى مفضلتك
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                            </div>
                        ) : bookmarkedFiles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    لا توجد ملفات مفضلة
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    ابدأ بإضافة ملفات إلى مفضلتك لتجدها هنا
                                </p>
                                <Link 
                                    to="/materials" 
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    تصفح الملفات
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarkedFiles.map((file) => (
                                    <div 
                                        key={file.$id} 
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {file.name}
                                                </h3>
                                                <button
                                                    onClick={() => handleRemoveBookmark(file.$id)}
                                                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                                                    title="إزالة من المفضلة"
                                                >
                                                    ⭐
                                                </button>
                                            </div>
                                            
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
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span>👥 {downloadCounts[file.$id] || 0} تحميل</span>
                                                <span>📅 {new Date(file.$createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(file)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    تحميل
                                                </button>
                                                <Link
                                                    to={`/file/${file.$id}`}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
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

export default Bookmarks;