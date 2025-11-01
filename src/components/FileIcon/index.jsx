/**
 * FileIcon Component
 * Displays file icon based on fileType from database
 */

import React from 'react';

const FileIcon = ({ fileType, fileName, className = "w-12 h-12" }) => {
  // Use icon from fileType if available
  if (fileType?.icon) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ color: fileType.color || '#6B7280' }}
      >
        <span className="text-4xl">{fileType.icon}</span>
      </div>
    );
  }

  // Fallback: Try to determine from fileName extension
  const extension = fileName?.split('.').pop()?.toLowerCase();
  
  // Default icons based on common extensions (fallback only)
  const defaultIcons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽️',
    pptx: '📽️',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    zip: '📦',
    rar: '📦',
    mp4: '🎥',
    mp3: '🎵',
    txt: '📃'
  };

  const icon = defaultIcons[extension] || '📄';

  return (
    <div className={`flex items-center justify-center ${className} text-gray-600`}>
      <span className="text-4xl">{icon}</span>
    </div>
  );
};

export default FileIcon;
