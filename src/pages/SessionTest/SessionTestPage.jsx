import React, { useState, useEffect } from 'react';
import { account } from '../../config/appwrite';
import { useAuth } from '../../hooks/useAuth';
import { ModernCard, ModernButton, ModernBadge } from '../../components/modern/ModernComponents';

/**
 * 🧪 Session Test Page
 * Test and debug authentication session issues
 */
const SessionTestPage = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Check Appwrite Configuration
    results.config = {
      endpoint: import.meta.env.VITE_APPWRITE_URL,
      project: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      status: import.meta.env.VITE_APPWRITE_URL && import.meta.env.VITE_APPWRITE_PROJECT_ID ? '✅' : '❌'
    };

    // Test 2: Check Cookies
    results.cookies = {
      present: document.cookie.length > 0,
      value: document.cookie ? '✅ Present' : '❌ None',
      details: document.cookie
    };

    // Test 3: Try to get current user
    try {
      const currentUser = await account.get();
      results.currentUser = {
        status: '✅ Success',
        id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        emailVerification: currentUser.emailVerification,
        labels: currentUser.labels
      };
    } catch (error) {
      results.currentUser = {
        status: '❌ Failed',
        error: error.message,
        code: error.code,
        type: error.type
      };
    }

    // Test 4: List sessions
    try {
      const sessions = await account.listSessions();
      results.sessions = {
        status: '✅ Success',
        total: sessions.total,
        sessions: sessions.sessions
      };
    } catch (error) {
      results.sessions = {
        status: '❌ Failed',
        error: error.message
      };
    }

    // Test 5: Get current session details
    try {
      const session = await account.getSession('current');
      results.sessionDetails = {
        status: '✅ Success',
        id: session.$id,
        provider: session.provider,
        created: new Date(session.$createdAt).toLocaleString('ar-SA')
      };
    } catch (error) {
      results.sessionDetails = {
        status: '❌ Failed',
        error: error.message
      };
    }

    setTestResults(results);
    setTesting(false);
  };

  const clearAndRetest = async () => {
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear local storage
    localStorage.clear();
    
    alert('تم مسح جميع البيانات. سيتم إعادة تحميل الصفحة.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 px-4">
      <div className="container mx-auto max-w-4xl py-8">
        <ModernCard className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            🧪 اختبار الجلسة والمصادقة
          </h1>

          {/* Auth Context Status */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-lg font-bold mb-2">📊 حالة useAuth Context</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Loading:</span>
                <ModernBadge variant={loading ? 'default' : 'success'}>
                  {loading ? 'جاري التحميل...' : 'مكتمل'}
                </ModernBadge>
              </div>
              <div className="flex justify-between">
                <span>User:</span>
                <ModernBadge variant={user ? 'success' : 'default'}>
                  {user ? `✅ ${user.email}` : '❌ لا يوجد'}
                </ModernBadge>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>جاري تشغيل الاختبارات...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Test 1: Configuration */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">
                  {testResults.config?.status} 1. إعدادات Appwrite
                </h3>
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <div>Endpoint: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{testResults.config?.endpoint}</code></div>
                  <div>Project: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{testResults.config?.project}</code></div>
                </div>
              </div>

              {/* Test 2: Cookies */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">
                  {testResults.cookies?.present ? '✅' : '❌'} 2. Cookies
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div>Status: {testResults.cookies?.value}</div>
                  {testResults.cookies?.details && (
                    <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs overflow-auto max-h-20">
                      {testResults.cookies.details}
                    </div>
                  )}
                </div>
              </div>

              {/* Test 3: Current User */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">
                  {testResults.currentUser?.status} 3. المستخدم الحالي (account.get())
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {testResults.currentUser?.id ? (
                    <div className="space-y-1">
                      <div>ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{testResults.currentUser.id}</code></div>
                      <div>Email: {testResults.currentUser.email}</div>
                      <div>Name: {testResults.currentUser.name}</div>
                      <div>Verified: {testResults.currentUser.emailVerification ? '✅' : '❌'}</div>
                      <div>Labels: {testResults.currentUser.labels?.join(', ') || 'لا يوجد'}</div>
                    </div>
                  ) : (
                    <div className="text-red-600 dark:text-red-400">
                      <div>Error: {testResults.currentUser?.error}</div>
                      <div>Code: {testResults.currentUser?.code}</div>
                      <div>Type: {testResults.currentUser?.type}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Test 4: Sessions List */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">
                  {testResults.sessions?.status} 4. الجلسات النشطة
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {testResults.sessions?.total !== undefined ? (
                    <div>
                      <div>Total Sessions: {testResults.sessions.total}</div>
                      {testResults.sessions.sessions?.map((s, i) => (
                        <div key={i} className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                          <div>Provider: {s.provider}</div>
                          <div>Created: {new Date(s.$createdAt).toLocaleString('ar-SA')}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-red-600 dark:text-red-400">
                      Error: {testResults.sessions?.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Test 5: Current Session Details */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">
                  {testResults.sessionDetails?.status} 5. تفاصيل الجلسة الحالية
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {testResults.sessionDetails?.id ? (
                    <div className="space-y-1">
                      <div>ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{testResults.sessionDetails.id}</code></div>
                      <div>Provider: {testResults.sessionDetails.provider}</div>
                      <div>Created: {testResults.sessionDetails.created}</div>
                    </div>
                  ) : (
                    <div className="text-red-600 dark:text-red-400">
                      Error: {testResults.sessionDetails?.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <ModernButton onClick={runTests} disabled={testing}>
              🔄 إعادة الاختبار
            </ModernButton>
            <ModernButton variant="outline" onClick={clearAndRetest}>
              🗑️ مسح البيانات وإعادة الاختبار
            </ModernButton>
            <ModernButton variant="outline" onClick={() => window.location.href = '/login'}>
              🔐 تسجيل الدخول
            </ModernButton>
          </div>

          {/* Diagnosis */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-bold mb-2 text-yellow-800 dark:text-yellow-200">
              💡 التشخيص
            </h3>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              {testResults.currentUser?.code === 401 && (
                <div>
                  ❌ <strong>المشكلة:</strong> لا توجد جلسة نشطة (401 Unauthorized)
                  <br />
                  ✅ <strong>الحل:</strong> سجل دخول من جديد
                </div>
              )}
              {!testResults.cookies?.present && (
                <div>
                  ❌ <strong>المشكلة:</strong> لا توجد cookies
                  <br />
                  ✅ <strong>الحل:</strong> تأكد من أن المتصفح يسمح بالـ cookies
                </div>
              )}
              {testResults.config?.status === '❌' && (
                <div>
                  ❌ <strong>المشكلة:</strong> إعدادات Appwrite غير صحيحة
                  <br />
                  ✅ <strong>الحل:</strong> تحقق من ملف .env
                </div>
              )}
              {testResults.currentUser?.id && testResults.sessions?.total === 0 && (
                <div>
                  ⚠️ <strong>تحذير:</strong> المستخدم موجود لكن لا توجد جلسات
                  <br />
                  ✅ <strong>الحل:</strong> قد تكون هناك مشكلة في التزامن
                </div>
              )}
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default SessionTestPage;
