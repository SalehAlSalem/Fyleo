import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { usersService } from '../../services/appwriteService';

/**
 * OAuth Callback Page
 * هذه الصفحة تفتح بعد OAuth redirect
 * تتحقق من الـ session وتنشئ user record
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const { checkUserSession } = useAuth();
  const [message, setMessage] = React.useState('جاري تسجيل الدخول...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('💬 OAuth Callback page loaded');
      
      // فحص URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');
      console.log(`🔑 userId: ${userId ? 'present' : 'missing'}, secret: ${secret ? 'present' : 'missing'}`);
      
      // تحقق من localStorage
      const oauthInProgress = localStorage.getItem('oauth_in_progress');
      
      if (oauthInProgress !== 'true') {
        console.warn('⚠️ No OAuth in progress');
        setMessage('خطأ: لم يتم العثور على OAuth');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      // مسح localStorage
      localStorage.removeItem('oauth_in_progress');
      localStorage.removeItem('oauth_start_time');
      
      try {
        let result = null;
        
        // إذا في userId و secret في الـ URL، استخدمهم لإنشاء session
        if (userId && secret) {
          setMessage('إنشاء الجلسة...');
          console.log('🔐 Creating session from OAuth2 token...');
          
          try {
            // استخدام account.createSession مباشرة
            const { account } = await import('../../config/appwrite');
            await account.createSession(userId, secret);
            console.log('✅ Session created!');
            
            // الآن جيب بيانات المستخدم وحدث الـ state
            setMessage('جلب بيانات المستخدم...');
            await new Promise(r => setTimeout(r, 500));
            result = await checkUserSession(); // هذا يحدث useAuth state
            console.log(`✅ User logged in: ${result.user?.email}`);
          } catch (sessionError) {
            console.error(`❌ Session error:`, sessionError);
            throw sessionError;
          }
        } else {
          // Fallback: session عادي (Windows/Android)
          console.log('⚠️ No userId/secret - trying regular session...');
          setMessage('التحقق من الجلسة...');
          
          await new Promise(r => setTimeout(r, 2000));
          result = await checkUserSession(); // هذا يحدث useAuth state
        }
        
        if (result && result.success && result.user) {
          console.log('✅ User session found:', result.user.email);
          
          // checkUserSession بيعمل create user record تلقائياً
          // ما في حاجة نعملها مرة ثانية
          
          setMessage('✅ تم تسجيل الدخول بنجاح!');
          console.log('🎯 Navigating to dashboard...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 500);
        } else {
          console.error('❌ No session found');
          setMessage('❌ فشل تسجيل الدخول');
          setTimeout(() => navigate('/login?error=oauth_failed', { replace: true }), 2000);
        }
      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        setMessage(`❌ خطأ: ${error.message}`);
        setTimeout(() => navigate('/login?error=oauth_error', { replace: true }), 3000);
      }
    };
    
    handleOAuthCallback();
  }, [navigate, checkUserSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          يرجى الانتظار قليلاً
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
