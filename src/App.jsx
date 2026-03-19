import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AuthPages from './pages/AuthPages';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col font-sans selection:bg-primary-500/30">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                {/* Protected Routes */}
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                } />

                {/* Public Auth Routes */}
                <Route path="/login" element={<AuthPages isLogin={true} />} />
                <Route path="/signup" element={<AuthPages isLogin={false} />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
