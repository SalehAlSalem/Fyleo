import React, { useEffect } from 'react';

/**
 * OAuth Callback Page
 * هذه الصفحة تفتح في popup بعد OAuth redirect
 * وظيفتها فقط: إرسال message للـ parent window
 */
const OAuthCallback = () => {

  useEffect(() => {
    console.log('💬 OAuth Callback: Sending success message to parent window');
    
    // تحقق إذا كانت في popup (عندها window.opener)
    if (window.opener) {
      // إرسال رسالة نجاح للـ parent window
      window.opener.postMessage(
        { type: 'OAUTH_SUCCESS' },
        window.location.origin
      );
      
      // إغلاق الـ popup بعد ثانية
      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      // لو مش في popup، روح للـ dashboard
      console.log('⚠️ Not in popup, redirecting to dashboard...');
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          تم تسجيل الدخول بنجاح!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          جاري إغلاق النافذة...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
