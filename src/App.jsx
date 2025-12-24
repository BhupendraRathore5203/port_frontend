import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Demos from './pages/Demos';
import Technologies from './pages/Technologies';
import Contact from './pages/Contact';
import MaintenanceMode from './components/MaintenanceMode';
import { publicApi } from './services/api';
import { ThemeProvider } from './contexts/ThemeContext';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { HelmetProvider } from 'react-helmet-async';
import SiteMetadata from './components/SiteMetadata';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check maintenance mode
        const maintenanceResponse = await publicApi.getMaintenanceStatus();
        setMaintenance(maintenanceResponse.data);

        // Load site settings for favicon/title
        try {
          const siteResponse = await publicApi.getSiteSettings();
          setSiteSettings(siteResponse.data);
        } catch (siteErr) {
          console.warn('Failed to load site settings:', siteErr);
        }

        // Load theme
        const themeResponse = await publicApi.getThemeSettings();
        if (themeResponse.data) {
          const root = document.documentElement;
          root.style.setProperty('--primary-color', themeResponse.data.primary_color);
          root.style.setProperty('--secondary-color', themeResponse.data.secondary_color);

          if (themeResponse.data.dark_mode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Check if in maintenance mode
  if (maintenance?.maintenance_mode) {
    return <MaintenanceMode />;
  }

  return (
    <HelmetProvider>
      <SiteMetadata siteSettings={siteSettings} />
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="projects/:projectSlug" element={<ProjectDetailPage />} />
                <Route path="/demos" element={<Demos />} />
                <Route path="/tech" element={<Technologies />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;