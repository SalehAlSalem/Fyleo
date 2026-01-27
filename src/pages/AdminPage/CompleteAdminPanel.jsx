import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { ModernCard, ModernButton, ModernBadge } from '@shared/ui/modern/ModernComponents';
import { account, teams } from '../../config/appwrite';
import CategoriesManagement from './CategoriesManagement';
import SubjectsManagement from './SubjectsManagement';
import AdminContentManagement from './AdminContentManagement';
import FileTypesManagement from './FileTypesManagement';
import UsersManagement from './UsersManagement';
import StatisticsDashboard from './StatisticsDashboard';
import EducationalPurposesManagement from './EducationalPurposesManagement';

/**
 * 🎛️ Complete Admin Panel - Role-Based Access Control
 * 
 * Access Levels:
 * 1. Admin (Label: 'admin') - Full Access to all tabs
 * 2. Reviewer (Team: 'reviewer-team') - Content Management only
 * 3. Content Manager (Team: 'content_manager') - Categories & Subjects only
 */
const CompleteAdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [userRoles, setUserRoles] = useState([]); // Changed to array to support multiple roles
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    checkUserPermissions();
  }, [user]);

  const checkUserPermissions = async () => {
    if (!user) return;

    try {
      // Get user's prefs to check for admin label
      const prefs = await account.getPrefs();
      const labels = user.labels || [];
      
      // Get user's teams using the teams service
      const userTeamsList = await teams.list();
      const teamIds = userTeamsList.teams.map(t => t.$id);
      setUserTeams(teamIds);

      // Collect all roles (user can have multiple!)
      const roles = [];
      
      if (labels.includes('admin')) {
        roles.push('admin');
      }
      
      if (teamIds.includes('reviewer-team')) {
        roles.push('reviewer');
      }
      
      if (teamIds.includes('content_manager')) {
        roles.push('content_manager');
      }
      
      setUserRoles(roles);
      
      // Set default tab based on highest priority role
      if (roles.includes('admin')) {
        setActiveTab('statistics');
      } else if (roles.includes('reviewer')) {
        setActiveTab('materials');
      } else if (roles.includes('content_manager')) {
        setActiveTab('categories');
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  // All available tabs with their access requirements
  const allTabs = [
    { id: 'statistics', label: t('admin.panel.statistics.title'), icon: '📊', description: t('admin.panel.statistics.title'), roles: ['admin'] },
    { id: 'categories', label: t('admin.panel.tabs.categories'), icon: '📁', description: t('admin.categories.title'), roles: ['admin', 'content_manager'] },
    { id: 'subjects', label: t('admin.panel.tabs.materials'), icon: '📚', description: t('admin.panel.tabs.materials'), roles: ['admin', 'content_manager'] },
    { id: 'materials', label: t('admin.panel.tabs.content'), icon: '📄', description: t('admin.content.title'), roles: ['admin', 'reviewer'] },
    { id: 'fileTypes', label: t('materials.fileTypes'), icon: '🗂️', description: t('materials.fileTypes'), roles: ['admin'] },
    { id: 'purposes', label: t('materials.educationalPurposes'), icon: '🎯', description: t('materials.educationalPurposes'), roles: ['admin'] },
    { id: 'users', label: t('admin.panel.tabs.users'), icon: '👥', description: t('admin.users.title'), roles: ['admin'] }
  ];

  // Filter tabs based on user roles (user can have multiple roles!)
  const tabs = allTabs.filter(tab => 
    tab.roles.some(role => userRoles.includes(role))
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <StatisticsDashboard />;
      case 'categories':
        return <CategoriesManagement />;
      case 'subjects':
        return <SubjectsManagement />;
      case 'materials':
        return <AdminContentManagement />;
      case 'fileTypes':
        return <FileTypesManagement />;
      case 'purposes':
        return <EducationalPurposesManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <StatisticsDashboard />;
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  // Show loading while checking permissions
  if (userRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t('admin.common.messages.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error if no access
  if (tabs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t('admin.panel.roles.noPermissions')}</p>
        </div>
      </div>
    );
  }

  // Get role display text
  const getRoleDisplay = () => {
    if (userRoles.includes('admin')) {
      return t('admin.panel.roles.systemAdmin');
    }
    
    const roleNames = [];
    if (userRoles.includes('reviewer')) roleNames.push(t('admin.panel.roles.contentReviewer'));
    if (userRoles.includes('content_manager')) roleNames.push(t('admin.panel.roles.contentManager'));
    
    return roleNames.length > 0 ? roleNames.join(' + ') : t('common.user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Premium Glass Header */}
        <div className="mb-8 backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎛️</span>
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white mb-1 tracking-tight">
                    {t('admin.panel.title')}
                  </h1>
                  <p className="text-xl text-white/80 font-medium">
                    {t('admin.panel.welcome')} <span className="text-yellow-300 font-bold">{user?.name}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ${
                userRoles.includes('admin') 
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' 
                  : userRoles.includes('reviewer') 
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
              }`}>
                {getRoleDisplay()}
              </div>
              <div className="text-sm text-white/60">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          {currentTab && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{currentTab.icon}</div>
                <div>
                  <p className="text-white font-bold text-lg">{currentTab.label}</p>
                  <p className="text-white/70 text-sm">{currentTab.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Tabs with Glassmorphism */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl p-3 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-500 transform hover:scale-105
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105' 
                      : 'bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/10'
                    }
                  `}
                >
                  {/* Glow Effect on Active */}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-50 -z-10"></div>
                  )}
                  
                  <div className={`text-4xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </div>
                  <span className="text-sm font-bold text-center leading-tight">{tab.label}</span>
                  
                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area with Glass Effect */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAdminPanel;

