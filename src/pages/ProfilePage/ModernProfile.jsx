import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { account } from '../../config/appwrite';
import { DatabaseService } from '../../config/DatabaseService';
import { formatDate as formatDateUtil } from '../../utils/dateFormatter';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  ModernAlert
} from '../../components/modern/ModernComponents';

const ModernProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalSize: 0
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (user) {
      setNewName(user.name || '');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const filesResponse = await DatabaseService.getUserFiles(user.$id);
      const files = filesResponse.documents || [];
      
      const totalDownloads = await DatabaseService.getUserDownloadedFilesCount(user.$id);
      
      const stats = {
        totalFiles: files.length,
        totalDownloads: totalDownloads,
        totalSize: files.reduce((sum, file) => sum + (file.fileSize || 0), 0)
      };
      
      setUserStats(stats);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      showMessage(t('common.error'), 'error');
      return;
    }

    try {
      await account.updateName(newName);
      showMessage(`✅ ${t('profile.updateSuccess')}`, 'success');
      setEditMode(false);
      window.location.reload(); // لتحديث الاسم في الهيدر
    } catch (error) {
      console.error('❌ Error updating name:', error);
      showMessage(`❌ ${t('profile.updateError')}`, 'error');
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = async () => {
    if (confirm(t('messages.deleteConfirm'))) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return formatDateUtil(timestamp, i18n.language);
  };

  // Quick links
  const quickLinks = [
    { name: t('nav.home'), path: '/', icon: '🏠', color: 'blue' },
    { name: t('nav.materials'), path: '/materials', icon: '📚', color: 'purple' },
    { name: t('nav.dashboard'), path: '/dashboard', icon: '📊', color: 'green' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <ModernCard className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('auth.dontHaveAccount')}
          </p>
          <ModernButton onClick={() => navigate('/login')}>
            {t('nav.login')}
          </ModernButton>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('profile.myProfile')}
          </p>
        </div>

        {message && (
          <ModernAlert type={messageType} className="mb-6">
            {message}
          </ModernAlert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ModernCard className="p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '👤'}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-gray-800"></div>
              </div>

              {/* Name Edit */}
              {editMode ? (
                <div className="space-y-3 mb-4">
                  <ModernInput
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t('auth.name')}
                    className="text-center"
                  />
                  <div className="flex gap-2">
                    <ModernButton 
                      onClick={handleUpdateName}
                      size="sm"
                      className="flex-1"
                    >
                      {t('common.save')}
                    </ModernButton>
                    <ModernButton 
                      onClick={() => {
                        setEditMode(false);
                        setNewName(user.name || '');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {t('common.cancel')}
                    </ModernButton>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.name || t('common.user')}
                  </h2>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    ✒️ {t('profile.editName')}
                  </button>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {user.email}
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span>📅</span>
                <span>{t('profile.joinedOn')} {formatDate(user.$createdAt)}</span>
              </div>

              <ModernButton 
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🚪 {t('nav.logout')}
              </ModernButton>
            </ModernCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModernCard className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <div className="text-4xl mb-2">📁</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {loading ? '...' : userStats.totalFiles}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dashboard.filesUploaded')}
                </div>
              </ModernCard>

              <ModernCard className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <div className="text-4xl mb-2">📥</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {loading ? '...' : userStats.totalDownloads}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dashboard.downloadCount')}
                </div>
              </ModernCard>

              <ModernCard className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <div className="text-4xl mb-2">💾</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {loading ? '...' : formatFileSize(userStats.totalSize)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dashboard.storageUsed')}
                </div>
              </ModernCard>
            </div>

            {/* Quick Links */}
            <ModernCard className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>{t('profile.quickLinks')}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      link.color === 'blue' 
                        ? 'border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : link.color === 'purple'
                        ? 'border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        : 'border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{link.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {link.name}
                    </div>
                  </button>
                ))}
              </div>
            </ModernCard>

            {/* Account Info */}
            <ModernCard className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                <span>{t('profile.accountInfo')}</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.userId')}</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {user.$id.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.emailAddress')}</span>
                  <span className="text-gray-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.verificationStatus')}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.emailVerification 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {user.emailVerification ? `✅ ${t('profile.verified')}` : `⏳ ${t('profile.notVerified')}`}
                  </span>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;
