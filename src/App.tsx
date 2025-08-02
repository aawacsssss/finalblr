import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import AppRoutesWithLayout from './AppRoutesWithLayout';
import Admin from './pages/Admin';
import MaintenancePage from './components/MaintenancePage';
import { maintenanceService } from './services/supabaseService';
import './App.css';

// Modern tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a2236',
    },
    secondary: {
      main: '#e6d09c',
    },
    background: {
      default: '#f7f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceSettings, setMaintenanceSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const settings = await maintenanceService.getSettings();
        if (settings) {
          setIsMaintenanceMode(settings.is_maintenance_mode);
          setMaintenanceSettings(settings);
        }
      } catch (error) {
        console.error('Bakım modu kontrolü hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);



  // Bakım modu aktifse bakım sayfasını göster
  if (isMaintenanceMode) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaintenancePage settings={maintenanceSettings || {}} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProjectProvider>
          <Router>
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/*" element={<AppRoutesWithLayout />} />
            </Routes>
          </Router>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 