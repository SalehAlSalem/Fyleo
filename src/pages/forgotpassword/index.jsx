import React, { useState } from 'react';
import { account } from '../../config/appwrite';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setError('فشل في إرسال رابط إعادة تعيين كلمة المرور. تأكد من البريد الإلكتروني.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 px-4 overflow-hidden">
        {/* Success Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                top: '-10%',
                left: `${Math.random() * 100}%`,
                animation: `confetti ${2 + Math.random() * 3}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              {['🎉', '✨', '⭐', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
        
        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
        
        <div className="max-w-md w-full relative">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="text-center">
              {/* Animated Success Icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative">
                  <CheckCircle className="mx-auto h-20 w-20 text-green-500 animate-bounce" style={{ animationDuration: '1s', animationIterationCount: '3' }} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                تحقق من بريدك الإلكتروني
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها
              </p>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <Link
                  to="/login"
                  className="relative inline-flex items-center justify-center w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    العودة لتسجيل الدخول
                    <span className="text-lg transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-md w-full relative">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-all mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">رجوع</span>
            </Link>
            
            {/* Animated Icon */}
            <div className="mb-6 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform duration-500">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              نسيت كلمة المرور؟
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              لا تقلق، سنرسل لك تعليمات إعادة التعيين 🔐
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    إرسال رابط إعادة التعيين
                    <span className="text-lg transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;