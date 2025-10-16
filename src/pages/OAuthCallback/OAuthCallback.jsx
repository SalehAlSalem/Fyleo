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
  const [debugMessage, setDebugMessage] = React.useState('جاري التحميل...');
  const [debugDetails, setDebugDetails] = React.useState([]);
  
  const addDebug = (msg) => {
    console.log(msg);
    setDebugDetails(prev => [...prev, msg]);
  };

  useEffect(() => {
    const handleOAuthCallback = async () => {
      addDebug('💬 OAuth Callback page loaded');
      setDebugMessage('تحميل الصفحة...');
      
      // تحقق من localStorage
      const oauthInProgress = localStorage.getItem('oauth_in_progress');
      addDebug(`🔍 OAuth in progress: ${oauthInProgress}`);
      
      if (oauthInProgress !== 'true') {
        addDebug('⚠️ No OAuth in progress');
        setDebugMessage('خطأ: لم يتم العثور على OAuth');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      // مسح localStorage
      localStorage.removeItem('oauth_in_progress');
      localStorage.removeItem('oauth_start_time');
      addDebug('✅ localStorage cleared');
      
      try {
        setDebugMessage('انتظار الجلسة...');
        addDebug('⏳ Waiting 1.5 seconds for session...');
        await new Promise(r => setTimeout(r, 1500));
        
        setDebugMessage('جلب بيانات المستخدم...');
        addDebug('🔍 Fetching user session...');
        const result = await authService.getCurrentUser();
        addDebug(`📊 Result: ${JSON.stringify(result)}`);
        
        if (result.success && result.user) {
          setDebugMessage('✅ تم العثور على الجلسة!');
          addDebug(`✅ User: ${result.user.email}`);
          
          // إنشاء user record في database
          try {
            setDebugMessage('التحقق من قاعدة البيانات...');
            addDebug('🔍 Checking database...');
            const existingUser = await usersService.getByEmail(result.user.email);
            
            if (!existingUser) {
              setDebugMessage('إنشاء سجل المستخدم...');
              addDebug('💾 Creating user record...');
              const newUser = await usersService.create({
                name: result.user.name || result.user.email.split('@')[0],
                email: result.user.email
              });
              addDebug('✅ User created!');
            } else {
              addDebug('✅ User exists in DB');
            }
          } catch (dbError) {
            addDebug(`⚠️ DB Error: ${dbError.message}`);
            setDebugMessage('تحذير: خطأ في قاعدة البيانات');
          }
          
          setDebugMessage('✅ نجح! جاري التحويل...');
          addDebug('🎯 Navigating to dashboard...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          addDebug(`❌ No session: ${JSON.stringify(result)}`);
          setDebugMessage('❌ فشل: لم يتم العثور على الجلسة');
          setTimeout(() => navigate('/login?error=oauth_failed', { replace: true }), 2000);
        }
      } catch (error) {
        addDebug(`❌ Error: ${error.message}`);
        setDebugMessage(`❌ خطأ: ${error.message}`);
        setTimeout(() => navigate('/login?error=oauth_error', { replace: true }), 3000);
      }
    };
    
    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {debugMessage}
          </h2>
        </div>
        
        {/* Debug Details */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            سجل التشخيص:
          </h3>
          <div className="text-left space-y-1">
            {debugDetails.map((detail, index) => (
              <div key={index} className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {detail}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
