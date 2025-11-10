import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { materialsService, fileTypesService } from '../../services/appwriteService';
import { StorageService } from '../../config/StorageService';
import SmartSubjectSearch from '../../components/SmartSubjectSearch/SmartSubjectSearch';
import './FolderUploadPreview.css';

/**
 * Folder Upload Preview Page
 * Full-page view for reviewing and editing folder contents before upload
 */
const FolderUploadPreview = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get files from location state (passed from UnifiedComposerCard)
  const initialFiles = location.state?.files || [];
  const userId = location.state?.userId;
  const defaultSubjectId = location.state?.subjectId || '';
  
  const [folderFiles, setFolderFiles] = useState(initialFiles);
  const [fileTypes, setFileTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  
  // Bulk settings
  const [bulkSubjectId, setBulkSubjectId] = useState('');
  const [bulkFileTypeId, setBulkFileTypeId] = useState('');

  useEffect(() => {
    // Redirect if no files
    if (folderFiles.length === 0) {
      navigate(-1);
      return;
    }

    // Fetch file types
    const fetchFileTypes = async () => {
      try {
        const fileTypesData = await fileTypesService.getAll();
        setFileTypes(fileTypesData || []);
      } catch (error) {
        console.error('❌ Error fetching file types:', error);
      }
    };
    fetchFileTypes();
  }, []);

  const handleRemoveFile = (index) => {
    const newFiles = folderFiles.filter((_, i) => i !== index);
    setFolderFiles(newFiles);
    
    // If no files left, go back
    if (newFiles.length === 0) {
      navigate(-1);
    }
  };

  const handleUpdateFile = (index, field, value) => {
    const newFiles = [...folderFiles];
    newFiles[index][field] = value;
    setFolderFiles(newFiles);
  };

  const handleApplyBulkSettings = () => {
    if (!bulkSubjectId && !bulkFileTypeId) return;

    setFolderFiles(prevFiles => 
      prevFiles.map(fileObj => ({
        ...fileObj,
        subjectId: bulkSubjectId || fileObj.subjectId,
        fileTypeId: bulkFileTypeId || fileObj.fileTypeId
      }))
    );

    setMessage(`✅ ${i18n.language === 'ar' ? 'تم تطبيق الإعدادات على جميع الملفات' : 'Settings applied to all files'}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

    try {
      // Validate all files
      for (let i = 0; i < folderFiles.length; i++) {
        const fileObj = folderFiles[i];
        if (!fileObj.subjectId || !fileObj.fileTypeId) {
          setMessage(`❌ ${t('workspace.folderValidationError')}: ${fileObj.file.name}`);
          setLoading(false);
          return;
        }
      }

      let successCount = 0;
      let failCount = 0;
      const totalFiles = folderFiles.length;

      // Upload files in batches of 5
      const BATCH_SIZE = 5;
      for (let i = 0; i < folderFiles.length; i += BATCH_SIZE) {
        const batch = folderFiles.slice(i, i + BATCH_SIZE);
        
        await Promise.all(
          batch.map(async (fileObj) => {
            try {
              const uploadResult = await StorageService.uploadFile(
                fileObj.file,
                (progress) => {
                  const overallProgress = ((successCount + 1) / totalFiles) * 100;
                  setUploadProgress(Math.round(overallProgress));
                }
              );

              await materialsService.create({
                title: fileObj.title.trim(),
                description: fileObj.description.trim(),
                subjectId: fileObj.subjectId,
                fileTypeId: fileObj.fileTypeId,
                fileId: uploadResult.fileId,
                fileName: fileObj.file.name,
                fileSize: fileObj.file.size,
                uploaderId: userId
              });

              successCount++;
              setUploadProgress(Math.round((successCount / totalFiles) * 100));
            } catch (error) {
              console.error(`❌ Failed to upload ${fileObj.file.name}:`, error);
              failCount++;
            }
          })
        );
      }

      setMessage(`✅ ${successCount} ${t('workspace.files')} ${t('workspace.folderUploadSuccess')}${failCount > 0 ? ` (${failCount} ${t('workspace.failed')})` : ''}`);
      
      // Navigate back after success
      setTimeout(() => {
        navigate('/workspace', { replace: true });
      }, 2000);

    } catch (error) {
      console.error('❌ Folder upload error:', error);
      setMessage(`❌ ${t('workspace.folderUploadError')}`);
      setLoading(false);
    }
  };

  return (
    <div className="folder-preview-page">
      <div className="folder-preview-container">
        {/* Header */}
        <div className="folder-preview-header">
          <div className="header-left">
            <button 
              onClick={() => navigate(-1)} 
              className="back-btn"
              disabled={loading}
            >
              ← {i18n.language === 'ar' ? 'رجوع' : 'Back'}
            </button>
            <div className="header-title">
              <h1>📂 {i18n.language === 'ar' ? 'معاينة الفولدر' : 'Folder Preview'}</h1>
              <p className="file-count">
                {folderFiles.length} {i18n.language === 'ar' ? 'ملف' : 'files'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleUpload}
            className="upload-all-btn"
            disabled={loading || folderFiles.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {uploadProgress}%
              </>
            ) : (
              <>
                📤 {i18n.language === 'ar' ? `رفع ${folderFiles.length} ملف` : `Upload ${folderFiles.length} files`}
              </>
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`preview-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${uploadProgress}%` }}
              >
                <span className="progress-text">{uploadProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Settings */}
        <div className="bulk-settings-card">
          <h3>⚡ {i18n.language === 'ar' ? 'تطبيق سريع على الكل' : 'Quick Apply to All'}</h3>
          <div className="bulk-settings-grid">
            <div className="bulk-field">
              <label>{t('upload.selectSubject')}</label>
              <SmartSubjectSearch
                value={bulkSubjectId}
                onChange={setBulkSubjectId}
              />
            </div>
            
            <div className="bulk-field">
              <label>{t('workspace.fileType')}</label>
              <select
                value={bulkFileTypeId}
                onChange={(e) => setBulkFileTypeId(e.target.value)}
                className="form-select"
              >
                <option value="">{t('workspace.selectFileType')}</option>
                {fileTypes.map((type) => (
                  <option key={type.$id} value={type.$id}>
                    {i18n.language === 'ar' ? (type.nameAr || type.nameEn) : (type.nameEn || type.nameAr)}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleApplyBulkSettings}
              className="apply-bulk-btn"
              disabled={!bulkSubjectId && !bulkFileTypeId}
            >
              ✨ {i18n.language === 'ar' ? 'تطبيق على الكل' : 'Apply to All'}
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="files-grid">
          {folderFiles.map((fileObj, index) => (
            <div key={index} className="file-preview-card">
              {/* Card Header */}
              <div className="file-card-header">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <span className="file-name">{fileObj.file.name}</span>
                    <span className="file-size">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveFile(index)}
                  className="remove-file-btn"
                  title={i18n.language === 'ar' ? 'حذف الملف' : 'Remove file'}
                  disabled={loading}
                >
                  🗑️
                </button>
              </div>

              {/* Card Body */}
              <div className="file-card-body">
                <div className="form-group">
                  <label>{t('upload.fileTitle')} *</label>
                  <input
                    type="text"
                    value={fileObj.title}
                    onChange={(e) => handleUpdateFile(index, 'title', e.target.value)}
                    className="form-input"
                    placeholder={i18n.language === 'ar' ? 'عنوان الملف' : 'File title'}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>{t('upload.selectSubject')} *</label>
                  <SmartSubjectSearch
                    value={fileObj.subjectId}
                    onChange={(newSubjectId) => handleUpdateFile(index, 'subjectId', newSubjectId)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>{t('workspace.fileType')} *</label>
                  <select
                    value={fileObj.fileTypeId}
                    onChange={(e) => handleUpdateFile(index, 'fileTypeId', e.target.value)}
                    className="form-select"
                    disabled={loading}
                  >
                    <option value="">{t('workspace.selectFileType')}</option>
                    {fileTypes.map((type) => (
                      <option key={type.$id} value={type.$id}>
                        {i18n.language === 'ar' ? (type.nameAr || type.nameEn) : (type.nameEn || type.nameAr)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('upload.fileDescription')}</label>
                  <textarea
                    value={fileObj.description}
                    onChange={(e) => handleUpdateFile(index, 'description', e.target.value)}
                    className="form-textarea"
                    rows={2}
                    placeholder={i18n.language === 'ar' ? 'وصف اختياري' : 'Optional description'}
                    disabled={loading}
                  />
                </div>

                {/* Validation Indicator */}
                <div className="validation-indicator">
                  {fileObj.subjectId && fileObj.fileTypeId ? (
                    <span className="valid">✅ {i18n.language === 'ar' ? 'جاهز للرفع' : 'Ready to upload'}</span>
                  ) : (
                    <span className="invalid">⚠️ {i18n.language === 'ar' ? 'يحتاج موضوع ونوع' : 'Needs subject & type'}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderUploadPreview;
