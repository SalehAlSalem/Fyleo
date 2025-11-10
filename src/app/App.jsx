import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from '@shared/ui/modern/ModernComponents.jsx';
import { AuthProvider } from '@/hooks/useAuth.jsx';
import { useTranslation } from 'react-i18next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import ModernNavbar from '@shared/ui/modern/ModernNavbar.jsx';
import MobileBottomNav from '@shared/ui/modern/MobileBottomNav.jsx';
import MobileSearchPopup from '@shared/ui/modern/MobileSearchPopup.jsx';
import CardModal from '@features/library/components/CardModal';
import FilePreviewModal from '@features/library/components/FilePreviewModal';
import ModernLandingPage from '@/pages/LandingPage/NewModernLanding.jsx';
import AppwriteLogin from '@/pages/login/AppwriteLogin.jsx';
import AppwriteSignup from '@/pages/signup/AppwriteSignup.jsx';
import Modern404 from '@/pages/404page/Modern404.jsx';
import ModernForgotPassword from '@/pages/forgotpassword/ModernForgotPassword.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

import LoadingScreen from '@shared/ui/LoadingScreen.jsx';
import ProtectedRoute from '@shared/ui/ProtectedRoute.jsx';
import AdminRoleGuard from '@/components/AdminRoleGuard.jsx';
import PersonalWorkspace from '@/pages/PersonalWorkspace/PersonalWorkspace.jsx';
import AdminPage from '@/pages/AdminPage/CompleteAdminPanel.jsx';
import ModernFooter from '@shared/ui/modern/ModernFooter.jsx';
import OAuthCallback from '@/pages/OAuthCallback/OAuthCallback.jsx';
import TermsOfService from '@/pages/LegalPages/TermsOfService.jsx';
import PrivacyPolicy from '@/pages/LegalPages/PrivacyPolicy.jsx';
import Disclaimer from '@/pages/LegalPages/Disclaimer.jsx';
import CookieConsentBanner from '@shared/ui/CookieConsent/CookieConsentBanner.jsx';
import DeleteAccountReauth from '@/pages/DeleteAccount/DeleteAccountReauth.jsx';
import DeleteAccountConfirm from '@/pages/DeleteAccount/DeleteAccountConfirm.jsx';
import VerifyEmail from '@/pages/VerifyEmail/VerifyEmail.jsx';
import FolderUploadPreview from '@/pages/FolderUploadPreview/FolderUploadPreview.jsx';

// النظام الهرمي الجديد - المكونات المُحدّثة
import LibraryPage from '@features/library/pages/LibraryPage';
import GPACalculatorPage from '@/pages/GPACalculatorPage/GPACalculatorPage';

// 🔄 Tiered Caching System - Realtime Sync
import { useRealtimeSync } from '@features/library/hooks';

