/**
 * Preview Service
 * Determines which files can be previewed and handles preview logic
 * ONLY supports modern Office formats (.docx, .pptx, .xlsx)
 * EXCLUDES legacy formats (.doc, .ppt, .xls)
 */

export const previewService = {
  /**
   * Check if a file can be previewed based on extension
   * @param {string} fileName - The file name
   * @returns {boolean}
   */
  canPreview(fileName) {
    if (!fileName) return false;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // SUPPORTED FORMATS ONLY
    const previewableExtensions = [
      // Native browser support
      'pdf',
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
      'txt', 'md', 'json', 'xml', 'csv',
      // Modern Office documents ONLY (with libraries)
      'docx',  // ✅ Modern Word
      'xlsx',  // ✅ Modern Excel
      'pptx'   // ✅ Modern PowerPoint
      // ❌ Legacy formats NOT supported: .doc, .xls, .ppt
    ];

    return previewableExtensions.includes(extension);
  },

  /**
   * Get preview type for a file
   * @param {string} fileName
   * @returns {string} - 'native', 'office', or 'none'
   */
  getPreviewType(fileName) {
    if (!fileName) return 'none';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const nativePreview = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'txt', 'md', 'json', 'xml', 'csv'];
    const modernOfficePreview = ['docx', 'xlsx', 'pptx']; // ONLY modern formats
    
    if (nativePreview.includes(extension)) return 'native';
    if (modernOfficePreview.includes(extension)) return 'office';
    
    return 'none';
  },

  /**
   * Check if file requires special library for preview
   * @param {string} fileName
   * @returns {boolean}
   */
  requiresLibrary(fileName) {
    return this.getPreviewType(fileName) === 'office';
  },

  /**
   * Get icon for preview button based on file type
   * @param {string} fileName
   * @returns {string}
   */
  getPreviewIcon(fileName) {
    const type = this.getPreviewType(fileName);
    
    if (type === 'native') return '👁️';
    if (type === 'office') return '📄';
    
    return '🔍';
  },

  /**
   * Check if file is a legacy Office format (not supported)
   * @param {string} fileName
   * @returns {boolean}
   */
  isLegacyOfficeFormat(fileName) {
    if (!fileName) return false;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    const legacyFormats = ['doc', 'xls', 'ppt'];
    
    return legacyFormats.includes(extension);
  }
};

export default previewService;
