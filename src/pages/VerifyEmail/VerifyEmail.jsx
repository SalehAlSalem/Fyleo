import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ModernButton } from '@/shared/ui/modern/ModernComponents';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('جاري التحقق من البريد الإلكتروني...');
  const hasVerified = useRef(false); // منع التنفيذ المتكرر

  useEffect(() => {
    // إذا تم التحقق بالفعل، لا تعيد المحاولة
    if (hasVerified.current) return;
    
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setStatus('error');
      setMessage('رابط التحقق غير صالح');
      return;
    }

    const verify = async () => {
      hasVerified.current = true; // علّم أنه تم التنفيذ
      
      const result = await verifyEmail(userId, secret);
      
      if (result.success) {
        setStatus('success');
        setMessage('✅ تم التحقق من بريدك الإلكتروني بنجاح!');
        setTimeout(() => navigate('/workspace'), 2000);
      } else {
        setStatus('error');
        setMessage('❌ فشل التحقق. قد يكون الرابط منتهي الصلاحية.');
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="mb-6">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {status === 'verifying' && 'التحقق من البريد الإلكتروني'}
          {status === 'success' && 'تم التحقق بنجاح!'}
          {status === 'error' && 'فشل التحقق'}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {status === 'error' && (
          <ModernButton
            variant="primary"
            onClick={() => navigate('/workspace')}
            className="w-full"
          >
            العودة إلى Workspace
          </ModernButton>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
