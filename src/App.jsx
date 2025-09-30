import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './components/modern/ModernComponents.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import ModernNavbar from './components/modern/ModernNavbar.jsx';
import ModernLandingPage from './pages/LandingPage/ModernLanding.jsx';
import ModernMaterials from './pages/MaterialsPage/ModernMaterials.jsx';
import AppwriteLogin from './pages/login/AppwriteLogin.jsx';
import AppwriteSignup from './pages/signup/AppwriteSignup.jsx';
import ProfilePage from './pages/ProfilePage/index.jsx';
import Layout from './pages/OverviewPage';
import Modern404 from './pages/404page/Modern404.jsx';
import PDFViewer from './components/PDFViewer';
import ModernForgotPassword from './pages/forgotpassword/ModernForgotPassword.jsx';
import ModernDashboard from './components/Dashboard/ModernDashboard.jsx';
import Uploads from './components/Dashboard/uploads';
import Downloads from './components/Dashboard/downloads';
import Bookmarks from './components/Dashboard/bookmarks';
import Upload from './components/Dashboard/uploadform';
import LoadingScreen from './components/LoadingScreen.jsx';
import TestUploadSystem from './pages/TestUpload.jsx';
import TestFileDisplay from './pages/TestFileDisplay.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Simulate initialization time and check for critical errors
    const initApp = async () => {
      try {
        // Check if Appwrite environment variables are available
        const hasAppwrite = import.meta.env.VITE_APPWRITE_ENDPOINT && import.meta.env.VITE_APPWRITE_PROJECT_ID;
        if (!hasAppwrite) {
          console.warn('⚠️ Appwrite configuration missing - authentication may not work');
        }
        
        // Small delay to show loading screen
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('❌ App initialization error:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">خطأ في التحميل</h2>
          <p className="text-red-700 mb-4">عذراً، حدث خطأ أثناء تحميل التطبيق</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div data-theme={theme} className="min-h-screen transition-colors duration-300">
        <BrowserRouter>
          <ModernNavbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<ModernLandingPage />} />
              <Route path="/materials" element={<ModernMaterials />} />
              <Route path="/materials/:category" element={<ModernMaterials />} />
              <Route path="/login" element={<AppwriteLogin />} />
              <Route path="/signup" element={<AppwriteSignup />} />
              <Route path="/details" element={<Layout />} />
              <Route path="/details/:id" element={<Layout />} />
              <Route path="/pdfviewer/:id" element={<PDFViewer />} />
              <Route path="/forgot-password" element={<ModernForgotPassword />} />
              <Route path="/resetpassword" element={<ModernForgotPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ModernDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/uploads" element={
                <ProtectedRoute>
                  <Uploads />
                </ProtectedRoute>
              } />
              <Route path="/downloads" element={
                <ProtectedRoute>
                  <Downloads />
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
              <Route path="/test-upload" element={<TestUploadSystem />} />
              <Route path="/test-files" element={<TestFileDisplay />} />
              <Route path="*" element={<Modern404 />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App
