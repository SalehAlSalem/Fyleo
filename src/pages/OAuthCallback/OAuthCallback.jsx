import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { usersService } from '../../services/appwriteService';

/**
 * OAuth Callback Handler
 * هذه الصفحة تتعامل مع الـ redirect بعد OAuth من Google
 * المشكلة على الموبايل: الـ session بتاخد وقت عشان تتنشأ
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking, success, error
  
  // اكتشاف Safari على iOS
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafariIOS = isSafari && isIOS;
  
  const [message, setMessage] = useState(
    isSafariIOS 
      ? 'جاري التحقق من تسجيل الدخول... (قد يستغرق وقتاً أطول على iPhone)'
      : 'جاري التحقق من تسجيل الدخول...'
  );
  const retryCountRef = useRef(0);
  const isProcessingRef = useRef(false);
  
  // Safari على iOS يحتاج وقت أطول ومحاولات أكثر
  const MAX_RETRIES = isSafariIOS ? 8 : 5;
  const RETRY_DELAY = isSafariIOS ? 3000 : 2000; // 3 ثواني لـ Safari iOS

  const handleOAuthCallback = async () => {
    if (isProcessingRef.current) return; // منع التنفيذ المتعدد
    
    isProcessingRef.current = true;
    
    try {
      console.log(`🔄 OAuth Callback - Attempt ${retryCountRef.current + 1}/${MAX_RETRIES}`);
      if (isSafariIOS && retryCountRef.current === 0) {
        console.log('📱 Safari iOS detected - using extended retry settings');
      }
      
      // انتظر شوية عشان الـ session تتنشأ (مهم للموبايل، خاصة Safari iOS)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      // حاول تجيب الـ session مباشرة من authService
      const sessionResult = await authService.getCurrentUser();
      console.log('📊 Session result:', sessionResult);
      
      if (sessionResult && sessionResult.success && sessionResult.user) {
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
        if (retryCountRef.current < MAX_RETRIES) {
          console.log(`⏳ No session yet, retry ${retryCountRef.current + 1}/${MAX_RETRIES}...`);
          retryCountRef.current += 1;
          setMessage(`جاري التحقق... (محاولة ${retryCountRef.current}/${MAX_RETRIES})`);
          isProcessingRef.current = false;
          
          setTimeout(() => {
            handleOAuthCallback();
          }, RETRY_DELAY); // انتظر بين كل محاولة (3 ثواني لـ Safari iOS)
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
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        isProcessingRef.current = false;
        setTimeout(() => {
          handleOAuthCallback();
        }, RETRY_DELAY);
      } else {
        setStatus('error');
        setMessage('حدث خطأ أثناء تسجيل الدخول');
        isProcessingRef.current = false;
        setTimeout(() => {
          navigate('/login?error=oauth_error', { replace: true });
        }, 2000);
      }
    }
  };

  useEffect(() => {
    // تنفيذ مرة واحدة عند تحميل الصفحة
    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

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
              style={{ width: `${(retryCountRef.current / MAX_RETRIES) * 100}%` }}
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
