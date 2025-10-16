import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usersService } from '../../services/appwriteService';

/**
 * OAuth Callback Handler
 * هذه الصفحة تتعامل مع الـ redirect بعد OAuth من Google
 * المشكلة على الموبايل: الـ session بتاخد وقت عشان تتنشأ
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const { checkUserSession } = useAuth();
  const [status, setStatus] = useState('checking'); // checking, success, error
  const [message, setMessage] = useState('جاري التحقق من تسجيل الدخول...');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      console.log('🔄 OAuth Callback - Starting session check...');
      
      // انتظر شوية عشان الـ session تتنشأ (مهم للموبايل)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // حاول تجيب الـ session
      const sessionResult = await checkUserSession();
      
      if (sessionResult && sessionResult.user) {
        console.log('✅ OAuth Success - User session found:', sessionResult.user);
        setStatus('success');
        setMessage('تم تسجيل الدخول بنجاح! جاري التحويل...');
        
        // تأكد من وجود المستخدم في قاعدة البيانات
        try {
          const existingUser = await usersService.getByEmail(sessionResult.user.email);
          
          if (!existingUser) {
            console.log('💾 Creating user record in database...');
            await usersService.create({
              name: sessionResult.user.name || sessionResult.user.email.split('@')[0],
              email: sessionResult.user.email
            });
            console.log('✅ User record created');
          }
        } catch (dbError) {
          console.error('⚠️ Database error (non-critical):', dbError);
          // ما نوقف العملية لو فشل حفظ قاعدة البيانات
        }
        
        // روح للـ dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
        
      } else {
        // لو ما لقينا session، حاول مرة ثانية
        if (retryCount < MAX_RETRIES) {
          console.log(`⏳ No session yet, retry ${retryCount + 1}/${MAX_RETRIES}...`);
          setRetryCount(prev => prev + 1);
          setMessage(`جاري التحقق... (محاولة ${retryCount + 1}/${MAX_RETRIES})`);
          
          setTimeout(() => {
            handleOAuthCallback();
          }, 1500); // انتظر 1.5 ثانية بين كل محاولة
        } else {
          // فشلت كل المحاولات
          console.error('❌ OAuth failed after all retries');
          setStatus('error');
          setMessage('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
          
          setTimeout(() => {
            navigate('/login?error=oauth_failed', { replace: true });
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('❌ OAuth Callback Error:', error);
      
      // حاول مرة ثانية
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleOAuthCallback();
        }, 1500);
      } else {
        setStatus('error');
        setMessage('حدث خطأ أثناء تسجيل الدخول');
        setTimeout(() => {
          navigate('/login?error=oauth_error', { replace: true });
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          {status === 'checking' && (
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          )}
          {status === 'success' && (
            <div className="text-6xl">✅</div>
          )}
          {status === 'error' && (
            <div className="text-6xl">❌</div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {status === 'checking' && 'جاري تسجيل الدخول'}
          {status === 'success' && 'نجح تسجيل الدخول!'}
          {status === 'error' && 'فشل تسجيل الدخول'}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Progress indicator */}
        {status === 'checking' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(retryCount / MAX_RETRIES) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Retry button for errors */}
        {status === 'error' && (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            العودة لتسجيل الدخول
          </button>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
