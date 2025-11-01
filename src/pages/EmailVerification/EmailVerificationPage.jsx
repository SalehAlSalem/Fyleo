import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ModernCard, ModernButton, ModernAlert } from '@shared/ui/modern/ModernComponents';

/**
 * 📧 Email Verification Page
 * Handles email verification after user clicks link in email
 */
const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setStatus('error');
      setMessage('رابط التحقق غير صالح');
      return;
    }

    try {
      const result = await authService.completeEmailVerification(userId, secret);
      
      if (result.success) {
        setStatus('success');
        setMessage('تم تأكيد بريدك الإلكتروني بنجاح!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message || 'فشل تأكيد البريد الإلكتروني');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء تأكيد البريد الإلكتروني');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <ModernCard className="w-full max-w-md p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                جاري التحقق...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                يرجى الانتظار بينما نقوم بتأكيد بريدك الإلكتروني
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                تم التأكيد بنجاح!
              </h2>
              <ModernAlert type="success" className="mb-4">
                {message}
              </ModernAlert>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                سيتم تحويلك إلى صفحة تسجيل الدخول...
              </p>
              <ModernButton onClick={() => navigate('/login')}>
                الذهاب لتسجيل الدخول الآن
              </ModernButton>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                فشل التأكيد
              </h2>
              <ModernAlert type="error" className="mb-4">
                {message}
              </ModernAlert>
              <div className="flex gap-2 justify-center">
                <ModernButton onClick={() => navigate('/login')}>
                  تسجيل الدخول
                </ModernButton>
                <ModernButton variant="outline" onClick={() => navigate('/signup')}>
                  إنشاء حساب جديد
                </ModernButton>
              </div>
            </>
          )}
        </div>
      </ModernCard>
    </div>
  );
};

export default EmailVerificationPage;

