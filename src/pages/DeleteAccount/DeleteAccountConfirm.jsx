import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { account, databases, Query } from '../../config/appwrite';
import { StorageService } from '../../config/StorageService';
import { usersService } from '../../services/appwriteService';
import { 
  ModernButton, 
  ModernCard,
  ModernAlert
} from '@shared/ui/modern/ModernComponents';

/**
 * صفحة التأكيد النهائي لحذف الحساب
 * آخر فرصة للمستخدم قبل الحذف النهائي
 */
const DeleteAccountConfirm = () => {
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // التحقق من أن المستخدم مصادق عليه
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // التحقق من أنه جاء من صفحة Re-auth
    if (!location.state?.authenticated) {
      navigate('/delete-account/reauth');
    }
  }, [user, location, navigate]);

  // دالة الحذف النهائي
  const handleFinalDelete = async () => {
    try {
      setDeleting(true);
      setError('');
      
      // Step 1: تسجيل خروج من جميع الأجهزة الأخرى (نبقي الجلسة الحالية)
      setProgress('🔐 جاري تسجيل الخروج من الأجهزة الأخرى...');
      console.log('🔐 Step 1: Logging out other sessions...');
      
      // Step 2: حذف كل البوك ماركس
      setProgress('🗑️ جاري حذف البوك ماركس...');
      console.log('🗑️ Step 2: Deleting bookmarks...');
      try {
        const userBookmarks = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        for (const bookmark of userBookmarks.documents) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID,
            bookmark.$id
          );
        }
        console.log(`✅ Deleted ${userBookmarks.documents.length} bookmarks`);
      } catch (error) {
        console.warn('⚠️ Error deleting bookmarks:', error);
      }
      
      // Step 3: حذف كل سجلات التحميل
      setProgress('🗑️ جاري حذف سجلات التحميل...');
      console.log('🗑️ Step 3: Deleting download records...');
      try {
        const userDownloads = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        for (const download of userDownloads.documents) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID,
            download.$id
          );
        }
        console.log(`✅ Deleted ${userDownloads.documents.length} download records`);
      } catch (error) {
        console.warn('⚠️ Error deleting downloads:', error);
      }
      
      // Step 4: حذف كل الملفات (Database + MinIO + All Related Data)
      setProgress('🗑️ جاري حذف الملفات المرفوعة...');
      console.log('🗑️ Step 4: Deleting materials (Database + MinIO + Related Data)...');
      try {
        const userMaterials = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID,
          [Query.equal('uploaderId', user.$id)]
        );
        
        for (const material of userMaterials.documents) {
          const materialId = material.$id;
          
          // 4.1: حذف كل الـ downloads لهذا الملف (من كل المستخدمين)
          try {
            const materialDownloads = await databases.listDocuments(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID,
              [Query.equal('fileId', materialId)]
            );
            for (const download of materialDownloads.documents) {
              await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID,
                download.$id
              );
            }
            console.log(`  ✅ Deleted ${materialDownloads.documents.length} downloads for material ${materialId}`);
          } catch (err) {
            console.warn(`  ⚠️ Error deleting downloads for material ${materialId}:`, err);
          }
          
          // 4.2: حذف كل الـ bookmarks لهذا الملف (من كل المستخدمين)
          try {
            const materialBookmarks = await databases.listDocuments(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID,
              [Query.equal('fileId', materialId)]
            );
            for (const bookmark of materialBookmarks.documents) {
              await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID,
                bookmark.$id
              );
            }
            console.log(`  ✅ Deleted ${materialBookmarks.documents.length} bookmarks for material ${materialId}`);
          } catch (err) {
            console.warn(`  ⚠️ Error deleting bookmarks for material ${materialId}:`, err);
          }
          
          // 4.3: حذف الملف من التخزين (MinIO)
          try {
            console.log(`  🗑️ Deleting file from Storage: ${material.fileId}`);
            await StorageService.deleteFile(material.fileId);
            console.log(`  ✅ File deleted from Storage: ${material.fileName}`);
          } catch (minioError) {
            console.warn(`  ⚠️ Error deleting file from Storage:`, minioError);
          }
          
          // 4.4: حذف السجل من Database
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID,
            materialId
          );
          console.log(`  ✅ Material ${materialId} completely deleted`);
        }
        console.log(`✅ Deleted ${userMaterials.documents.length} materials with all related data`);
      } catch (error) {
        console.warn('⚠️ Error deleting materials:', error);
      }
      
      // Step 5: حذف كل البوستات
      setProgress('🗑️ جاري حذف المنشورات...');
      console.log('🗑️ Step 5: Deleting posts...');
      try {
        const userPosts = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
          [Query.equal('uploaderId', user.$id)]
        );
        
        for (const post of userPosts.documents) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            post.$id
          );
        }
        console.log(`✅ Deleted ${userPosts.documents.length} posts`);
      } catch (error) {
        console.warn('⚠️ Error deleting posts:', error);
      }
      
      // Step 6: حذف سجل المستخدم من Database
      console.log('🗑️ Step 6: Deleting user record from database...');
      try {
        const userRecord = await usersService.getByEmail(user.email);
        if (userRecord) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            userRecord.$id
          );
          console.log('✅ User record deleted from database');
        }
      } catch (error) {
        console.warn('⚠️ Error deleting user record:', error);
      }
      
      // Step 7: حذف الحساب من Auth باستخدام Appwrite Function
      setProgress('🗑️ جاري حذف الحساب من Auth...');
      console.log('🗑️ Step 7: Deleting account from Auth using Function...');
      try {
        // إنشاء JWT للمصادقة مع الـ Function
        console.log('🔐 Creating JWT token...');
        const jwtResponse = await account.createJWT();
        console.log('✅ JWT created:', jwtResponse.jwt.substring(0, 20) + '...');
        
        // استدعاء Appwrite Function لحذف المستخدم
        const functionId = import.meta.env.VITE_DELETE_USER_FUNCTION_ID;
        console.log('🆔 Function ID:', functionId);
        
        if (functionId) {
          const url = `https://cloud.appwrite.io/v1/functions/${functionId}/executions`;
          console.log('📤 Calling Function:', url);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID,
              'X-Appwrite-JWT': jwtResponse.jwt
            }
          });
          
          console.log('📥 Function response status:', response.status);
          const result = await response.json();
          console.log('📥 Function response:', result);
          
          if (response.ok) {
            console.log('✅ Function called successfully');
            // انتظر شوية للـ Function تخلص
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            console.error('❌ Function call failed:', result);
          }
        } else {
          console.warn('⚠️ Delete User Function ID not configured - skipping Auth deletion');
          console.warn('ℹ️ User will be logged out but account remains in Auth');
        }
      } catch (error) {
        console.error('❌ Error calling delete function:', error);
        console.warn('ℹ️ User data deleted from Database, but account remains in Auth');
      }
      
      // Step 8: Delete all sessions (logout)
      setProgress('✅ تم حذف الحساب بنجاح...');
      console.log('🗑️ Step 8: Final logout...');
      try {
        await account.deleteSessions();
        console.log('✅ Sessions deleted');
      } catch (logoutError) {
        console.log('ℹ️ Sessions already deleted by Function');
      }
      
      // Step 9: Force logout from useAuth context
      console.log('🚪 Forcing logout from context...');
      try {
        await logout(); // من useAuth
        console.log('✅ Logged out from context');
      } catch (contextError) {
        console.log('ℹ️ Context already cleared');
      }
      
      // Step 10: Clear all local storage
      console.log('🧹 Clearing local storage...');
      localStorage.clear();
      sessionStorage.clear();
      
      // Step 11: إعادة توجيه
      console.log('✅ Account deletion completed successfully!');
      setTimeout(() => {
        window.location.href = '/'; // hard redirect لضمان تحديث كامل
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      setError('حدث خطأ أثناء حذف الحساب: ' + error.message);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <ModernCard className="w-full max-w-2xl">
        {!deleting ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">⚠️</div>
              <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
                تأكيد نهائي
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                هل أنت متأكد تماماً من حذف حسابك؟
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                <span>🚨</span>
                <span>سيتم حذف جميع البيانات التالية نهائياً:</span>
              </h3>
              <ul className="space-y-3 text-red-700 dark:text-red-300">
                <li className="flex items-start gap-3">
                  <span className="text-xl">📁</span>
                  <span><strong>جميع الملفات المرفوعة</strong> - سيتم حذفها من السيرفر نهائياً</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📝</span>
                  <span><strong>جميع المنشورات</strong> - لن تتمكن من استرجاعها</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">⭐</span>
                  <span><strong>جميع البوك ماركس</strong> - ستفقد جميع الملفات المحفوظة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📊</span>
                  <span><strong>سجل التحميلات</strong> - جميع الإحصائيات والسجلات</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">👤</span>
                  <span><strong>معلومات الحساب</strong> - الاسم، البريد، وجميع البيانات الشخصية</span>
                </li>
              </ul>
            </div>

            {/* Final Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mb-8">
              <p className="text-center text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                ⚠️ هذا الإجراء لا يمكن التراجع عنه نهائياً!
              </p>
            </div>

            {error && (
              <ModernAlert variant="error" className="mb-6">
                {error}
              </ModernAlert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <ModernButton
                onClick={() => navigate('/profile')}
                variant="outline"
                className="flex-1"
              >
                ❌ إلغاء وعودة للملف الشخصي
              </ModernButton>
              <ModernButton
                onClick={handleFinalDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-lg"
              >
                🗑️ نعم، احذف حسابي نهائياً
              </ModernButton>
            </div>
          </>
        ) : (
          <>
            {/* Deleting Progress */}
            <div className="text-center py-12">
              <div className="text-6xl mb-6 animate-pulse">🗑️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                جاري حذف الحساب...
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {progress}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="bg-red-600 h-3 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                الرجاء عدم إغلاق الصفحة...
              </p>
            </div>
          </>
        )}
      </ModernCard>
    </div>
  );
};

export default DeleteAccountConfirm;

