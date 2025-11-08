import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import DashboardLayout from './pages/DashboardLayout';
import UploadImage from './pages/UploadImage';
import UploadHistory from './pages/UploadHistory';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Research from './pages/Research';
import Profile from './pages/Profile';
import { Toaster } from './components/Toaster';
import RouteLoadingOverlay from './components/RouteLoadingOverlay';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

const AppContent = () => {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = window.setTimeout(() => setShowSplash(false), 500);
      return () => window.clearTimeout(timer);
    }
    setShowSplash(true);
    return undefined;
  }, [loading]);

  if (showSplash || loading) {
    return (
      <>
        <InitialLoadingScreen />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <RouteLoadingOverlay />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/research" element={<Research />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadImage />} />
          <Route path="history" element={<UploadHistory />} />
          <Route path="profile" element={<Profile />} />
          {/* Fallback to dashboard home for unknown nested routes */}
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen bg-background">
          <ScrollToTop />
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
