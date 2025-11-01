/**
 * FilePreviewModal Component
 * Advanced multi-format file previewer with 5-page limit for performance
 * Supports: PDF, DOCX, PPTX, Images
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { renderAsync } from 'docx-preview';
import './FilePreviewModal.css';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  title: string;
  onDownload?: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  mimeType,
  title,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [pptxSlides, setPptxSlides] = useState<string[]>([]);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);
  const isArabic = document.documentElement.dir === 'rtl';

  // Determine file type
  const fileExtension = fileName.toLowerCase().split('.').pop() || '';
  const isPDF = mimeType?.includes('pdf') || fileExtension === 'pdf';
  const isDOCX = mimeType?.includes('wordprocessingml') || fileExtension === 'docx';
  const isPPTX = mimeType?.includes('presentationml') || fileExtension === 'pptx';
  const isImage = mimeType?.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileExtension);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Load PDF (first 5 pages only)
  const loadPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      
      const totalPages = Math.min(pdf.numPages, 5); // Limit to 5 pages
      const pagePromises: Promise<string>[] = [];
      
      for (let i = 1; i <= totalPages; i++) {
        pagePromises.push(
          pdf.getPage(i).then(async (page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;
            
            return canvas.toDataURL();
          })
        );
      }
      
      const pages = await Promise.all(pagePromises);
      setPdfPages(pages);
      setIsLoading(false);
    } catch (err) {
      console.error('PDF loading error:', err);
      setError('Failed to load PDF preview');
      setIsLoading(false);
    }
  };

  // Load DOCX (using docx-preview library with comprehensive debugging)
  const loadDOCX = async () => {
    console.log('🔵 [DOCX] Starting DOCX preview load...');
    console.log('🔵 [DOCX] File URL:', fileUrl);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Step 1: Fetch file data
      console.log('🔵 [DOCX] Step 1: Fetching file...');
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('🔵 [DOCX] Response status:', response.status);
      console.log('🔵 [DOCX] Content-Type:', response.headers.get('content-type'));
      
      // Step 2: Convert to blob
      console.log('🔵 [DOCX] Step 2: Converting to blob...');
      const blob = await response.blob();
      console.log('🔵 [DOCX] Blob size:', blob.size, 'bytes');
      console.log('🔵 [DOCX] Blob type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('Empty file received');
      }
      
      // Step 3: Verify container exists
      if (!docxContainerRef.current) {
        throw new Error('Container element not found');
      }
      
      console.log('🔵 [DOCX] Step 3: Container found, clearing previous content...');
      docxContainerRef.current.innerHTML = '';
      
      // Step 4: Render with docx-preview
      console.log('🔵 [DOCX] Step 4: Rendering with docx-preview...');
      await renderAsync(blob, docxContainerRef.current, undefined, {
        className: 'docx-wrapper',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });
      
      console.log('✅ [DOCX] Rendering completed successfully!');
      console.log('✅ [DOCX] Container has content:', docxContainerRef.current.innerHTML.length > 0);
      
      setIsLoading(false);
    } catch (err) {
      console.error('❌ [DOCX] Loading error:', err);
      console.error('❌ [DOCX] Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(isArabic ? `فشل تحميل معاينة DOCX: ${err instanceof Error ? err.message : 'خطأ غير معروف'}` : `Failed to load DOCX: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Load PPTX (extract text content using JSZip)
  const loadPPTX = async () => {
    console.log('📊 [PPTX] Starting PPTX text extraction...');
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 [PPTX] Fetching file...');
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      console.log('📊 [PPTX] File size:', arrayBuffer.byteLength, 'bytes');
      
      // Import JSZip
      const JSZip = (await import('jszip')).default;
      
      console.log('📊 [PPTX] Unzipping PPTX...');
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      console.log('📊 [PPTX] Files in PPTX:', Object.keys(zip.files).length);
      
      // Extract slide files (ppt/slides/slide*.xml)
      const slideFiles = Object.keys(zip.files)
        .filter(name => name.match(/ppt\/slides\/slide\d+\.xml/))
        .sort()
        .slice(0, 5); // First 5 slides
      
      console.log('📊 [PPTX] Found', slideFiles.length, 'slide files');
      
      const slides: string[] = [];
      
      for (let i = 0; i < slideFiles.length; i++) {
        const slideFile = zip.files[slideFiles[i]];
        const xmlContent = await slideFile.async('text');
        
        // Extract text from XML (simple regex extraction)
        const textMatches = xmlContent.match(/<a:t>([^<]+)<\/a:t>/g) || [];
        const texts = textMatches.map(match => match.replace(/<\/?a:t>/g, ''));
        
        console.log(`📊 [PPTX] Slide ${i + 1}: Found ${texts.length} text elements`);
        
        // Create HTML for slide
        const slideHtml = `
          <div class="space-y-3">
            ${texts.map(text => `<p class="text-gray-800 dark:text-gray-200">${text}</p>`).join('')}
            ${texts.length === 0 ? '<p class="text-gray-500 italic">' + (isArabic ? 'شريحة بدون نص' : 'Slide without text') + '</p>' : ''}
          </div>
        `;
        
        slides.push(slideHtml);
      }
      
      console.log('✅ [PPTX] Extracted', slides.length, 'slides');
      setPptxSlides(slides);
      setIsLoading(false);
    } catch (err) {
      console.error('❌ [PPTX] Loading error:', err);
      setError(isArabic ? `فشل تحميل معاينة PPTX: ${err instanceof Error ? err.message : 'خطأ غير معروف'}` : `Failed to load PPTX: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPdfPages([]);
      setPptxSlides([]);
      setError(null);
      setIsContainerReady(false);
    }
  }, [isOpen]);

  // Load content when ready
  useEffect(() => {
    if (!isOpen || !fileUrl) return;
    
    // For DOCX, wait for container to be ready
    if (isDOCX && !isContainerReady) {
      console.log('⏳ [DOCX] Waiting for container...');
      return;
    }
    
    console.log('🟢 [PREVIEW] Starting load...', { isPDF, isDOCX, isPPTX, isImage });
    
    if (isPDF) {
      loadPDF();
    } else if (isDOCX) {
      loadDOCX();
    } else if (isPPTX) {
      loadPPTX();
    } else if (isImage) {
      setIsLoading(false);
    } else {
      setError('Unsupported file format');
      setIsLoading(false);
    }
  }, [isOpen, fileUrl, isContainerReady, isPDF, isDOCX, isPPTX, isImage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-16 left-0 right-0 bottom-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full h-[calc(90vh-4rem)] max-w-6xl bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate pr-4">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <span className="text-xl md:text-2xl text-white">×</span>
            </button>
          </div>

          {/* Preview Notice - Only for documents */}
          {!isImage && !error && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-center font-semibold text-sm flex-shrink-0">
              {isPDF ? (
                isArabic 
                  ? '📄 معاينة سريعة - يتم عرض أول 5 صفحات فقط. قم بتحميل الملف لعرض المحتوى الكامل'
                  : '📄 Quick Preview - Showing first 5 pages only. Download for full content'
              ) : isDOCX ? (
                isArabic 
                  ? '📄 معاينة سريعة - يتم عرض جزء من المستند (≈5 صفحات). قم بتحميل الملف لعرض المحتوى الكامل'
                  : '📄 Quick Preview - Showing partial document (≈5 pages). Download for full content'
              ) : isPPTX ? (
                isArabic 
                  ? '📊 معاينة سريعة - يتم عرض أول 5 شرائح. قم بتحميل الملف لعرض العرض التقديمي الكامل'
                  : '📊 Quick Preview - Showing first 5 slides. Download for full presentation'
              ) : (
                isArabic 
                  ? '📄 قم بتحميل الملف لعرضه'
                  : '📄 Download file to view'
              )}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin text-6xl mb-4">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {isArabic ? 'جاري تحميل المعاينة...' : 'Loading preview...'}
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
                  <button
                    onClick={onDownload}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isArabic ? 'تحميل الملف' : 'Download File'}
                  </button>
                </div>
              </div>
            )}

            {/* PDF Preview */}
            {!isLoading && !error && isPDF && pdfPages.length > 0 && (
              <div className="p-4 md:p-6 space-y-4">
                {pdfPages.map((pageDataUrl, index) => (
                  <div key={index} className="relative">
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      {isArabic ? `صفحة ${index + 1}` : `Page ${index + 1}`}
                    </div>
                    <img
                      src={pageDataUrl}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* DOCX Preview (using docx-preview library with height limit) */}
            {isDOCX && (
              <div className="docx-preview-container" style={{ display: isLoading || error ? 'none' : 'block' }}>
                <div 
                  ref={(el) => {
                    if (el) {
                      (docxContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                      if (!isContainerReady) {
                        console.log('🟢 [DOCX] Container mounted, setting ready state...');
                        setIsContainerReady(true);
                      }
                    }
                  }}
                />
                <div className="docx-fade-gradient" />
              </div>
            )}

            {/* PPTX Preview - Display slides */}
            {!isLoading && !error && isPPTX && pptxSlides.length > 0 && (
              <div className="p-4 md:p-6 space-y-4">
                {pptxSlides.map((slideHtml, index) => (
                  <div key={index} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-gray-600">
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      {isArabic ? `شريحة ${index + 1}` : `Slide ${index + 1}`}
                    </div>
                    <div 
                      className="pptx-slide-content mt-8"
                      dangerouslySetInnerHTML={{ __html: slideHtml }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image Preview (full image, no limit) */}
            {!isLoading && !error && isImage && (
              <div className="p-4 md:p-6 flex items-center justify-center">
                <img
                  src={fileUrl}
                  alt={title}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Footer with Download Button */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 px-4 py-3 text-center border-t border-gray-300 dark:border-gray-600 flex-shrink-0">
            <button
              onClick={onDownload}
              className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>📥</span>
              <span>{isArabic ? 'تحميل الملف الكامل' : 'Download Full File'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;
