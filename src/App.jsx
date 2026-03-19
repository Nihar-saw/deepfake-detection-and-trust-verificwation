import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import { AuthPages } from './pages/AuthPages';
import { AnimatePresence, motion } from 'framer-motion';

// Simple Toast Context
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="pt-16 min-h-screen"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ThemeProvider>
      <ToastContext.Provider value={{ showToast }}>
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary-500/30">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/login" element={<AuthPages isLogin={true} />} />
              <Route path="/signup" element={<AuthPages isLogin={false} />} />
            </Routes>
          </main>
          <Footer />

          {/* simple toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold shadow-2xl border border-white/10"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </ThemeProvider>
  );
}

export default App;
