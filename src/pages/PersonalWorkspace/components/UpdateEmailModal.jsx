import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const UpdateEmailModal = ({ isOpen, onClose, currentEmail }) => {
  const { t } = useTranslation();
  const { user, updateEmail, verifyEmailUpdate } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Enter new email, 2: Enter OTP
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is using OAuth (Google)
  const isOAuthUser = user?.providerUid && user?.providerUid !== user?.$id;

  const handleSubmitNewEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!newEmail || !password) {
      setError('يرجى ملء جميع الحقول');
      setLoading(false);
      return;
    }

    if (newEmail === currentEmail) {
      setError('الإيميل الجديد يجب أن يكون مختلفاً عن الحالي');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('صيغة الإيميل غير صحيحة');
      setLoading(false);
      return;
    }

    try {
      const result = await updateEmail(newEmail, password);
      
      if (result.success) {
        setSuccess(result.message);
        setStep(2); // Move to OTP step
      } else {
        setError(result.error || 'فشل تحديث الإيميل');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!otp) {
      setError('يرجى إدخال رمز التحقق');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmailUpdate(user.$id, otp);
      
      if (result.success) {
        setSuccess('✅ تم تحديث الإيميل بنجاح!');
        setTimeout(() => {
          onClose();
          // Reset form
          setStep(1);
          setNewEmail('');
          setPassword('');
          setOtp('');
          setError('');
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'رمز التحقق غير صحيح');
      }
    } catch (err) {
      setError('حدث خطأ في التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStep(1);
      setNewEmail('');
      setPassword('');
      setOtp('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  // Don't show modal for OAuth users
  if (isOAuthUser) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              غير متاح لحسابات Google
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              لا يمكن تغيير الإيميل للحسابات المسجلة عبر Google OAuth
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              حسناً
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? '📧 تحديث الإيميل' : '🔐 تأكيد الإيميل'}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Current Email */}
        <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">الإيميل الحالي:</p>
          <p className="text-gray-900 dark:text-white font-medium">{currentEmail}</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
            <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Step 1: Enter New Email */}
        {step === 1 && (
          <form onSubmit={handleSubmitNewEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الإيميل الجديد
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                للتأكد من هويتك
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                تم إرسال رمز التحقق إلى:
              </p>
              <p className="text-gray-900 dark:text-white font-medium mt-1">
                {newEmail}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رمز التحقق (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                disabled={loading}
                required
                maxLength={6}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                تحقق من صندوق الوارد في الإيميل الجديد
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التحقق...' : 'تأكيد'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateEmailModal;
