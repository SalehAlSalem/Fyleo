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
 * 🎛️ Admin Panel - Complete Management Dashboard
 */
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('statistics');

  const tabs = [
    { id: 'statistics', label: 'الإحصائيات', icon: '📊' },
    { id: 'categories', label: 'التصنيفات', icon: '📁' },
    { id: 'subjects', label: 'المواد الدراسية', icon: '📚' },
    { id: 'materials', label: 'الملفات', icon: '📄' },
    { id: 'fileTypes', label: 'أنواع الملفات', icon: '🗂️' },
    { id: 'users', label: 'المستخدمون', icon: '👥' }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            إدارة كاملة لمنصة Fyleo
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <ModernButton
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </ModernButton>
          ))}
        </div>

        {/* Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
