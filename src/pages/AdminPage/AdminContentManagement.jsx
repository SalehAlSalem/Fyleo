import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';
import { materialsService, postsService, usersService, bookmarksService, subjectsService } from "../../services/appwriteService";
import { StorageService } from "../../config/StorageService";
import CardModal from "../../features/library/components/CardModal";
import FilePreviewModal from "../../features/library/components/FilePreviewModal";
import EditModal from "./EditModal";

const AdminContentManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('materials');
  const [materials, setMaterials] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [subjects, setSubjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState(new Set());

  useEffect(() => {
    loadData();
    loadBookmarks();
  }, [activeTab]);



  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load subjects first
      const subjectsData = await subjectsService.getAll();
      const subjectsMap = {};
      subjectsData.forEach(subject => {
        subjectsMap[subject.$id] = subject.nameAr || subject.nameEn || 'Unknown';
      });
      setSubjects(subjectsMap);
      
      if (activeTab === 'materials') {
        const materialsData = await materialsService.getAll(1000);
        const uploaderIds = [...new Set(materialsData.map(m => m.uploaderId))];
        
        const usersData = {};
        for (const userId of uploaderIds) {
          try {
            const userData = await usersService.getById(userId);
            usersData[userId] = userData.name || 'Unknown';
          } catch (err) {
            usersData[userId] = 'Unknown';
          }
        }
        
        setUsers(usersData);
        setMaterials(materialsData);
      } else {
        const postsData = await postsService.getAll(1000);
        const uploaderIds = [...new Set(postsData.map(p => p.uploaderId))];
        
        const usersData = {};
        for (const userId of uploaderIds) {
          try {
            const userData = await usersService.getById(userId);
            usersData[userId] = userData.name || 'Unknown';
          } catch (err) {
            usersData[userId] = 'Unknown';
          }
        }
        
        setUsers(usersData);
        setPosts(postsData);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('admin.content.messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    if (!user) return;
    try {
      const bookmarksData = await bookmarksService.getUserBookmarks(user.$id);
      const bookmarkedIds = new Set(bookmarksData.map(b => b.materialId));
      setBookmarkedMaterials(bookmarkedIds);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const handleDelete = async (item) => {
    const confirmMessage = t('admin.content.confirmations.delete');
    
    if (!confirm(confirmMessage)) return;

    try {
      setError('');
      
      if (activeTab === 'materials') {
        if (item.fileId) {
          try {
            await StorageService.deleteFile(item.fileId);
          } catch (err) {
            console.warn('Error deleting file from storage:', err);
          }
        }
        
        try {
          const bookmarks = await bookmarksService.getByMaterial(item.$id);
          for (const bookmark of bookmarks) {
            await bookmarksService.delete(bookmark.$id);
          }
        } catch (err) {
          console.warn('Error deleting bookmarks:', err);
        }
        
        await materialsService.delete(item.$id);
        setSuccess(t('admin.content.messages.materialDeleted'));
      } else {
        await postsService.delete(item.$id);
        setSuccess(t('admin.content.messages.postDeleted'));
      }
      
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting:', err);
      setError(t('admin.content.messages.deleteError'));
    }
  };

  const openCard = (item) => {
    setSelectedItem(item);
    setIsCardOpen(true);
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleSave = async (itemId, updates) => {
    try {
      setError('');
      
      if (activeTab === 'materials') {
        await materialsService.update(itemId, updates);
        setSuccess('✅ تم تحديث الملف بنجاح');
      } else {
        await postsService.update(itemId, updates);
        setSuccess('✅ تم تحديث المنشور بنجاح');
      }
      
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating:', err);
      setError('❌ فشل تحديث العنصر');
      throw err;
    }
  };

  const handleBookmark = async (materialId) => {
    if (!user) return;
    
    try {
      if (bookmarkedMaterials.has(materialId)) {
        const bookmarks = await bookmarksService.getUserBookmarks(user.$id);
        const bookmark = bookmarks.find(b => b.materialId === materialId);
        if (bookmark) {
          await bookmarksService.delete(bookmark.$id);
          setBookmarkedMaterials(prev => {
            const newSet = new Set(prev);
            newSet.delete(materialId);
            return newSet;
          });
        }
      } else {
        await bookmarksService.create({
          userId: user.$id,
          materialId: materialId
        });
        setBookmarkedMaterials(prev => new Set([...prev, materialId]));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handlePreview = async () => {
    if (!selectedItem || activeTab !== 'materials') return;
    
    try {
      // Prepare material object with viewURL for FilePreviewModal
      let updatedMaterial = selectedItem;
      if (selectedItem.fileId && !selectedItem.viewURL) {
        const publicUrl = StorageService.getPublicURL(selectedItem.fileId);
        updatedMaterial = { ...selectedItem, viewURL: publicUrl };
      }
      
      // Open FilePreviewModal (same as library)
      setPreviewMaterial(updatedMaterial);
      setIsPreviewOpen(true);
      setIsCardOpen(false); // Close card modal
    } catch (err) {
      console.error('Error previewing file:', err);
      setError('❌ فشل معاينة الملف');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      calendar: 'gregory'
    });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📕', doc: '📘', docx: '📘', txt: '��',
      ppt: '📊', pptx: '📊', xls: '📗', xlsx: '📗',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️',
      mp4: '🎥', mp3: '🎵', zip: '📦'
    };
    return icons[ext] || '📄';
  };

  const getFilteredItems = () => {
    const items = activeTab === 'materials' ? materials : posts;
    if (!searchTerm.trim()) return items;
    
    const search = searchTerm.toLowerCase();
    return items.filter(item => {
      const title = item.title?.toLowerCase() || '';
      const description = item.description?.toLowerCase() || '';
      const uploaderName = users[item.uploaderId || item.userId]?.toLowerCase() || '';
      return title.includes(search) || description.includes(search) || uploaderName.includes(search);
    });
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="space-y-4">
        <ModernSkeleton lines={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <ModernCard key={i} className="p-6"><ModernSkeleton lines={4} /></ModernCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('admin.content.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.content.labels.viewAllContent')}</p>
        </div>
        <ModernBadge variant="info" className="text-lg px-4 py-2">
          {filteredItems.length} {activeTab === 'materials' ? t('admin.content.labels.file') : t('admin.content.labels.post')}
        </ModernBadge>
      </div>

      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      <div className="flex gap-2">
        <ModernButton variant={activeTab === 'materials' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('materials')} className="flex-1 md:flex-initial">
          📁 الملفات ({materials.length})
        </ModernButton>
        <ModernButton variant={activeTab === 'posts' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('posts')} className="flex-1 md:flex-initial">
          📝 المنشورات ({posts.length})
        </ModernButton>
      </div>

      <ModernInput type="text" placeholder="🔍 بحث حسب العنوان أو الوصف أو اسم المستخدم..."
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? t('admin.content.messages.noResults') : t('admin.content.messages.noContent')}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <ModernCard key={item.$id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl flex-shrink-0">
                  {activeTab === 'materials' ? getFileIcon(item.fileName) : '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1 line-clamp-2">
                    {item.title || item.contentText || t('admin.content.labels.untitled')}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {item.subjectId && subjects[item.subjectId] && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <span>📚</span>
                    <span className="truncate">{subjects[item.subjectId]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>👤</span>
                  <span className="truncate">{users[item.uploaderId] || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>📅</span><span>{formatDate(item.$createdAt)}</span>
                </div>
                {activeTab === 'materials' && item.fileName && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>📎</span><span className="truncate">{item.fileName}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <ModernButton size="sm" variant="outline" onClick={() => openCard(item)} className="flex-1">
                  {t('admin.content.actions.view')}
                </ModernButton>
                <ModernButton size="sm" variant="primary" onClick={() => openEdit(item)} className="flex-1">
                  {t('admin.content.actions.edit')}
                </ModernButton>
                <ModernButton size="sm" variant="danger" onClick={() => handleDelete(item)}>{t('admin.content.actions.delete')}</ModernButton>
              </div>
            </ModernCard>
          ))
        )}
      </div>

      {isCardOpen && selectedItem && (
        <CardModal 
          isOpen={isCardOpen} 
          onClose={() => { 
            setIsCardOpen(false); 
            setSelectedItem(null);
          }}
          material={activeTab === 'materials' ? { 
            ...selectedItem, 
            uploaderName: users[selectedItem.uploaderId],
            subjectName: subjects[selectedItem.subjectId]
          } : null}
          post={activeTab === 'posts' ? { 
            ...selectedItem, 
            uploaderName: users[selectedItem.uploaderId],
            subjectName: subjects[selectedItem.subjectId]
          } : null}
          onMaterialPreview={activeTab === 'materials' ? handlePreview : undefined}
          onBookmark={activeTab === 'materials' ? handleBookmark : undefined}
          isBookmarked={activeTab === 'materials' ? bookmarkedMaterials.has(selectedItem.$id) : false}
          materialLabels={{ 
            title: t('admin.content.labels.title'), 
            description: t('admin.content.labels.description'), 
            uploader: t('admin.content.labels.uploader'), 
            date: t('admin.content.labels.date'), 
            category: t('admin.content.labels.category'), 
            subject: t('admin.content.labels.subject'), 
            fileType: t('admin.content.labels.fileType'), 
            fileSize: t('admin.content.labels.fileSize'),
            preview: t('admin.content.labels.preview'),
            download: t('admin.content.labels.download'),
            bookmark: t('admin.content.labels.bookmark'),
            info: t('admin.content.labels.info'),
            size: t('admin.content.labels.size'),
            type: t('admin.content.labels.type'),
            downloads: t('admin.content.labels.downloads'),
            back: t('admin.common.buttons.back'),
            actions: t('admin.content.labels.actions') 
          }}
          postLabels={{ 
            title: t('admin.content.labels.post'), 
            description: t('admin.content.labels.description'), 
            author: t('admin.content.labels.author'), 
            date: t('admin.content.labels.date'), 
            link: t('admin.content.labels.link') 
          }}
        />
      )}

      {isEditOpen && selectedItem && (
        <EditModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          type={activeTab}
          onSave={handleSave}
        />
      )}

      {/* File Preview Modal - Same as Library */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewMaterial(null);
        }}
        fileUrl={previewMaterial?.viewURL || ''}
        fileName={previewMaterial?.fileName || ''}
        mimeType={previewMaterial?.mimeType}
        title={previewMaterial?.title || ''}
        onDownload={async () => {
          if (!previewMaterial?.viewURL) return;
          try {
            const response = await fetch(previewMaterial.viewURL);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = previewMaterial.fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          } catch (error) {
            console.error('Download error:', error);
            window.open(previewMaterial.viewURL, '_blank');
          }
        }}
      />
    </div>
  );
};

export default AdminContentManagement;
