import React, { useState, useEffect } from 'react';
import { ModernCard } from '../../components/modern/ModernComponents';
import AdminService from '../../config/AdminService';
import CategoriesManagement from './CategoriesManagement';
import MaterialsManagement from './MaterialsManagement';
import FilesManagement from './FilesManagement';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMaterials: 0,
    totalSubjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const adminStats = await AdminService.getAdminStats();
      setStats(adminStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'categories', label: 'إدارة الفئات والمواد', icon: '📂' },
    { id: 'materials', label: 'إدارة المواد الدراسية', icon: '📚' },
    { id: 'files', label: 'إدارة الملفات المرفوعة', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🛠️ لوحة التحكم الإدارية
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة الفئات، المواد الدراسية، والملفات المرفوعة
          </p>
        </div>

        {/* Statistics Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ModernCard className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">إجمالي الفئات</p>
                  <p className="text-3xl font-bold">{stats.totalCategories}</p>
                </div>
                <div className="text-5xl opacity-50">📂</div>
              </div>
            </ModernCard>

            <ModernCard className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">إجمالي المواد</p>
                  <p className="text-3xl font-bold">{stats.totalMaterials}</p>
                </div>
                <div className="text-5xl opacity-50">📚</div>
              </div>
            </ModernCard>

            <ModernCard className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">إجمالي المقررات</p>
                  <p className="text-3xl font-bold">{stats.totalSubjects}</p>
                </div>
                <div className="text-5xl opacity-50">📖</div>
              </div>
            </ModernCard>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'categories' && <CategoriesManagement onUpdate={loadStats} />}
          {activeTab === 'materials' && <MaterialsManagement onUpdate={loadStats} />}
          {activeTab === 'files' && <FilesManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
