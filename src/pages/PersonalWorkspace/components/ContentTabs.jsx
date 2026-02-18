import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../../../config/pocketbase';
import SmartSubjectSearch from '../../../components/SmartSubjectSearch/SmartSubjectSearch';
import './ContentTabs.css';
import CardModal from '../../../features/library/components/CardModal';
import FilePreviewModal from '../../../features/library/components/FilePreviewModal';

/**
 * ✨ Content Management Tabs - Premium Edition
 * Animated Tabs with Sliding Indicator + Smooth Transitions
 * Inspired by Landing Page & GPA Calculator
 */
const ContentTabs = ({ files, links, bookmarks, onRefresh, userId }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('files');
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [fileTypes, setFileTypes] = useState([]);
  const [educationalPurposes, setEducationalPurposes] = useState([]);
  const [validationError, setValidationError] = useState('');
  
  // Multi-select state
  const [selectedItems, setSelectedItems] = useState([]);
  const [showContextBar, setShowContextBar] = useState(false);
  
  // Download counts for each file
  const [downloadCounts, setDownloadCounts] = useState({});
  
  // Subject names cache
  const [subjectNames, setSubjectNames] = useState({});
  
  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch file types and educational purposes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileTypesData = await pb.collection('fileTypes').getFullList({
          sort: 'name',
        });
        console.log('📦 File Types loaded in ContentTabs:', fileTypesData);
        setFileTypes(fileTypesData || []);
        
        const purposesData = await pb.collection('educationalPurposes').getFullList({
          filter: 'linkAllowed = true',
          sort: 'name',
        });
        console.log('🎯 Educational Purposes loaded in ContentTabs:', purposesData);
        setEducationalPurposes(purposesData || []);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  // Fetch subject names and objects for all content
  useEffect(() => {
    const fetchSubjectNames = async () => {
      const subjectIds = new Set();
      
      // Collect subject IDs from all content
      [...files, ...links, ...bookmarks].forEach(item => {
        if (item.subjectId) subjectIds.add(item.subjectId);
      });
      
      if (subjectIds.size === 0) return;
      
      try {
        const names = {};
        const objects = {};
        
        // Fetch each subject name and store the object
        for (const id of subjectIds) {
          try {
            const subject = await pb.collection('subjects').getOne(id);
            names[id] = i18n.language === 'ar' ? subject.nameAr : subject.nameEn;
            objects[id] = subject;
          } catch (error) {
            console.error(`Error fetching subject ${id}:`, error);
            names[id] = '—';
          }
        }
        
        setSubjectNames(names);
        // Store subjects in a ref or state for filter
        window.__subjectsCache = objects;
      } catch (error) {
        console.error('Error loading subject names:', error);
      }
    };
    
    fetchSubjectNames();
  }, [files, links, bookmarks, i18n.language]);
  
  // Load download counts for all files, including bookmarked files
  useEffect(() => {
    const loadDownloadCounts = async () => {
      const fileIds = new Set();
      if (files && files.length > 0) {
        for (const f of files) fileIds.add(f.id);
      }
      if (bookmarks && bookmarks.length > 0) {
        for (const b of bookmarks) {
          if (b.contentType === 'file' && b.id) fileIds.add(b.id);
        }
      }
      if (fileIds.size === 0) return;

      try {
        const counts = {};
        for (const id of fileIds) {
          // Count downloads for this file
          const downloads = await pb.collection('downloads').getFullList({
            filter: `fileId = "${id}"`,
          });
          counts[id] = downloads.length;
        }
        setDownloadCounts(counts);
      } catch (error) {
        console.error('Error loading download counts:', error);
      }
    };

    loadDownloadCounts();
  }, [files, bookmarks]);

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setEditData({
      subjectId: item.subjectId || '',
      title: item.title || '',
      description: item.description || item.contentText || '',
      linkURL: item.linkURL || '',
      fileTypeId: item.fileTypeId || '',
      educationalPurposeId: item.educationalPurposeId || ''
    });
    setValidationError('');
  };

  const validateFileType = (fileTypeId, fileName) => {
    const fileType = fileTypes.find(ft => ft.id === fileTypeId);
    if (!fileType || !fileType.allowedFormats) return { valid: true };

    const extension = fileName.split('.').pop()?.toLowerCase();
    const allowedFormats = fileType.allowedFormats.split(',').map(f => f.trim().toLowerCase());
    const isValid = allowedFormats.includes(extension) || allowedFormats.includes('.' + extension);
    
    return { 
      valid: isValid, 
      allowedFormats: fileType.allowedFormats,
      fileTypeName: i18n.language === 'ar' ? fileType.nameAr : fileType.nameEn
    };
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      if (editingItem.type === 'file') {
        // Validate fileType if changed
        if (editData.fileTypeId && editData.fileTypeId !== editingItem.fileTypeId) {
          const validation = validateFileType(editData.fileTypeId, editingItem.fileName);
          if (!validation.valid) {
            setValidationError(
              `❌ ${t('workspace.fileTypeIncompatible')}\n` +
              `${validation.fileTypeName}: ${validation.allowedFormats}`
            );
            return;
          }
        }

        await pb.collection('materials').update(editingItem.id, {
          subjectId: editData.subjectId,
          title: editData.title,
          description: editData.description,
          fileTypeId: editData.fileTypeId
        });
      } else {
        // Validate educational purpose for links
        if (!editData.educationalPurposeId) {
          setValidationError(t('workspace.purposeRequired'));
          return;
        }
        
        await pb.collection('posts').update(editingItem.id, {
          subjectId: editData.subjectId,
          contentText: editData.description,
          linkURL: editData.linkURL,
          educationalPurposeId: editData.educationalPurposeId
        });
      }
      setEditingItem(null);
      setValidationError('');
      onRefresh();
    } catch (error) {
      console.error('Error updating:', error);
      alert(t('messages.updateError'));
    }
  };

  const handleDelete = async (item, type) => {
    if (!confirm(t('messages.deleteConfirm'))) return;

    try {
      if (type === 'file') {
        await pb.collection('materials').delete(item.id);
      } else {
        await pb.collection('posts').delete(item.id);
      }
      onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      alert(t('messages.deleteError'));
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await pb.collection('bookmarks').delete(bookmarkId);
      onRefresh();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  // Multi-select handlers
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      setShowContextBar(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = (items) => {
    const allIds = items.map(item => item.id || item.bookmarkId);
    setSelectedItems(allIds);
    setShowContextBar(true);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setShowContextBar(false);
  };

  // Modal state for bookmark card preview
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [modalMaterial, setModalMaterial] = useState(null);
  const [modalPost, setModalPost] = useState(null);

  // File preview modal state
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch and enrich full material for modal (uploaderName, viewURL)
  const openMaterialCard = async (file) => {
    try {
      let material = await pb.collection('materials').getOne(file.id);
      
      // ✅ Preserve fileType from API or fallback to file list
      if (!material.fileType && file.fileType) {
        material = { ...material, fileType: file.fileType };
      }
      
      // Ensure essential fields from original item exist (for preview checks)
      if (!material.fileName && file.fileName) {
        material = { ...material, fileName: file.fileName };
      }
      if (!material.mimeType && file.mimeType) {
        material = { ...material, mimeType: file.mimeType };
      }
      if (!material.viewURL && material.fileId) {
        try {
          const { StorageService } = await import('../../../config/StorageService');
          const url = StorageService.getPublicURL(material.fileId);
          material = { ...material, viewURL: url };
        } catch (_) {}
      }
      // Fallback: use uploader from source list item if present
      if (!material.uploaderName && (file.uploaderName || (file.uploader && file.uploader.name))) {
        const name = file.uploaderName || (file.uploader && file.uploader.name);
        material = { ...material, uploaderName: name, uploader: { name } };
      }

      if (material.uploaderId && !material.uploaderName) {
        try {
          const user = await pb.collection('users').getOne(material.uploaderId);
          const name = user?.name || user?.username || user?.email || 'Unknown User';
          material = { ...material, uploaderName: name, uploader: { name } };
        } catch (_) {}
        // Fallback: if this is the owner's workspace, use account name
        if ((!material.uploaderName || material.uploaderName === 'Unknown User') && material.uploaderId && userId && material.uploaderId === userId) {
          try {
            const authUser = pb.authStore.model;
            const name = authUser?.name || authUser?.email || 'Unknown User';
            material = { ...material, uploaderName: name, uploader: { name } };
          } catch (_) {}
        }
      }
      setModalMaterial(material);
      setModalPost(null);
      setIsCardOpen(true);
    } catch (err) {
      console.error('Error opening material card:', err);
    }
  };

  const openBookmarkCard = async (item) => {
    if (item.contentType === 'file') {
      await openMaterialCard(item);
    } else {
      setModalMaterial(null);
      setModalPost({
        id: item.id,
        contentText: item.contentText,
        linkURL: item.linkURL,
        created: item.created,
        $updatedAt: item.$updatedAt,
        uploaderId: item.uploaderId,
        subjectId: item.subjectId,
        uploaderName: item.uploaderName,
      });
      setIsCardOpen(true);
    }
  };

  const closeCard = () => {
    setIsCardOpen(false);
    setModalMaterial(null);
    setModalPost(null);
  };

  // Modal handlers
  const handleModalPreview = async () => {
    if (!modalMaterial) return;
    try {
      let updated = modalMaterial;
      if (modalMaterial.fileId && !modalMaterial.viewURL) {
        const { StorageService } = await import('../../../config/StorageService');
        const publicUrl = StorageService.getPublicURL(modalMaterial.fileId);
        updated = { ...modalMaterial, viewURL: publicUrl };
        setModalMaterial(updated);
      }
      setIsCardOpen(false);
      setPreviewMaterial(updated);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error('Preview error:', err);
    }
  };

  const handleModalBookmark = async () => {
    try {
      if (modalMaterial) {
        // Toggle bookmark: check if exists, then create or delete
        const existing = await pb.collection('bookmarks').getFullList({
          filter: `userId = "${userId}" && fileId = "${modalMaterial.id}"`,
        });
        
        if (existing.length > 0) {
          await pb.collection('bookmarks').delete(existing[0].id);
        } else {
          await pb.collection('bookmarks').create({
            userId: userId,
            fileId: modalMaterial.id,
          });
        }
        onRefresh && onRefresh();
      }
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewMaterial(null);
  };

  

  const handleBatchDelete = async () => {
    if (!confirm(t('workspace.deleteSelectedConfirm'))) return;

    try {
      const deletePromises = selectedItems.map(id => {
        if (activeTab === 'files') {
          return pb.collection('materials').delete(id);
        } else if (activeTab === 'links') {
          return pb.collection('posts').delete(id);
        } else {
          const bookmark = bookmarks.find(b => b.bookmarkId === id);
          return bookmark ? pb.collection('bookmarks').delete(bookmark.bookmarkId) : Promise.resolve();
        }
      });

      await Promise.all(deletePromises);
      handleClearSelection();
      onRefresh();
    } catch (error) {
      console.error('Error batch deleting:', error);
      alert(t('messages.deleteError'));
    }
  };

  const handleBatchDownload = async () => {
    for (const id of selectedItems) {
      const file = files.find(f => f.id === id);
      if (!file) continue;

      try {
        // Get download URL (viewURL or generate from fileId)
        let downloadUrl = file.viewURL || file.downloadURL;
        
        if (!downloadUrl && file.fileId) {
          const { StorageService } = await import('../../../config/StorageService');
          downloadUrl = StorageService.getPublicURL(file.fileId);
        }

        if (!downloadUrl) {
          console.error('❌ No download URL for file:', file.title);
          continue;
        }

        // Record download
        try {
          await pb.collection('downloads').create({
            userId: userId,
            fileId: file.id,
          });
          console.log('✅ Download recorded:', file.title);
        } catch (err) {
          console.warn('⚠️ Could not record download:', err);
        }

        // Download file
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = file.fileName || file.title || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          console.log('✅ File downloaded:', file.title);
        } catch (downloadError) {
          console.warn('⚠️ Fetch failed, opening in new tab:', downloadError);
          window.open(downloadUrl, '_blank');
        }

        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('❌ Error downloading file:', file.title, error);
      }
    }
  };

  // Clear selection when changing tabs
  useEffect(() => {
    handleClearSelection();
  }, [activeTab]);

    // 🎯 Smart Filter - Searches in File Name + Subject Name
  const filterContent = (items) => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    
    return items.filter(item => {
      // Search in file/link title
      if (item.title?.toLowerCase().includes(query)) return true;
      
      // Search in description/contentText
      if (item.description?.toLowerCase().includes(query)) return true;
      if (item.contentText?.toLowerCase().includes(query)) return true;
      
      // Search in link URL
      if (item.linkURL?.toLowerCase().includes(query)) return true;
      
      // 🎓 Search in subject name (Arabic + English)
      if (item.subjectId) {
        const subjectName = subjectNames[item.subjectId];
        if (subjectName?.toLowerCase().includes(query)) return true;
      }
      
      return false;
    });
  };
  
  const filteredFiles = filterContent(files);
  const filteredLinks = filterContent(links);
  const filteredBookmarks = filterContent(bookmarks);

  const formatDate = (dateString) => {
    // Convert to Gregorian format
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const materialLabels = i18n.language === 'ar' ? {
    fileSize: 'حجم الملف',
    fileType: 'نوع الملف',
    preview: 'معاينة',
    download: 'تحميل',
    bookmark: 'حفظ',
    info: 'معلومات',
    description: 'الوصف',
    size: 'الحجم',
    type: 'النوع',
    downloads: 'التحميلات',
    date: 'التاريخ',
    back: 'رجوع',
  } : {
    fileSize: 'File Size',
    fileType: 'File Type',
    preview: 'Preview',
    download: 'Download',
    bookmark: 'Bookmark',
    info: 'Info',
    description: 'Description',
    size: 'Size',
    type: 'Type',
    downloads: 'Downloads',
    date: 'Date',
    back: 'Back',
  };

  const postLabels = i18n.language === 'ar' ? {
    link: 'رابط',
    viewPost: 'عرض المنشور',
  } : {
    link: 'Link',
    viewPost: 'View Post',
  };

  return (
    <div className="content-tabs-container">
      {/* Edit Page - Replaces entire content */}
      {editingItem ? (
        <div className="edit-page">
          <div className="edit-page-header">
            <button onClick={() => setEditingItem(null)} className="back-btn">
              ← {t('common.back')}
            </button>
            <h2>✏️ {t('common.edit')}</h2>
          </div>

          <div className="edit-page-content">
            <div className="form-group">
              <label className="form-label">🎓 {t('upload.selectSubject')}</label>
              <SmartSubjectSearch
                value={editData.subjectId}
                onChange={(val) => setEditData({ ...editData, subjectId: val })}
              />
            </div>
            
            {editingItem.type === 'file' ? (
              <>
                <div className="form-group">
                  <label className="form-label">📌 {t('upload.fileTitle')}</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🏷️ {t('workspace.fileType')}</label>
                  <select
                    value={editData.fileTypeId}
                    onChange={(e) => setEditData({ ...editData, fileTypeId: e.target.value })}
                    className="form-select"
                  >
                    {fileTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {i18n.language === 'ar' ? (type.nameAr || type.nameEn || type.name) : (type.nameEn || type.nameAr || type.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">📄 {t('upload.fileDescription')}</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
                {validationError && (
                  <div className="validation-error">
                    ❌ {validationError}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">🎯 {t('workspace.educationalPurpose')} *</label>
                  <select
                    value={editData.educationalPurposeId}
                    onChange={(e) => setEditData({ ...editData, educationalPurposeId: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">{t('workspace.selectPurpose')}</option>
                    {educationalPurposes.map((purpose) => (
                      <option key={purpose.id} value={purpose.id}>
                        {purpose.icon} {i18n.language === 'ar' ? purpose.nameAr : purpose.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">📝 {t('workspace.linkTitle')}</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🔗 {t('workspace.linkURL')}</label>
                  <input
                    type="url"
                    value={editData.linkURL}
                    onChange={(e) => setEditData({ ...editData, linkURL: e.target.value })}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="edit-page-actions">
              <button onClick={() => setEditingItem(null)} className="workspace-btn workspace-btn-secondary">
                {t('common.cancel')}
              </button>
              <button onClick={handleSaveEdit} className="workspace-btn workspace-btn-primary">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Contextual Action Bar */}
          {showContextBar && (
        <div className="context-action-bar">
          <div className="context-info">
            <span className="selected-count">
              {selectedItems.length} {t('workspace.itemsSelected')}
            </span>
            <button onClick={handleClearSelection} className="clear-selection-btn">
              ✕ {t('common.clear')}
            </button>
          </div>
          <div className="context-actions">
            {selectedItems.length === 1 && activeTab === 'files' && (
              <>
                <button
                  onClick={() => {
                    const item = files.find(f => f.id === selectedItems[0]);
                    handleEdit(item, 'file');
                    handleClearSelection();
                  }}
                  className="context-btn edit-btn"
                >
                  ✏️ {t('common.edit')}
                </button>
                <button onClick={handleBatchDownload} className="context-btn download-btn">
                  📥 {t('common.download')}
                </button>
              </>
            )}
            {selectedItems.length === 1 && activeTab === 'links' && (
              <button
                onClick={() => {
                  const item = links.find(l => l.id === selectedItems[0]);
                  handleEdit(item, 'link');
                  handleClearSelection();
                }}
                className="context-btn edit-btn"
              >
                ✏️ {t('common.edit')}
              </button>
            )}
            <button onClick={handleBatchDelete} className="context-btn delete-btn">
              🗑️ {t('common.delete')} ({selectedItems.length})
            </button>
          </div>
        </div>
      )}


      {/* Tab Headers */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <span className="tab-icon">📁</span>
          <span className="tab-label">{t('workspace.myFiles')}</span>
          <span className="tab-count">{files.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          <span className="tab-icon">🔗</span>
          <span className="tab-label">{t('workspace.myLinks')}</span>
          <span className="tab-count">{links.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <span className="tab-icon">⭐</span>
          <span className="tab-label">{t('workspace.bookmarks')}</span>
          <span className="tab-count">{bookmarks.length}</span>
        </button>
        <div className={`tab-indicator tab-${activeTab}`}></div>
      </div>

      {/* 🎨 Unified Smart Search - Searches in File Name + Subject */}
      <div className="premium-filter-bar">
        <div className="unified-smart-search">
          <span className="search-icon-unified">🔍</span>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={i18n.language === 'ar' ? 'ابحث في اسم الملف أو المادة...' : 'Search in file name or subject...'}
            className="smart-search-input"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn-smart"
              title={i18n.language === 'ar' ? 'مسح' : 'Clear'}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Search Result Count */}
        {searchQuery && (
          <div className="search-results-badge">
            {activeTab === 'files' && (
              <span>
                📁 {filteredFiles.length} {i18n.language === 'ar' ? 'نتيجة' : 'results'}
              </span>
            )}
            {activeTab === 'links' && (
              <span>
                🔗 {filteredLinks.length} {i18n.language === 'ar' ? 'نتيجة' : 'results'}
              </span>
            )}
            {activeTab === 'bookmarks' && (
              <span>
                ⭐ {filteredBookmarks.length} {i18n.language === 'ar' ? 'نتيجة' : 'results'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        {/* My Files Tab */}
        {activeTab === 'files' && (
          <div className="tab-panel">
            {filteredFiles.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">{searchQuery ? '�' : '�📁'}</span>
                <p className="empty-title">
                  {(searchQuery || selectedSubjectFilter) 
                    ? (i18n.language === 'ar' ? 'لا توجد نتائج' : 'No results') 
                    : t('workspace.noFiles')
                  }
                </p>
                <p className="empty-desc">
                  {(searchQuery || selectedSubjectFilter)
                    ? (i18n.language === 'ar' ? 'جرب فلتر أو كلمات بحث مختلفة' : 'Try different filter or search') 
                    : t('workspace.noFilesDesc')
                  }
                </p>
              </div>
            ) : (
              <div className="links-feed" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                maxHeight: 'calc(4 * 135px)', // 4 items * reduced height (25% less)
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '0.5rem'
              }}>
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className={`link-card ${selectedItems.includes(file.id) ? 'selected' : ''}`}
                    style={{
                      background: 'var(--card-bg, #1a2332)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectItem(file.id)}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(file.id)}
                        onChange={() => handleSelectItem(file.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="select-checkbox"
                        style={{ marginTop: '0.25rem' }}
                      />
                      
                      {/* File Icon - Dynamic from fileType */}
                      <div style={{ 
                        fontSize: '2rem', 
                        flexShrink: 0,
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: file.fileType?.color ? `${file.fileType.color}20` : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))',
                        borderRadius: '8px',
                        border: file.fileType?.color ? `1px solid ${file.fileType.color}40` : '1px solid rgba(99, 102, 241, 0.3)'
                      }}>
                        {file.fileType?.icon || '📄'}
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="file-title">{file.title}</div>
                        {file.description && (
                          <div className="file-desc" style={{ marginTop: '0.5rem' }}>{file.description}</div>
                        )}
                        
                        {/* Subject Badge */}
                        {file.subjectId && subjectNames[file.subjectId] && (
                          <div style={{ 
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.1))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#6366f1',
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            📚 {subjectNames[file.subjectId]}
                          </div>
                        )}
                        
                        {/* Meta Info Chips */}
                        <div className="meta-chips">
                          <span>📦 {formatFileSize(file.fileSize)}</span>
                          <span>📥 {downloadCounts[file.id] || 0}</span>
                          <span>📅 {formatDate(file.created)}</span>
                        </div>
                      </div>
                      {/* View Button */
                      }
                      <div style={{ display: 'flex', flexShrink: 0 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openMaterialCard(file); }}
                          className="workspace-btn workspace-btn-secondary"
                          title={i18n.language === 'ar' ? 'عرض' : 'View'}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          👁️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Links Tab - Unified Table View */}
        {activeTab === 'links' && (
          <div className="tab-panel">
            {filteredLinks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">{searchQuery ? '�' : '�🔗'}</span>
                <p className="empty-title">
                  {(searchQuery || selectedSubjectFilter) 
                    ? (i18n.language === 'ar' ? 'لا توجد نتائج' : 'No results') 
                    : t('workspace.noLinks')
                  }
                </p>
                <p className="empty-desc">
                  {(searchQuery || selectedSubjectFilter)
                    ? (i18n.language === 'ar' ? 'جرب فلتر أو كلمات بحث مختلفة' : 'Try different filter or search') 
                    : t('workspace.noLinksDesc')
                  }
                </p>
              </div>
            ) : (
              <div className="links-feed" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                maxHeight: 'calc(4 * 135px)', // 4 items * reduced height (25% less)
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '0.5rem'
              }}>
                {filteredLinks.map((link) => (
                  <div 
                    key={link.id} 
                    className={`link-card ${selectedItems.includes(link.id) ? 'selected' : ''}`}
                    style={{
                      background: 'var(--card-bg, #1a2332)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectItem(link.id)}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(link.id)}
                        onChange={() => handleSelectItem(link.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="select-checkbox"
                        style={{ marginTop: '0.25rem' }}
                      />
                      
                      {/* Link Icon */}
                      <div style={{ 
                        fontSize: '2rem', 
                        flexShrink: 0,
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        🔗
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Description/Text */}
                        {link.contentText && (
                          <p style={{ 
                            color: 'var(--text-primary, #fff)',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            marginBottom: '0.75rem',
                            wordBreak: 'break-word'
                          }}>
                            {link.contentText}
                          </p>
                        )}
                        
                        {/* Link URL */}
                        {link.linkURL && (
                          <a
                            href={link.linkURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: 'var(--link-color, #3b82f6)',
                              fontSize: '0.875rem',
                              textDecoration: 'none',
                              padding: '0.5rem 1rem',
                              background: 'rgba(59, 130, 246, 0.1)',
                              borderRadius: '6px',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              transition: 'all 0.2s ease',
                              marginBottom: '0.75rem',
                              width: '100%',
                              maxWidth: '100%',
                              overflow: 'hidden',
                              minWidth: 0
                            }}
                          >
                            <span>🔗</span>
                            <span style={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              minWidth: 0
                            }}>
                              {link.linkURL}
                            </span>
                            <span>→</span>
                          </a>
                        )}
                        
                        {/* Subject Badge */}
                        {link.subjectId && subjectNames[link.subjectId] && (
                          <div style={{ 
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#10b981',
                            marginBottom: '0.75rem'
                          }}>
                            📚 {subjectNames[link.subjectId]}
                          </div>
                        )}
                        
                        {/* Meta Info */}
                        <div className="meta-chips">
                          <span>📅 {formatDate(link.created)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks Tab - Unified Table View */}
        {activeTab === 'bookmarks' && (
          <div className="tab-panel">
            {filteredBookmarks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">{(searchQuery || selectedSubjectFilter) ? '🔍' : '⭐'}</span>
                <p className="empty-title">
                  {(searchQuery || selectedSubjectFilter) 
                    ? (i18n.language === 'ar' ? 'لا توجد نتائج' : 'No results') 
                    : t('workspace.noBookmarks')
                  }
                </p>
                <p className="empty-desc">
                  {(searchQuery || selectedSubjectFilter)
                    ? (i18n.language === 'ar' ? 'جرب فلتر أو كلمات بحث مختلفة' : 'Try different filter or search') 
                    : t('workspace.noBookmarksDesc')
                  }
                </p>
              </div>
            ) : (
              <div className="links-feed" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                maxHeight: 'calc(4 * 135px)', // 4 items * reduced height (25% less)
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '0.5rem'
              }}>
                {bookmarks.map((item) => {
                  console.log('🔍 Bookmark item:', item.title, 'fileType:', item.fileType);
                  return (
                  <div 
                    key={item.bookmarkId} 
                    className={`link-card ${selectedItems.includes(item.bookmarkId) ? 'selected' : ''}`}
                    style={{
                      background: 'var(--card-bg, #1a2332)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectItem(item.bookmarkId)}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.bookmarkId)}
                        onChange={() => handleSelectItem(item.bookmarkId)}
                        onClick={(e) => e.stopPropagation()}
                        className="select-checkbox"
                        style={{ marginTop: '0.25rem' }}
                      />
                      
                      {/* Icon - Dynamic from fileType */}
                      <div style={{ 
                        fontSize: '2rem', 
                        flexShrink: 0,
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: item.contentType === 'file' 
                          ? (item.fileType?.color ? `${item.fileType.color}20` : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))')
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))',
                        borderRadius: '8px',
                        border: item.contentType === 'file' 
                          ? (item.fileType?.color ? `1px solid ${item.fileType.color}40` : '1px solid rgba(99, 102, 241, 0.3)')
                          : '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {item.contentType === 'file' ? (item.fileType?.icon || '📄') : '🔗'}
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {item.contentType === 'file' ? (
                          <>
                            <div className="file-title">{item.title || t('workspace.noTitle')}</div>
                            {item.description && (
                              <div className="file-desc" style={{ marginTop: '0.5rem' }}>{item.description}</div>
                            )}
                            
                            {/* Subject Badge */}
                            {item.subjectId && subjectNames[item.subjectId] && (
                              <div style={{ 
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(251, 191, 36, 0.1))',
                                border: '1px solid rgba(234, 179, 8, 0.2)',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#eab308',
                                marginTop: '0.5rem',
                                marginBottom: '0.5rem'
                              }}>
                                📚 {subjectNames[item.subjectId]}
                              </div>
                            )}
                            
                            <div className="meta-chips">
                              <span>📦 {formatFileSize(item.fileSize)}</span>
                              <span>📥 {downloadCounts[item.id] || 0}</span>
                              <span>📅 {formatDate(item.created)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {item.contentText && (
                              <p style={{ 
                                color: 'var(--text-primary, #fff)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                marginBottom: '0.75rem',
                                wordBreak: 'break-word'
                              }}>
                                {item.contentText}
                              </p>
                            )}
                            {item.linkURL && (
                              <a
                                href={item.linkURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: 'var(--link-color, #3b82f6)',
                                  fontSize: '0.875rem',
                                  textDecoration: 'none',
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease',
                                  marginBottom: '0.75rem',
                                  width: '100%',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  minWidth: 0
                                }}
                              >
                                <span>🔗</span>
                                <span style={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1,
                                  minWidth: 0
                                }}>
                                  {item.linkURL}
                                </span>
                                <span>→</span>
                              </a>
                            )}
                            
                            {/* Subject Badge */}
                            {item.subjectId && subjectNames[item.subjectId] && (
                              <div style={{ 
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(251, 191, 36, 0.1))',
                                border: '1px solid rgba(234, 179, 8, 0.2)',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#eab308',
                                marginBottom: '0.75rem'
                              }}>
                                📚 {subjectNames[item.subjectId]}
                              </div>
                            )}
                            
                            <div className="meta-chips">
                              <span>📅 {formatDate(item.created)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* View Button */}
                      <div style={{ display: 'flex', flexShrink: 0 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openBookmarkCard(item); }}
                          className="workspace-btn workspace-btn-secondary"
                          title={i18n.language === 'ar' ? 'عرض' : 'View'}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          👁️
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Card Modal for Bookmarks */}
      <CardModal
        isOpen={isCardOpen}
        onClose={closeCard}
        material={modalMaterial}
        post={modalPost}
        onMaterialPreview={handleModalPreview}
        onBookmark={handleModalBookmark}
        isBookmarked={modalMaterial ? (bookmarks || []).some(b => b.contentType === 'file' && b.id === modalMaterial.id) : false}
        materialLabels={materialLabels}
        postLabels={postLabels}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        fileUrl={previewMaterial?.viewURL || ''}
        fileName={previewMaterial?.fileName || ''}
        mimeType={previewMaterial?.mimeType}
        title={previewMaterial?.title || ''}
        onDownload={async () => {
          if (!previewMaterial?.fileId) return;
          let downloadUrl = previewMaterial.viewURL;
          if (!downloadUrl) {
            try {
              const { StorageService } = await import('../../../config/StorageService');
              downloadUrl = StorageService.getPublicURL(previewMaterial.fileId);
            } catch (error) {
              console.error('❌ Could not generate public URL:', error);
              return;
            }
          }
          try {
            const { downloadsService } = await import('../../../services/appwriteService');
            await downloadsService.create(previewMaterial.id);
            console.log('✅ Download recorded:', previewMaterial.id);
          } catch (error) {
            console.error('❌ Error recording download:', error);
          }
          try {
            const response = await fetch(downloadUrl);
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
      </>
      )}
    </div>
  );
};

export default ContentTabs;
