import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { usersService } from '../../services/appwriteService';

/**
 * OAuth Callback Page
 * هذه الصفحة تفتح بعد OAuth redirect
 * تتحقق من الـ session وتنشئ user record
 */
const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('💬 OAuth Callback page loaded');
      
      // تحقق من localStorage
      const oauthInProgress = localStorage.getItem('oauth_in_progress');
      
      if (oauthInProgress !== 'true') {
        console.warn('⚠️ No OAuth in progress, redirecting to login');
        navigate('/login');
        return;
      }
      
      // مسح localStorage
      localStorage.removeItem('oauth_in_progress');
      localStorage.removeItem('oauth_start_time');
      
      try {
        // انتظر شوية عشان الـ session تتنشأ
        await new Promise(r => setTimeout(r, 1500));
        
        // جيب بيانات المستخدم
        const result = await authService.getCurrentUser();
        
        if (result.success && result.user) {
          console.log('✅ User session found:', result.user);
          
          // إنشاء user record في database
          try {
            const existingUser = await usersService.getByEmail(result.user.email);
            
            if (!existingUser) {
              console.log('💾 Creating user record...');
              await usersService.create({
                name: result.user.name || result.user.email.split('@')[0],
                email: result.user.email
              });
              console.log('✅ User record created');
            } else {
              console.log('✅ User already exists in database');
            }
          } catch (dbError) {
            console.error('⚠️ Database error:', dbError);
          }
          
          // روح للـ dashboard
          navigate('/dashboard', { replace: true });
        } else {
          console.error('❌ No session found');
          navigate('/login?error=oauth_failed', { replace: true });
        }
      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        navigate('/login?error=oauth_error', { replace: true });
      }
    };
    
    handleOAuthCallback();
  }, [navigate]);

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
