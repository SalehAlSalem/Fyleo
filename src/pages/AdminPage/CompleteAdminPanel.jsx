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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                🎛️ {t('admin.panel.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('admin.panel.welcome')} {user?.name}
              </p>
            </div>
            <ModernBadge 
              variant={userRoles.includes('admin') ? 'success' : userRoles.includes('reviewer') ? 'info' : 'warning'} 
              className="text-lg px-4 py-2"
            >
              {getRoleDisplay()}
            </ModernBadge>
          </div>
          
          {currentTab && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <span className="font-bold">{currentTab.icon} {currentTab.label}:</span> {currentTab.description}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span className="text-3xl">{tab.icon}</span>
                  <span className="text-sm font-medium text-center">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CompleteAdminPanel;

