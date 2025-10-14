import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './components/modern/ModernComponents.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import ModernLandingPage from './pages/LandingPage/NewModernLanding.jsx';
import ModernNavbar from './components/modern/ModernNavbar.jsx';
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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminGuard from './components/AdminGuard.jsx';

// النظام الهرمي الجديد - المكونات المُحدّثة
import CategoriesPage from './pages/CategoriesPage/index.jsx';
import SubjectsPage from './pages/SubjectsPage/index.jsx';
import HierarchicalMaterialsPage from './pages/HierarchicalMaterialsPage/index.jsx';
import SubjectsList from './pages/SubjectsList/index.jsx';
import FilesPage from './pages/FilesPage/index.jsx';
import AdminPage from './pages/AdminPage/index.jsx';

// New Rebuilt Pages
import MaterialsPage from './pages/MaterialsPage/MaterialsPage.jsx';
import MaterialDetailPage from './pages/MaterialDetailPage/MaterialDetailPage.jsx';
import AdminPanel from './pages/AdminPage/AdminPanel.jsx';
import CompleteAdminPanel from './pages/AdminPage/CompleteAdminPanel.jsx';
import FileUploadForm from './components/Upload/FileUploadForm.jsx';
import EmailVerificationPage from './pages/EmailVerification/EmailVerificationPage.jsx';
import SessionTestPage from './pages/SessionTest/SessionTestPage.jsx';

const App = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Simulate initialization time and check for critical errors
    const initApp = async () => {
      try {
        // Check if Appwrite environment variables are available
        const hasAppwrite = import.meta.env.VITE_APPWRITE_URL && import.meta.env.VITE_APPWRITE_PROJECT_ID;
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
              
              {/* النظام الهرمي الجديد - المسارات المحدثة */}
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/materials/:categoryId" element={<MaterialsPage />} />
              <Route path="/materials/:categoryId/:subjectId" element={<MaterialsPage />} />
              <Route path="/material/:materialId" element={<MaterialDetailPage />} />
              
              {/* النظام الهرمي القديم - للتوافق العكسي */}
              <Route path="/old-materials" element={<ModernMaterials />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/subjects/:categoryId" element={<SubjectsPage />} />
              <Route path="/hierarchical/:categoryId/:subjectId" element={<HierarchicalMaterialsPage />} />
              
              <Route path="/login" element={<AppwriteLogin />} />
              <Route path="/signup" element={<AppwriteSignup />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/session-test" element={<SessionTestPage />} />
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
              
              <Route path="/upload" element={
                <ProtectedRoute>
                  <FileUploadForm />
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
              
              <Route path="/admin" element={
                <AdminGuard>
                  <CompleteAdminPanel />
                </AdminGuard>
              } />
              
              <Route path="/admin-simple" element={
                <AdminGuard>
                  <AdminPanel />
                </AdminGuard>
              } />
              
              <Route path="/admin-old" element={
                <AdminGuard>
                  <AdminPage />
                </AdminGuard>
              } />
              
              <Route path="*" element={<Modern404 />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App
