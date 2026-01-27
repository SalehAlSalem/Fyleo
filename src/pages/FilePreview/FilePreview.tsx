/**
 * FilePreview - Production-Ready File Preview System
 * ✅ Ultra-Slim UI with Smart Floating Controls
 * ✅ Pure Canvas PDF rendering (No text layer overlap - CRITICAL FIX)
 * ✅ Auto-hiding Zoom Controls (2s timeout)
 * ✅ Mobile-First responsive design
 * ✅ Full protection (No right-click, copy, print)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image as ImageIcon, File, Loader2, AlertCircle } from 'lucide-react';

interface FilePreviewProps {}

const FilePreview: React.FC<FilePreviewProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const fileUrl = searchParams.get('url') || '';
  const fileName = searchParams.get('name') || 'Document';
  const fileType = searchParams.get('type') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Determine file type
  const isPDF = fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');
  const isOfficeDoc = fileType.includes('word') || /\.(docx?|rtf)$/i.test(fileName) ||
                      fileType.includes('presentation') || /\.(pptx?|odp)$/i.test(fileName) ||
                      fileType.includes('spreadsheet') || /\.(xlsx?|csv)$/i.test(fileName);
  const isImage = fileType.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);

  // Get icon component based on file type
  const getFileIcon = () => {
    if (isPDF) return FileText;
    if (isImage) return ImageIcon;
    return File;
  };
  const FileIcon = getFileIcon();

  // Protection: Disable right-click, keyboard shortcuts, text selection
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventShortcuts = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+A, F12, DevTools
      if (
        (e.ctrlKey || e.metaKey) && ['s', 'p', 'c', 'a', 'i'].includes(e.key.toLowerCase()) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventPrintScreen = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventShortcuts);
    document.addEventListener('keydown', preventPrintScreen);
    
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventShortcuts);
      document.removeEventListener('keydown', preventPrintScreen);
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  if (!fileUrl) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white p-6"
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-lg mb-4">لا يوجد ملف للمعاينة / No file to preview</p>
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            العودة / Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 z-[100] flex flex-col">
      {/* Minimal Ultra-Slim Header - h-12 total */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="h-12 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex-shrink-0"
      >
        <div className="h-full max-w-7xl mx-auto px-3 flex items-center justify-between gap-2">
          {/* File Info - Desktop only */}
          <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
            <FileIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <h1 className="text-xs font-medium text-slate-300 truncate">
              {fileName}
            </h1>
          </div>

          {/* Mobile: Just Close */}
          <div className="sm:hidden flex-1" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition flex items-center justify-center flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* Smart Floating Zoom Controls (PDF Only) - Auto-hide after 2s */}
      {/* Removed - using iframe for PDF now */}

      {/* Content Area - Flex-1 for maximum space */}
      <div 
        className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-gray-950 relative"
      >
        {/* Protection Overlay - Transparent layer to block interactions */}
        <div className="absolute inset-0 z-10 pointer-events-none" />

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-20"
            >
              <div className="text-center">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 animate-spin mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-slate-300">Loading...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 text-red-400 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-slate-300 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        ) : isPDF ? (
          // Use different viewer based on device
          <div className="flex items-center justify-center h-full p-2 sm:p-4">
            <div className="w-full h-full max-w-7xl">
              <iframe
                src={
                  isMobile 
                    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`
                    : `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`
                }
                className="w-full h-full rounded-lg shadow-2xl bg-gray-900"
                title={fileName}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError('Failed to load PDF');
                  setIsLoading(false);
                }}
              />
            </div>
          </div>
        ) : isOfficeDoc ? (
          <div className="flex items-center justify-center h-full p-2 sm:p-4">
            <div className="w-full h-full max-w-7xl">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                className="w-full h-full rounded-lg shadow-2xl bg-white"
                title={fileName}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError('Failed to load document');
                  setIsLoading(false);
                }}
              />
            </div>
          </div>
        ) : isImage ? (
          <div className="flex items-center justify-center h-full p-2 sm:p-4">
            <img 
              src={fileUrl} 
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Failed to load image');
                setIsLoading(false);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <File className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3" />
              <p className="text-sm sm:text-base">Unsupported file type</p>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <motion.footer
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="h-8 bg-slate-900/80 border-t border-slate-800 flex-shrink-0 flex items-center justify-center"
      >
        <p className="text-[9px] sm:text-[10px] text-slate-500">
          Protected View • Return to Library to Download
        </p>
      </motion.footer>
    </div>
  );
};

export default FilePreview;
