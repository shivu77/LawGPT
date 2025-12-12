import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import SystemLoader from './components/SystemLoader';
import AboutModal from './components/AboutModal';
import LoginPage from './components/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavBarDemo } from './components/ui/NavBarDemo';
import './styles/EnhancedDesignSystem.css'; // Professional UI/UX enhancements

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [systemReady, setSystemReady] = useState(false);
  const [sidebarActiveTab, setSidebarActiveTab] = useState('overview'); // Lifted state from ChatInterface
  const [navbarActiveTab, setNavbarActiveTab] = useState('About'); // Track navbar active state separately
  const [isNavbarControlled, setIsNavbarControlled] = useState(false); // Track if navbar explicitly set the state
  const [showAboutModal, setShowAboutModal] = useState(false); // Control About modal visibility

  const handleSystemReady = () => {
    setSystemReady(true);
  };

  const handleSidebarTabChange = (tabId) => {
    setSidebarActiveTab(tabId);
  };

  const handleNavClick = (navItem) => {
    setNavbarActiveTab(navItem); // Update navbar active state
    setIsNavbarControlled(true); // Mark as navbar-controlled
    
    switch (navItem) {
      case 'About':
        // Show About modal
        setShowAboutModal(true);
        break;
      case 'Categories':
        setSidebarActiveTab('overview');
        break;
      case 'History':
        setSidebarActiveTab('history');
        break;
      case 'Settings':
        setSidebarActiveTab('settings');
        break;
      default:
        break;
    }
  };

  // Sync navbar active state when sidebar tab changes manually (via Dock clicks)
  useEffect(() => {
    // Only sync if navbar didn't explicitly control the change
    if (!isNavbarControlled) {
      switch (sidebarActiveTab) {
        case 'overview':
          setNavbarActiveTab('Categories');
          break;
        case 'history':
          setNavbarActiveTab('History');
          break;
        case 'settings':
          setNavbarActiveTab('Settings');
          break;
        default:
          break;
      }
    }
    setIsNavbarControlled(false); // Reset flag after sync
  }, [sidebarActiveTab, isNavbarControlled]);

  // Show login page if not authenticated
  if (authLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin-slow w-12 h-12 border-4 border-primary-text dark:border-gray-100 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-primary-textSecondary dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage />
      </ThemeProvider>
    );
  }

  if (!systemReady) {
    return (
      <ThemeProvider>
        <SystemLoader onReady={handleSystemReady} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col animate-fade-in bg-background dark:bg-gray-900 transition-colors duration-300 overflow-hidden w-screen box-border">
        <Header />
        {/* Tubelight Navigation Bar */}
        <NavBarDemo 
          activeTab={navbarActiveTab}
          onNavClick={handleNavClick}
        />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ paddingTop: '4.75rem' }}>
          <ErrorBoundary>
            <ChatInterface 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory}
              activeTab={sidebarActiveTab}
              onTabChange={handleSidebarTabChange}
            />
          </ErrorBoundary>
        </main>
        <Footer />
        {/* About Modal */}
        <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

