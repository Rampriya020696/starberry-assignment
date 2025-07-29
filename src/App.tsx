import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SearchResults from './pages/SearchResults';
import PropertyDetail from './pages/PropertyDetail';
import Header from './components/Header';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
};

/**
 * Main App component with routing configuration
 */
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login route - default route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        } />
        
        <Route path="/property/:id" element={
          <ProtectedRoute>
            <PropertyDetail />
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