// Component داخلي لاستخدام useLocation
const AppContent = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState(new Set());
  
  const isArabic = i18n.language === 'ar';
  
  // Close all popups when route changes
  useEffect(() => {
    setShowSearch(false);
    setCardModalOpen(false);
    setIsPreviewOpen(false);
  }, [location.pathname]);
  
  // ✅ Enable automatic cache synchronization with Appwrite Realtime
  useRealtimeSync();
  
  // Handle Material Preview
  const handleMaterialPreview = async (material) => {
    let updatedMaterial = material;
    if (material.fileId && !material.viewURL) {
      try {
        const { StorageService } = await import('@/config/StorageService');
        const publicUrl = StorageService.getPublicURL(material.fileId);
        updatedMaterial = { ...material, viewURL: publicUrl };
      } catch (error) {
        console.warn('⚠️ Could not generate public URL:', error);
      }
    }
    setPreviewMaterial(updatedMaterial);
    setIsPreviewOpen(true);
  };
  
  // Handle Bookmark Toggle
  const handleBookmark = async (materialId) => {
    try {
      const { bookmarksService } = await import('@/services/appwriteService');
      const result = await bookmarksService.toggle(materialId);
      
      if (result.bookmarked) {
        setBookmarkedMaterials(prev => {
          const newSet = new Set(prev);
          newSet.add(materialId);
          return newSet;
        });
      } else {
        setBookmarkedMaterials(prev => {
          const newSet = new Set(prev);
          newSet.delete(materialId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };
  
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
      <div data-theme={theme} className="min-h-screen transition-colors duration-300">
          <ScrollToTop />
          <ModernNavbar showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />
          <MobileBottomNav 
            onProfileClick={() => {
              setShowSearch(false);
              setCardModalOpen(false);
              setIsPreviewOpen(false);
              setShowUserMenu(!showUserMenu);
            }} 
            showUserMenu={showUserMenu}
            onSearchClick={() => {
              setCardModalOpen(false);
              setIsPreviewOpen(false);
              setShowSearch(!showSearch);
            }}
            showSearch={showSearch}
            onNavigate={() => {
              setShowSearch(false);
              setCardModalOpen(false);
              setIsPreviewOpen(false);
            }}
          />
          <main className="min-h-screen pt-12 md:pt-16">
            <Routes>
              <Route path="/" element={<ModernLandingPage />} />
              
              {/* النظام الهرمي الجديد - المسارات المحدثة */}
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/library/:categoryId" element={<LibraryPage />} />
              <Route path="/library/:categoryId/:subjectId" element={<LibraryPage />} />
              
              {/* النظام الهرمي القديم - للتوافق العكسي */}
              
              
              <Route path="/login" element={<AppwriteLogin />} />
              <Route path="/signup" element={<AppwriteSignup />} />
              <Route path="/forgot-password" element={<ModernForgotPassword />} />
              <Route path="/resetpassword" element={<ModernForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />

              <Route path="/gpa-calculator" element={<GPACalculatorPage />} />
              
              <Route path="/workspace" element={
                <ProtectedRoute>
                  <PersonalWorkspace />
                </ProtectedRoute>
              } />
              <Route path="/folder-preview" element={
                <ProtectedRoute>
                  <FolderUploadPreview />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoleGuard>
                  <AdminPage />
                </AdminRoleGuard>
              } />
              
              {/* Delete Account Flow */}
              <Route path="/delete-account/reauth" element={
                <ProtectedRoute>
                  <DeleteAccountReauth />
                </ProtectedRoute>
              } />
              <Route path="/delete-account/confirm" element={
                <ProtectedRoute>
                  <DeleteAccountConfirm />
                </ProtectedRoute>
              } />
              
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="*" element={<Modern404 />} />
            </Routes>
          </main>
          <ModernFooter />
          <CookieConsentBanner />
          
          {/* Mobile Search Popup */}
          <MobileSearchPopup 
            isOpen={showSearch} 
            onClose={() => setShowSearch(false)}
            onMaterialClick={async (material) => {
              // Fetch uploader info if not present
              let enrichedMaterial = material;
              if (material.uploaderId && !material.uploaderName) {
                try {
                  const { usersService } = await import('@/services/appwriteService');
                  const uploader = await usersService.getById(material.uploaderId);
                  enrichedMaterial = { ...material, uploaderName: uploader.name };
                } catch (error) {
                  console.warn('Could not fetch uploader:', error);
                }
              }
              setSelectedMaterial(enrichedMaterial);
              setSelectedPost(null);
              setShowSearch(false);
              setCardModalOpen(true);
            }}
            onPostClick={async (post) => {
              // Fetch uploader info if not present
              let enrichedPost = post;
              if (post.uploaderId && !post.uploaderName) {
                try {
                  const { usersService } = await import('@/services/appwriteService');
                  const uploader = await usersService.getById(post.uploaderId);
                  enrichedPost = { ...post, uploaderName: uploader.name };
                } catch (error) {
                  console.warn('Could not fetch uploader:', error);
                }
              }
              setSelectedPost(enrichedPost);
              setSelectedMaterial(null);
              setShowSearch(false);
              setCardModalOpen(true);
            }}
          />
          
          {/* Card Modal - Material/Post Preview */}
          <CardModal
            isOpen={cardModalOpen}
            onClose={() => {
              setCardModalOpen(false);
              setSelectedMaterial(null);
              setSelectedPost(null);
            }}
            material={selectedMaterial}
            post={selectedPost}
            onMaterialPreview={() => {
              if (selectedMaterial) {
                setCardModalOpen(false);
                handleMaterialPreview(selectedMaterial);
              }
            }}
            onBookmark={() => {
              if (selectedMaterial) {
                handleBookmark(selectedMaterial.$id);
              }
            }}
            isBookmarked={selectedMaterial ? bookmarkedMaterials.has(selectedMaterial.$id) : false}
            materialLabels={{
              fileSize: isArabic ? 'حجم الملف' : 'File Size',
              fileType: isArabic ? 'نوع الملف' : 'File Type',
              preview: isArabic ? 'معاينة' : 'Preview',
              download: isArabic ? 'تحميل' : 'Download',
              bookmark: isArabic ? 'حفظ' : 'Bookmark',
              info: isArabic ? 'معلومات' : 'Info',
              description: isArabic ? 'الوصف' : 'Description',
              size: isArabic ? 'الحجم' : 'Size',
              type: isArabic ? 'النوع' : 'Type',
              downloads: isArabic ? 'التحميلات' : 'Downloads',
              date: isArabic ? 'التاريخ' : 'Date',
              back: isArabic ? 'رجوع' : 'Back',
            }}
            postLabels={{
              link: isArabic ? 'رابط' : 'Link',
              viewPost: isArabic ? 'عرض المنشور' : 'View Post',
            }}
          />
          
          {/* File Preview Modal */}
          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            fileUrl={previewMaterial?.viewURL || ''}
            fileName={previewMaterial?.fileName || ''}
            mimeType={previewMaterial?.mimeType}
            title={previewMaterial?.title || ''}
            onDownload={async () => {
              if (!previewMaterial?.fileId) return;
              
              let downloadUrl = previewMaterial.viewURL;
              if (!downloadUrl) {
                try {
                  const { StorageService } = await import('@/config/StorageService');
                  downloadUrl = StorageService.getPublicURL(previewMaterial.fileId);
                } catch (error) {
                  console.error('❌ Could not generate public URL:', error);
                  return;
                }
              }
              
              try {
                const { downloadsService } = await import('@/services/appwriteService');
                await downloadsService.create(previewMaterial.$id);
              } catch (error) {
                console.error('❌ Error recording download:', error);
              }
              
              try {
                const response = await fetch(downloadUrl);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = previewMaterial.fileName || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error('Download error:', error);
                window.open(previewMaterial.viewURL, '_blank');
              }
            }}
          />
      </div>
  )
}

// Main App wrapper
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <SpeedInsights />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
