import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutesWithLayout from './AppRoutesWithLayout';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Test amacıyla eklendi
  console.log("App bileşeni çalıştı");
  
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutesWithLayout />
      </Router>
    </AuthProvider>
  );
}

export default App; 