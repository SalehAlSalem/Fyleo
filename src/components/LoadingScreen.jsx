import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">جاري تحميل Fyleo</h2>
        <p className="text-gray-600">جامعة البلقاء التطبيقية</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>🔥 تهيئة Firebase...</p>
          <p>📁 إعداد النظام الهجين...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;