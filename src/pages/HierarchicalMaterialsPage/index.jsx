import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { CategoryService } from '../../config/CategoryService';
import { DatabaseService } from '../../config/DatabaseService';
import { useAuth } from '../../hooks/useAuth';
import { NavBar, Footer, BackToTop } from '../../components';
import PDFViewer from '../../components/PDFViewer/index.jsx';

const HierarchicalMaterialsPage = () => {
  const { categoryId, subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState(null);
  const [fileTypes, setFileTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  // البيانات المرسلة من الصفحة السابقة
  const {
    categoryName,
    categoryIcon,
    categoryColor,
    subjectName,
    subjectDescription,
    subjectLevel,
    subjectCreditHours
  } = location.state || {};

  useEffect(() => {
    if (categoryId && subjectId) {
      fetchData();
    }
  }, [categoryId, subjectId]);

  useEffect(() => {
    filterMaterials();
  }, [materials, selectedFileType, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // فك تشفير اسم المادة من الـ URL
      const decodedSubjectName = decodeURIComponent(subjectId);
      console.log('🔍 URL params:', { categoryId, subjectId, decodedSubjectName });
      
      // جلب بيانات التصنيف وأنواع الملفات
      const [categoryResponse, fileTypesResponse] = await Promise.all([
        CategoryService.getCategoryById(categoryId),
        CategoryService.getAllFileTypes()
      ]);
      
      setCategory(categoryResponse);
      setFileTypes(fileTypesResponse.documents);
      
      // محاولة جلب بيانات المادة (استخدام البيانات من location.state)
      setSubject({
        nameAr: subjectName || decodedSubjectName,
        nameEn: '',
        description: subjectDescription || '',
        level: subjectLevel || '',
        creditHours: subjectCreditHours || ''
      });
      
      // جلب الملفات الخاصة بالتصنيف والمادة معاً
      const actualSubjectName = subjectName || decodedSubjectName;
      console.log('🔍 Fetching materials with:', { categoryId, subjectName: actualSubjectName });
      
      const materialsResponse = await CategoryService.getFilesByCategoryAndSubject(categoryId, actualSubjectName);
      console.log('📊 Materials response:', materialsResponse);
      setMaterials(materialsResponse.documents || []);
      
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;
    
    console.log('🔍 Filtering materials:', {
      totalMaterials: materials.length,
      selectedFileType,
      searchQuery
    });

    // فلترة حسب نوع الملف
    if (selectedFileType !== 'all') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(material => material.fileTypeId === selectedFileType);
      console.log(`📊 File type filter: ${beforeFilter} → ${filtered.length} (fileTypeId: ${selectedFileType})`);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const beforeFilter = filtered.length;
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(material => 
        material.title?.toLowerCase().includes(query) ||
        material.fileName?.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query)
      );
      console.log(`🔍 Search filter: ${beforeFilter} → ${filtered.length} (query: "${query}")`);
    }

    console.log('✅ Final filtered materials:', filtered.length);
    setFilteredMaterials(filtered);
  };

  const getFileTypeInfo = (fileTypeId) => {
    return fileTypes.find(ft => ft.$id === fileTypeId) || { nameAr: 'غير محدد', icon: '📄', color: '#6B7280' };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'غير محدد';
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    let i = 0;
    while (bytes >= 1024 && i < sizes.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const handleFilePreview = (material) => {
    if (material.mimeType === 'application/pdf') {
      setPreviewFile(material);
    } else {
      // فتح الملف في نافذة جديدة
      window.open(material.downloadURL, '_blank');
    }
  };

  const handleFileDownload = async (material) => {
    console.log('🔍 handleFileDownload called with material:', material);
    console.log('🔍 User:', user);
    console.log('🔍 Material downloadURL:', material.downloadURL);
    
    try {
      // تسجيل التحميل في Downloads Collection
      if (user) {
        await DatabaseService.createDownload({
          userId: user.$id,
          fileId: material.$id
        });
        console.log('✅ Download recorded in downloads collection');
      } else {
        console.log('⚠️ No user logged in, skipping download recording');
      }
      
      // تحميل الملف مباشرة (أزلنا incrementDownloadCount لأنه يسبب خطأ)
      if (material.downloadURL) {
        console.log('📥 Starting download...');
        
        const link = document.createElement('a');
        link.href = material.downloadURL;
        link.download = material.fileName || material.title || 'file';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Download initiated successfully');
      } else {
        console.error('❌ No downloadURL found for material:', material);
        alert('رابط التحميل غير متوفر');
      }
    } catch (err) {
      console.error('Error in download process:', err);
      
      // حتى لو فشل التسجيل، جرب التحميل المباشر
      if (material.downloadURL) {
        console.log('🔄 Attempting direct download despite error...');
        window.open(material.downloadURL, '_blank');
      } else {
        alert('خطأ في تحميل الملف: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category || !subject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            المادة غير موجودة
          </h2>
          <Link to="/categories" className="text-blue-600 hover:text-blue-800">
            العودة للتصنيفات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-600 dark:text-gray-400">
            <Link to="/categories" className="hover:text-blue-600">التصنيفات</Link>
            <span className="mx-2">/</span>
            <Link to={`/subjects/${categoryId}`} className="hover:text-blue-600">
              {category.nameAr}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{subject.nameAr}</span>
          </nav>
        </div>
      </div>

      {/* Subject Header */}
      <div 
        className="text-white py-12"
        style={{ backgroundColor: category.color || '#3B82F6' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">{category.icon || '📁'}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{subject.nameAr}</h1>
              <p className="text-lg opacity-90">{subject.nameEn}</p>
            </div>
          </div>
          
          {subject.description && (
            <p className="text-lg opacity-80 mt-4 max-w-3xl">
              {subject.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-3 mt-6">
            {subject.creditHours && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {subject.creditHours} ساعة معتمدة
              </span>
            )}
            {subject.level && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {subject.level}
              </span>
            )}
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {materials.length} ملف
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 البحث في الملفات
              </label>
              <input
                type="text"
                placeholder="البحث في الملفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* File Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📂 تصفية حسب نوع الملف
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedFileType('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFileType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  جميع الملفات ({materials.length})
                </button>
                
                {fileTypes.map((fileType) => {
                  const count = materials.filter(m => m.fileTypeId === fileType.$id).length;
                  if (count === 0) return null;
                  
                  return (
                    <button
                      key={fileType.$id}
                      onClick={() => setSelectedFileType(fileType.$id)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedFileType === fileType.$id
                          ? 'text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                      style={selectedFileType === fileType.$id ? { backgroundColor: fileType.color } : {}}
                    >
                      <span>{fileType.icon || '📄'}</span>
                      {fileType.nameAr} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material) => {
            const fileTypeInfo = getFileTypeInfo(material.fileTypeId);
            
            console.log('📋 Material render info:', {
              title: material.title,
              fileTypeId: material.fileTypeId,
              fileTypeInfo
            });
            
            return (
              <div
                key={material.$id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* File Type Header */}
                <div 
                  className="p-4 text-white relative"
                  style={{ backgroundColor: fileTypeInfo.color }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{fileTypeInfo.icon}</span>
                    <span className="text-sm opacity-90 font-medium">{fileTypeInfo.nameAr}</span>
                  </div>
                  {/* نوع الملف كلايبل واضح */}
                  <div className="absolute top-2 right-2 bg-black/20 px-2 py-1 rounded text-xs">
                    {fileTypeInfo.nameAr}
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{fileTypeInfo.icon}</span>
                      <span className="font-medium" style={{ color: fileTypeInfo.color }}>
                        {fileTypeInfo.nameAr}
                      </span>
                    </div>
                    <div>📁 {material.fileName}</div>
                    <div>📊 {formatFileSize(material.fileSize)}</div>
                    <div>📅 {formatDate(material.$createdAt)}</div>
                  </div>

                  {material.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {material.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilePreview(material)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      👁️ معاينة
                    </button>
                    <button
                      onClick={() => handleFileDownload(material)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      📥 تحميل
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {selectedFileType === 'all' ? '📄' : fileTypes.find(ft => ft.$id === selectedFileType)?.icon || '📄'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedFileType === 'all' 
                ? 'لا توجد ملفات في هذه المادة'
                : `لا توجد ملفات من نوع ${fileTypes.find(ft => ft.$id === selectedFileType)?.nameAr || 'هذا النوع'}`
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedFileType === 'all'
                ? 'لم يتم رفع أي ملفات لهذه المادة بعد'
                : 'جرب اختيار نوع ملف آخر أو تصفح جميع الملفات'
              }
            </p>
            {selectedFileType !== 'all' && (
              <button
                onClick={() => setSelectedFileType('all')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                عرض جميع الملفات
              </button>
            )}
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewFile && (
        <PDFViewer
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      <BackToTop />
      <Footer />
    </div>
  );
};

export default HierarchicalMaterialsPage;