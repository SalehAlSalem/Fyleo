import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ModernCard, ModernButton, ModernBadge } from '../../components/modern/ModernComponents';
import CategoriesManagement from './CategoriesManagement';
import SubjectsManagement from './SubjectsManagement';
import MaterialsManagement from './MaterialsManagement';
import FileTypesManagement from './FileTypesManagement';
import UsersManagement from './UsersManagement';
import StatisticsDashboard from './StatisticsDashboard';

/**
 * 🎛️ Complete Admin Panel
 * - Only accessible to verified users with 'admin' label
 * - Full CRUD for Categories, Subjects, Materials
 * - Global materials management
 */
const CompleteAdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('statistics');

  const tabs = [
    { id: 'statistics', label: 'الإحصائيات', icon: '📊', description: 'نظرة عامة على المنصة' },
    { id: 'categories', label: 'التصنيفات', icon: '📁', description: 'إدارة التصنيفات الرئيسية' },
    { id: 'subjects', label: 'المواد الدراسية', icon: '📚', description: 'إدارة المواد والمقررات' },
    { id: 'materials', label: 'الملفات', icon: '📄', description: 'إدارة جميع الملفات المرفوعة' },
    { id: 'fileTypes', label: 'أنواع الملفات', icon: '🗂️', description: 'إدارة أنواع الملفات' },
    { id: 'users', label: 'المستخدمون', icon: '👥', description: 'إدارة المستخدمين' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <StatisticsDashboard />;
      case 'categories':
        return <CategoriesManagement />;
      case 'subjects':
        return <SubjectsManagement />;
      case 'materials':
        return <MaterialsManagement />;
      case 'fileTypes':
        return <FileTypesManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <StatisticsDashboard />;
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                🎛️ لوحة التحكم الإدارية
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                إدارة كاملة لمنصة Fyleo - مرحباً {user?.name}
              </p>
            </div>
            <ModernBadge variant="success" className="text-lg px-4 py-2">
              👤 مدير
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
