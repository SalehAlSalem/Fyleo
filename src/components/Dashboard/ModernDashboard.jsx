import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ModernCard, ModernButton } from '../modern/ModernComponents';

const ModernDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>غير مصرح له بالدخول</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ModernCard className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 مرحباً في لوحة التحكم!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            مرحباً، {user.name || user.email}
          </p>
          <p className="text-green-600 dark:text-green-400 mb-8">
            ✅ تم تفعيل مصادقة Appwrite بنجاح!
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                معلومات المستخدم:
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>ID:</strong> {user.$id}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>البريد الإلكتروني:</strong> {user.email}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>تاريخ الإنشاء:</strong> {new Date(user.$createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
            
            <ModernButton 
              onClick={handleLogout}
              variant="outline"
              className="mt-4"
            >
              تسجيل الخروج
            </ModernButton>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default ModernDashboard;