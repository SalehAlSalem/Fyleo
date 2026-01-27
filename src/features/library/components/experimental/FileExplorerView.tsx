/**
 * InteractiveGalleryView - Level 3 Revolutionary Design
 * Apple Photos meets Netflix - Immersive, beautiful, interactive
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Material } from '../../../../types/database';

interface FileExplorerViewProps {
  materials: Material[];
  onPreview: (material: Material) => void;
  onDownload?: (material: Material) => void;
  onBookmark?: (materialId: string) => void;
  bookmarkedIds: Set<string>;
}

type SortBy = 'name' | 'date' | 'size' | 'type';

export const FileExplorerView: React.FC<FileExplorerViewProps> = ({
  materials,
  onPreview,
  onDownload,
  onBookmark,
  bookmarkedIds,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(materials[0]?.$id || null);
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials.filter(m => 
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || a.fileName).localeCompare(b.title || b.fileName);
        case 'date':
          return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
        case 'size':
          return (b.fileSize || 0) - (a.fileSize || 0);
        case 'type':
          return (a.mimeType || '').localeCompare(b.mimeType || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [materials, searchQuery, sortBy]);

  const selectedMaterial = useMemo(
    () => filteredMaterials.find(m => m.$id === selectedId) || filteredMaterials[0],
    [filteredMaterials, selectedId]
  );

  // Get file icon
  const getFileIcon = (material: Material) => {
    const fileType = (material as any).fileType;
    if (fileType?.icon) return fileType.icon;
    
    const mime = material.mimeType?.toLowerCase() || '';
    if (mime.includes('pdf')) return '📄';
    if (mime.includes('word')) return '📝';
    if (mime.includes('powerpoint')) return '📊';
    if (mime.includes('excel')) return '📈';
    if (mime.includes('image')) return '🖼️';
    if (mime.includes('video')) return '🎥';
    return '📄';
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get background gradient based on file type
  const getGradient = (material: Material) => {
    const mime = material.mimeType?.toLowerCase() || '';
    if (mime.includes('pdf')) return 'from-red-500/20 via-pink-500/20 to-purple-500/20';
    if (mime.includes('word')) return 'from-blue-500/20 via-cyan-500/20 to-teal-500/20';
    if (mime.includes('powerpoint')) return 'from-orange-500/20 via-amber-500/20 to-yellow-500/20';
    if (mime.includes('excel')) return 'from-green-500/20 via-emerald-500/20 to-teal-500/20';
    if (mime.includes('image')) return 'from-purple-500/20 via-pink-500/20 to-rose-500/20';
    if (mime.includes('video')) return 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20';
    return 'from-gray-500/20 via-slate-500/20 to-zinc-500/20';
  };

  return (
    <div className="flex gap-6 h-[800px]">
      {/* Left Sidebar - Thumbnails */}
      <div className="w-80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Library</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">{filteredMaterials.length}</span>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 border-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="w-full mt-3 px-3 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Recent</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
        </div>

        {/* Thumbnails List */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedId(material.$id)}
              className={`
                group relative p-4 rounded-2xl cursor-pointer transition-all
                ${selectedId === material.$id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  text-3xl flex-shrink-0 transition-transform group-hover:scale-110
                  ${selectedId === material.$id ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}
                `}>
                  {getFileIcon(material)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`
                    font-medium text-sm truncate
                    ${selectedId === material.$id ? 'text-white' : 'text-gray-900 dark:text-white'}
                  `}>
                    {material.title || material.fileName}
                  </p>
                  <p className={`
                    text-xs mt-0.5
                    ${selectedId === material.$id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}
                  `}>
                    {formatSize(material.fileSize || 0)}
                  </p>
                </div>
                {bookmarkedIds.has(material.$id) && (
                  <span className={selectedId === material.$id ? 'text-yellow-300' : 'text-yellow-500'}>⭐</span>
                )}
              </div>
            </motion.div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-2 block">🔍</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">No files found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Large Preview */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {selectedMaterial && (
            <motion.div
              key={selectedMaterial.$id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden relative"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(selectedMaterial)}`}></div>

              {/* Content */}
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-6xl drop-shadow-2xl">{getFileIcon(selectedMaterial)}</span>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedMaterial.title || selectedMaterial.fileName}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(selectedMaterial.$createdAt)} • {formatSize(selectedMaterial.fileSize || 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowInfo(!showInfo)}
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                      </svg>
                    </button>
                  </div>

                  {selectedMaterial.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-4 line-clamp-2">
                      {selectedMaterial.description}
                    </p>
                  )}
                </div>

                {/* Preview Area */}
                <div className="flex-1 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto mb-8 relative">
                      {/* Animated Icon */}
                      <motion.div
                        animate={{ 
                          rotateY: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-9xl drop-shadow-2xl"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {getFileIcon(selectedMaterial)}
                      </motion.div>

                      {/* Floating Particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-500 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [-20, 20],
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>

                    {selectedMaterial.uploader && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                        <span className="text-sm">Uploaded by</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedMaterial.uploader.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPreview(selectedMaterial)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">👁️</span>
                      <span>Preview</span>
                    </motion.button>
                    
                    {onDownload && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDownload(selectedMaterial)}
                        className="px-6 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-2xl transition-all flex items-center gap-2"
                      >
                        <span className="text-xl">⬇️</span>
                        <span>Download</span>
                      </motion.button>
                    )}
                    
                    {onBookmark && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onBookmark(selectedMaterial.$id)}
                        className={`
                          px-6 py-4 font-semibold rounded-2xl transition-all flex items-center gap-2
                          ${bookmarkedIds.has(selectedMaterial.$id)
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          }
                        `}
                      >
                        <span className="text-xl">{bookmarkedIds.has(selectedMaterial.$id) ? '⭐' : '☆'}</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="absolute right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-8 overflow-auto shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Details</h3>
                      <button
                        onClick={() => setShowInfo(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">File Name</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">{selectedMaterial.fileName}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Size</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatSize(selectedMaterial.fileSize || 0)}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Modified</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(selectedMaterial.$createdAt)}</p>
                      </div>
                      
                      {selectedMaterial.uploader && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Uploaded By</label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedMaterial.uploader.name}</p>
                        </div>
                      )}

                      {selectedMaterial.description && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Description</label>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{selectedMaterial.description}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileExplorerView;
