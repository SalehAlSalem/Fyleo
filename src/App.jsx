import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './components/modern/ModernComponents.jsx';
import ModernNavbar from './components/modern/ModernNavbar.jsx';
import ModernLandingPage from './pages/LandingPage/ModernLanding.jsx';
import ModernMaterials from './pages/MaterialsPage/ModernMaterials.jsx';
import ModernLogin from './pages/login/ModernLogin.jsx';
import ModernSignup from './pages/signup/ModernSignup.jsx';
import Layout from './pages/OverviewPage';
import Modern404 from './pages/404page/Modern404.jsx';
import PDFViewer from './components/PDFViewer';
import ModernForgotPassword from './pages/forgotpassword/ModernForgotPassword.jsx';
import ModernDashboard from './components/Dashboard/ModernDashboard.jsx';
import Uploads from './components/Dashboard/uploads';
import Downloads from './components/Dashboard/downloads';
import Bookmarks from './components/Dashboard/bookmarks';
import Upload from './components/Dashboard/uploadform';

const App = () => {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen transition-colors duration-300">
      <BrowserRouter>
        <ModernNavbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<ModernLandingPage />} />
            <Route path="/materials" element={<ModernMaterials />} />
            <Route path="/materials/:category" element={<ModernMaterials />} />
            <Route path="/login" element={<ModernLogin />} />
            <Route path="/signup" element={<ModernSignup />} />
            <Route path="/details" element={<Layout />} />
            <Route path="/details/:id" element={<Layout />} />
            <Route path="/pdfviewer/:id" element={<PDFViewer />} />
            <Route path="/resetpassword" element={<ModernForgotPassword />} />
            <Route path="/dashboard" element={<ModernDashboard />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<Modern404 />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
