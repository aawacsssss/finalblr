import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActionButtons from './components/FloatingActionButtons';
import Home from './pages/Home';
import Projects from './pages/Projects';
import OngoingProjects from './pages/OngoingProjects';
import CompletedProjects from './pages/CompletedProjects';
import UpcomingProjects from './pages/UpcomingProjects';
import About from './pages/About';
import FaaliyetAlanlari from './pages/FaaliyetAlanlari';
import SefaKalkan from './pages/SefaKalkan';
import Office from './pages/Office';
import Contact from './pages/Contact';
import ProjectPlaceholder from './pages/ProjectPlaceholder';
import Admin from './pages/Admin';
import { ProjectProvider } from './contexts/ProjectContext';
import ScrollToTop from './components/ScrollToTop';

function AppRoutesWithLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <ProjectProvider>
      {!isAdminPage && <Header />}
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projeler" element={<Projects />} />
          <Route path="/devam-eden-projeler" element={<OngoingProjects />} />
          <Route path="/tamamlanan-projeler" element={<CompletedProjects />} />
          <Route path="/baslanacak-projeler" element={<UpcomingProjects />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/faaliyet-alanlari" element={<FaaliyetAlanlari />} />
          <Route path="/sefa-kalkan" element={<SefaKalkan />} />
          <Route path="/ofis" element={<Office />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/proje/:id" element={<ProjectPlaceholder />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingActionButtons />}
      <ScrollToTop />
    </ProjectProvider>
  );
}

export default AppRoutesWithLayout; 