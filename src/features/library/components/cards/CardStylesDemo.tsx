/**
 * Card Styles Demo Page
 * Compare all 3 card designs side-by-side
 * Use this to test and choose your favorite!
 */

import React from 'react';
import { MaterialCardMinimal } from './MaterialCardMinimal';
import { MaterialCardGlass } from './MaterialCardGlass';
import { MaterialCardGradient } from './MaterialCardGradient';

const demoMaterial = {
  $id: 'demo-1',
  $createdAt: new Date().toISOString(),
  title: 'Introduction to React Hooks',
  description: 'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.',
  fileName: 'react-hooks-guide.pdf',
  fileId: 'demo-file-1',
  fileSize: 2457600, // 2.4 MB
  mimeType: 'application/pdf',
  viewURL: 'https://example.com/demo.pdf',
  fileTypeId: 'ft-1',
  subjectId: 'sub-1',
  fileType: {
    $id: 'ft-1',
    nameEn: 'PDF Document',
    nameAr: 'ملف PDF',
    icon: '📄',
    educationalPurposeId: 'ep-1',
  }
} as any;

const demoLabels = {
  preview: 'Preview',
  download: 'Download',
  bookmark: 'Bookmark',
  fileSize: 'File Size',
  fileType: 'File Type',
};

export const CardStylesDemo: React.FC = () => {
  const [bookmarked, setBookmarked] = React.useState({
    minimal: false,
    glass: false,
    gradient: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Card Styles Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose your favorite design! 🎨
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Minimal Card */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                🎯 Minimal Elegant
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clean typography • Subtle animations • Professional
              </p>
            </div>
            <MaterialCardMinimal
              material={demoMaterial}
              onPreview={() => alert('Preview clicked!')}
              onBookmark={() => setBookmarked(prev => ({ ...prev, minimal: !prev.minimal }))}
              isBookmarked={bookmarked.minimal}
              labels={demoLabels}
            />
          </div>

          {/* Glass Card */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                💎 Glassmorphic
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Blur effects • Transparency • Modern depth
              </p>
            </div>
            <div 
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <MaterialCardGlass
                material={demoMaterial}
                onPreview={() => alert('Preview clicked!')}
                onBookmark={() => setBookmarked(prev => ({ ...prev, glass: !prev.glass }))}
                isBookmarked={bookmarked.glass}
                labels={demoLabels}
              />
            </div>
          </div>

          {/* Gradient Card */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                🌈 Gradient Dynamic
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vibrant colors • Bold energy • Playful
              </p>
            </div>
            <MaterialCardGradient
              material={demoMaterial}
              onPreview={() => alert('Preview clicked!')}
              onBookmark={() => setBookmarked(prev => ({ ...prev, gradient: !prev.gradient }))}
              isBookmarked={bookmarked.gradient}
              labels={demoLabels}
            />
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ⚖️ Features Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-4 text-gray-600 dark:text-gray-400">Feature</th>
                  <th className="pb-4 text-center">🎯 Minimal</th>
                  <th className="pb-4 text-center">💎 Glass</th>
                  <th className="pb-4 text-center">🌈 Gradient</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Clean & Professional</td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐</td>
                  <td className="text-center">⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Modern & Trendy</td>
                  <td className="text-center">⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Vibrant & Energetic</td>
                  <td className="text-center">⭐</td>
                  <td className="text-center">⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Animations</td>
                  <td className="text-center">⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐⭐</td>
                  <td className="text-center">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700 dark:text-gray-300">Best For</td>
                  <td className="text-center text-xs">Corporate</td>
                  <td className="text-center text-xs">Portfolio</td>
                  <td className="text-center text-xs">Creative</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Pick your favorite and update <code className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">GroupedContent.tsx</code>
          </p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-semibold hover:scale-105 transition-transform">
              Use Minimal
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
              Use Glass
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
              Use Gradient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
