import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './components/modern/ModernComponents';
import ModernNavbar from './components/modern/ModernNavbar';
import ModernLandingPage from './pages/LandingPage/ModernLanding';
import ModernMaterials from './pages/MaterialsPage/ModernMaterials';
import ModernLogin from './pages/login/ModernLogin';
import ModernSignup from './pages/signup/ModernSignup';
import Layout from './pages/OverviewPage';
import PageNoteFound from './pages/404page'
import PDFViewer from './components/PDFViewer';
import Reset from './pages/forgotpassword'
import ModernDashboard from './components/Dashboard/ModernDashboard';
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
            <Route path="/resetpassword" element={<Reset />} />
            <Route path="/dashboard" element={<ModernDashboard />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<PageNoteFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
