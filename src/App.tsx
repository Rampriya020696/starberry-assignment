import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SearchResults from './pages/SearchResults';
import PropertyDetail from './pages/PropertyDetail';

/**
 * Main App component with routing configuration
 */
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login route - default route */}
        <Route path="/" element={<Login />} />
        
        {/* Search results page */}
        <Route path="/search" element={<SearchResults />} />
        
        {/* Property detail page */}
        <Route path="/property/:id" element={<PropertyDetail />} />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
