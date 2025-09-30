import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordContent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Mail className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            نسيت كلمة المرور؟
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              إرسال رابط إعادة التعيين
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة لتسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;