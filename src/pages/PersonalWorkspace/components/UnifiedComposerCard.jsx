import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { postsService, materialsService, fileTypesService, educationalPurposesService } from '../../../services/appwriteService';
import { StorageService } from '../../../config/StorageService';
import SmartSubjectSearch from '../../../components/SmartSubjectSearch/SmartSubjectSearch';
import './UnifiedComposerCard.css';

/**
 * Unified Composer Card
 * Elegant single card with smooth mode toggle
 */
const UnifiedComposerCard = ({ userId, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState('file'); // 'link' or 'file'
  const [expanded, setExpanded] = useState(false);
  
  // Common
  const [subjectId, setSubjectId] = useState('');
  
  // Link mode
  const [linkURL, setLinkURL] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkPurposeId, setLinkPurposeId] = useState(''); // Educational purpose for links
  const [linkPurposes, setLinkPurposes] = useState([]); // Purposes where isLinkAllowed=true
  
  // File mode
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileTypeId, setFileTypeId] = useState('');
  const [fileTypes, setFileTypes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch file types and link purposes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileTypesData = await fileTypesService.getAll();
        console.log('📦 File Types loaded:', fileTypesData);
        setFileTypes(fileTypesData || []);
        
        // Fetch educational purposes where links are allowed
        const linkPurposesData = await educationalPurposesService.getLinkAllowed();
        console.log('🎯 Link Purposes loaded:', linkPurposesData);
        setLinkPurposes(linkPurposesData || []);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleModeToggle = (newMode) => {
    console.log('🔄 Mode changing to:', newMode);
    setMode(newMode);
    setMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Check if URL was dropped
    const droppedUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    // If it's a URL, switch to link mode
    if (droppedUrl && (droppedUrl.startsWith('http://') || droppedUrl.startsWith('https://'))) {
      setMode('link');
      setLinkURL(droppedUrl);
      setExpanded(true);
      return;
    }
    
    // Otherwise check for file
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setMode('file');
      setFile(droppedFile);
      // Auto-fill title from filename (without extension)
      const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, '');
      setFileTitle(nameWithoutExt);
      setExpanded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUploadProgress(0); // ✅ Reset progress

    try {
      if (mode === 'link') {
        // Validate URL
        if (!linkURL.trim()) {
          setMessage('❌ ' + t('workspace.urlRequired'));
          setLoading(false);
          return;
        }

        try {
          new URL(linkURL);
        } catch {
          setMessage('❌ ' + t('posts.invalidURL'));
          setLoading(false);
          return;
        }

        // Validate educational purpose for link
        if (!linkPurposeId) {
          setMessage('❌ ' + t('workspace.purposeRequired'));
          setLoading(false);
          return;
        }

        // ✅ Validate subject is selected (REQUIRED)
        if (!subjectId || subjectId.trim() === '') {
          setMessage('❌ ' + t('upload.subjectRequired'));
          setLoading(false);
          return;
        }

        // Create post with educational purpose
        await postsService.create({
          subjectId: subjectId,
          uploaderId: userId,
          contentText: linkDescription.trim(),
          linkURL: linkURL.trim(),
          educationalPurposeId: linkPurposeId
        });

        setMessage('✅ ' + t('workspace.linkShared'));
        setLinkURL('');
        setLinkDescription('');
        setLinkPurposeId('');
        setSubjectId('');
        
      } else {
        // Validate file
        if (!file) {
          setMessage('❌ ' + t('upload.selectFile'));
          setLoading(false);
          return;
        }

        if (!fileTitle.trim()) {
          setMessage('❌ ' + t('upload.titleRequired'));
          setLoading(false);
          return;
        }

        // ✅ Validate subject is selected (REQUIRED)
        if (!subjectId || subjectId.trim() === '') {
          setMessage('❌ ' + t('upload.subjectRequired'));
          setLoading(false);
          return;
        }

        // ✅ Validate file type is selected (REQUIRED)
        if (!fileTypeId || fileTypeId.trim() === '') {
          setMessage('❌ ' + t('workspace.fileTypeRequired'));
          setLoading(false);
          return;
        }

        // Get file type to validate format
        const selectedFileType = fileTypes.find(ft => ft.$id === fileTypeId);
        if (!selectedFileType) {
          setMessage('❌ File type not found.');
          setLoading(false);
          return;
        }

        // ✅ Validate file format against allowedFormats BEFORE upload
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedFormatsRaw = selectedFileType.allowedFormats || '';
        
        // ✅ allowedFormats is a string (e.g., "pdf,docx,pptx"), convert to array
        const allowedFormats = allowedFormatsRaw ? allowedFormatsRaw.split(',').map(f => f.trim().toLowerCase()) : [];
        
        if (allowedFormats.length > 0 && !allowedFormats.includes(fileExtension)) {
          const allowedList = allowedFormats.join(', ');
          setMessage(`❌ ${t('upload.invalidFormat')} ✅ ${t('upload.allowedFormats')}: ${allowedList}`);
          setLoading(false);
          return;
        }

        console.log(`✅ File format validated: .${fileExtension} is allowed for ${selectedFileType.nameEn}`);

        // Upload file with metadata (educationalPurposeId optional from fileType)
        const uploadedFile = await StorageService.uploadFile(file, {
          title: fileTitle.trim(),
          description: fileDescription.trim(),
          subjectId: subjectId,
          fileTypeId: fileTypeId,
          educationalPurposeId: selectedFileType.educationalPurposeId || '', // Optional - for UI organization only
          onProgress: (progress) => {
            console.log(`🎯 UI Progress Update: ${progress}%`);
            setUploadProgress(progress);
          }
        });

        // Save file metadata to database
        await materialsService.create({
          uploaderId: userId,
          title: fileTitle.trim(),
          description: fileDescription.trim(),
          fileId: uploadedFile.fileId,
          fileName: uploadedFile.fileName,
          fileSize: uploadedFile.size,
          downloadURL: uploadedFile.downloadURL,
          viewURL: uploadedFile.viewURL || uploadedFile.downloadURL,
          subjectId: subjectId,
          fileTypeId: fileTypeId,
          tags: null
        });

        setMessage('✅ ' + t('workspace.fileUploaded'));
        setFile(null);
        setFileTitle('');
        setFileDescription('');
        setSubjectId('');
        setUploadProgress(0);
      }

      setTimeout(() => {
        setExpanded(false);
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating content:', error);
      setMessage('❌ ' + (error.message || t('common.error')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="composer-card">
      <div className="composer-header">
        <h2 className="composer-title">✨ {t('workspace.createContent')}</h2>
        
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === 'file' ? 'active' : ''}`}
            onClick={() => handleModeToggle('file')}
          >
            <span className="mode-icon">📁</span>
            <span className="mode-label">{t('workspace.uploadFile')}</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'link' ? 'active' : ''}`}
            onClick={() => handleModeToggle('link')}
          >
            <span className="mode-icon">🔗</span>
            <span className="mode-label">{t('workspace.shareLink')}</span>
          </button>
          <div className={`mode-indicator mode-${mode}`}></div>
        </div>
      </div>

      {!expanded ? (
        <button 
          className="composer-expand-btn"
          onClick={() => setExpanded(true)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #3b82f6' : undefined,
            background: isDragging ? 'rgba(59, 130, 246, 0.1)' : undefined
          }}
        >
          <span>➕</span>
          <span>{isDragging ? (i18n.language === 'ar' ? 'أفلت هنا...' : 'Drop here...') : (mode === 'link' ? t('workspace.shareNewLink') : t('workspace.uploadNewFile'))}</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="composer-form">
          {message && (
            <div className={`composer-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Smart Subject Search */}
          <div className="form-group">
            <label className="form-label">
              🎓 {t('upload.selectSubject')} <span className="required">*</span>
            </label>
            <SmartSubjectSearch
              value={subjectId}
              onChange={setSubjectId}
            />
          </div>

          {/* Link Mode */}
          {mode === 'link' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  🎯 {t('workspace.educationalPurpose')} *
                </label>
                <select
                  value={linkPurposeId}
                  onChange={(e) => setLinkPurposeId(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">{t('workspace.selectPurpose')}</option>
                  {linkPurposes.map((purpose) => (
                    <option key={purpose.$id} value={purpose.$id}>
                      {purpose.icon} {i18n.language === 'ar' ? purpose.nameAr : purpose.nameEn}
                    </option>
                  ))}
                </select>
                <p className="form-hint">
                  {t('workspace.purposeHint')}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  🔗 {t('workspace.linkURL')} *
                </label>
                <input
                  type="url"
                  value={linkURL}
                  onChange={(e) => setLinkURL(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  📝 {t('workspace.linkTitle')}
                </label>
                <textarea
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  placeholder={t('workspace.linkTitlePlaceholder')}
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </>
          )}

          {/* File Mode */}
          {mode === 'file' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  📁 {t('workspace.uploadNewFile')} *
                </label>
                <div 
                  className={`file-input-wrapper ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        // Auto-fill title from filename (without extension)
                        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
                        setFileTitle(nameWithoutExt);
                      }
                    }}
                    required
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-input-label">
                    {file ? (
                      <>
                        <span className="file-icon">📄</span>
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </>
                    ) : (
                      <>
                        <span className="file-icon">📁</span>
                        <span>{isDragging ? t('workspace.dropHere') : t('workspace.chooseFile')}</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  📌 {t('upload.fileTitle')} *
                </label>
                <input
                  type="text"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder={t('upload.fileTitlePlaceholder')}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  🏷️ {t('workspace.fileType')} *
                </label>
                <select
                  value={fileTypeId}
                  onChange={(e) => setFileTypeId(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">{t('workspace.selectFileType')}</option>
                  {fileTypes.map((type) => (
                    <option key={type.$id} value={type.$id}>
                      {i18n.language === 'ar' ? (type.nameAr || type.nameEn || type.name) : (type.nameEn || type.nameAr || type.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  📄 {t('upload.fileDescription')} <span className="optional">({t('posts.optional')})</span>
                </label>
                <textarea
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder={t('upload.fileDescriptionPlaceholder')}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-header">
                    <span className="progress-label">
                      📈 {t('workspace.uploading')}...
                    </span>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {console.log(`🎨 Rendering progress bar: ${uploadProgress}%`)}
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="composer-actions">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="workspace-btn workspace-btn-secondary"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="workspace-btn workspace-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {mode === 'link' ? t('workspace.sharing') : t('workspace.uploading')}
                </>
              ) : (
                <>
                  {mode === 'link' ? '🔗 ' + t('workspace.shareLink') : '📁 ' + t('workspace.uploadFile')}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UnifiedComposerCard;
