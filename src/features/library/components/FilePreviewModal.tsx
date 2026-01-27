/**
 * FilePreviewModal Component
 * Now redirects to dedicated preview page instead of modal
 */

import React, { useEffect } from 'react';

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
  mimeType = '',
}) => {
  useEffect(() => {
    if (isOpen && fileUrl) {
      // Redirect to preview page
      const params = new URLSearchParams({
        url: fileUrl,
        name: fileName,
        type: mimeType,
      });
      window.location.href = `/preview?${params.toString()}`;
      
      // Close modal after navigation starts
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [isOpen, fileUrl, fileName, mimeType, onClose]);

  // Return null - we're redirecting instead of showing modal
  return null;
};

export default FilePreviewModal;
