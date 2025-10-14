import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hierarchyService } from '../../services/hierarchyService';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';
import { 
  ModernCard, 
  ModernButton, 
  ModernSkeleton,
  ModernAlert,
  ModernBadge
} from '../../components/modern/ModernComponents';

/**
 * 📚 Materials Page - Displays hierarchical materials
 * Shows: Categories → Subjects → Materials
 */
const MaterialsPage = () => {
  const navigate = useNavigate();
  const { categoryId, subjectId } = useParams();
  const { t } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [view, setView] = useState('categories'); // categories, subjects, materials
  
  // Subject search
  const [searchQuery, setSearchQuery] = useState('');
  const [allSubjects, setAllSubjects] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadData();
    loadAllSubjects();
  }, [categoryId, subjectId]);

  // Load all subjects for search
  const loadAllSubjects = async () => {
    try {
      const hierarchyData = await hierarchyService.getCompleteHierarchy();
      const subjects = hierarchyData.flatMap(cat => cat.subjects || []);
      setAllSubjects(subjects);
    } catch (err) {
      console.error('Error loading subjects:', err);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = allSubjects.filter(subject => 
        subject.nameAr.toLowerCase().includes(query.toLowerCase()) ||
        subject.nameEn.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Navigate to subject directly
  const handleSearchResultClick = (subject) => {
    navigate(`/materials/${subject.categoryId}/${subject.$id}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      if (subjectId) {
        // Load subject with materials
        const subjectData = await hierarchyService.getSubjectHierarchy(subjectId);
        setSelectedSubject(subjectData);
        setSelectedCategory(subjectData.category);
        setView('materials');
      } else if (categoryId) {
        // Load category with subjects
        const categoryData = await hierarchyService.getCategoryHierarchy(categoryId);
        setSelectedCategory(categoryData);
        setView('subjects');
      } else {
        // Load all categories
        const hierarchyData = await hierarchyService.getCompleteHierarchy();
        setHierarchy(hierarchyData);
        setView('categories');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('فشل تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/materials/${category.$id}`);
  };

  const handleSubjectClick = (subject) => {
    navigate(`/materials/${selectedCategory.$id}/${subject.$id}`);
  };

  const handleMaterialClick = (material) => {
    navigate(`/material/${material.$id}`);
  };

  const handleBackClick = () => {
    if (view === 'materials') {
      navigate(`/materials/${selectedCategory.$id}`);
    } else if (view === 'subjects') {
      navigate('/materials');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <ModernSkeleton lines={5} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ModernCard key={i} className="p-6">
                <ModernSkeleton lines={3} />
              </ModernCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <ModernAlert type="error" title="خطأ">
            {error}
          </ModernAlert>
          <ModernButton onClick={loadData} className="mt-4">
            إعادة المحاولة
          </ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Subject Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`🔍 ${t('materials.searchPlaceholder')}`}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
              🔍
            </span>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              {searchResults.map((subject) => (
                <button
                  key={subject.$id}
                  onClick={() => handleSearchResultClick(subject)}
                  className="w-full px-4 py-3 text-right hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getLocalizedValue(subject, 'name')}
                      </p>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">{t('materials.noResults')}</p>
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <button 
            onClick={() => navigate('/materials')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            {t('nav.materials')}
          </button>
          {selectedCategory && (
            <>
              <span className="text-gray-400">/</span>
              <button 
                onClick={() => navigate(`/materials/${selectedCategory.$id}`)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {getLocalizedValue(selectedCategory, 'name')}
              </button>
            </>
          )}
          {selectedSubject && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-300">
                {getLocalizedValue(selectedSubject, 'name')}
              </span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          {view === 'categories' && (
            <>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {t('materials.academicCategories')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('materials.searchPlaceholder')}
              </p>
            </>
          )}
          {view === 'subjects' && selectedCategory && (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl">{selectedCategory.icon}</span>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  {getLocalizedValue(selectedCategory, 'name')}
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {getLocalizedValue(selectedCategory, 'description')}
              </p>
              <div className="mt-4">
                <ModernBadge variant="info">
                  {selectedCategory.subjects?.length || 0} مادة دراسية
                </ModernBadge>
              </div>
            </>
          )}
          {view === 'materials' && selectedSubject && (
            <>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {getLocalizedValue(selectedSubject, 'name')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {getLocalizedValue(selectedSubject, 'description')}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <ModernBadge variant="info">
                  {selectedSubject.materials?.length || 0} ملف
                </ModernBadge>
                <ModernBadge variant="default">
                  {selectedSubject.creditHours} ساعة معتمدة
                </ModernBadge>
                <ModernBadge variant="default">
                  المستوى {selectedSubject.level}
                </ModernBadge>
              </div>
            </>
          )}
        </div>

        {/* Back Button */}
        {view !== 'categories' && (
          <ModernButton 
            onClick={handleBackClick}
            variant="outline"
            className="mb-6"
          >
            ← {t('common.back')}
          </ModernButton>
        )}

        {/* Categories View */}
        {view === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hierarchy.map((category) => (
              <ModernCard
                key={category.$id}
                hover
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer"
              >
                <div className="text-center p-6">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  >
                    <span className="text-2xl">{category.icon || '📚'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {category.nameAr || category.nameEn}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {category.descriptionAr || category.descriptionEn}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <ModernBadge variant="info">
                      {category.subjectsCount || 0} مادة
                    </ModernBadge>
                    <ModernBadge variant="success">
                      {category.materialsCount || 0} ملف
                    </ModernBadge>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}

        {/* Subjects View */}
        {view === 'subjects' && selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.subjects?.map((subject) => (
              <ModernCard
                key={subject.$id}
                hover
                onClick={() => handleSubjectClick(subject)}
                className="cursor-pointer"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {getLocalizedValue(subject, 'name')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {getLocalizedValue(subject, 'description')}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ModernBadge variant="info">
                      {subject.materialsCount || 0} {t('materials.files')}
                    </ModernBadge>
                    <ModernBadge variant="default">
                      {subject.creditHours} {t('materials.creditHours')}
                    </ModernBadge>
                    <ModernBadge variant="default">
                      {t('materials.level')} {subject.level}
                    </ModernBadge>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}

        {/* Materials View */}
        {view === 'materials' && selectedSubject && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSubject.materials?.length > 0 ? (
              selectedSubject.materials.map((material) => (
                <ModernCard
                  key={material.$id}
                  hover
                  onClick={() => handleMaterialClick(material)}
                  className="cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1">
                        {material.title}
                      </h3>
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {material.tags?.map((tag, index) => (
                        <ModernBadge key={index} variant="default">
                          {tag}
                        </ModernBadge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>📥 {material.downloadCount || 0} {t('dashboard.downloadCount')}</span>
                      <span>{(material.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </ModernCard>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t('materials.noFilesAvailable')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {view === 'categories' && hierarchy.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {t('materials.noCategoriesAvailable')}
            </p>
            <ModernButton onClick={loadData}>
              {t('common.reload')}
            </ModernButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
