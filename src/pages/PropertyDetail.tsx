import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import type { Property } from '../types/Property';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const PropertyDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const property = location.state?.property as Property | undefined;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!property) {
      navigate('/search');
      return;
    }

    setIsLoading(false);
  }, [navigate, property]);

  useEffect(() => {
    if (property) {
    
      window.history.replaceState(
        { property },
        '',
        `/property/${property.id}`
      );

     
      document.title = `${property.attributes.title} | Property Search Portal`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `${property.attributes.description} - ${property.attributes.display_address}`
        );
      }
    }

  
    return () => {
      document.title = 'Property Search Portal';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Property Search Portal - Find your perfect property');
      }
    };
  }, [property]);

  const handleBackToSearch = () => {
    navigate('/search', { state: { fromDetail: true } });
  };



  const navigateImage = (direction: 'prev' | 'next') => {
    if (!property?.attributes.images) return;

    const totalImages = property.attributes.images.length;
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading property details...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Property not found</h2>
          <button
            onClick={handleBackToSearch}
            className="text-blue-600 hover:underline"
          >
            Back to search results
          </button>
        </div>
      </div>
    );
  }

  const { attributes } = property;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSearch}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src={attributes.images[currentImageIndex]?.srcUrl || PLACEHOLDER_IMAGE}
                alt={attributes.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Navigation - Now outside the image container */}
            {attributes.images.length > 1 && (
              <div className="absolute inset-x-0 top-[45%] flex justify-between px-4">
                <button
                  onClick={() => navigateImage('prev')}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {attributes.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {attributes.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <img
                      src={image.srcUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

        
          <div>
          
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">€{attributes.price.toLocaleString()}</h1>
              <p className="text-lg text-gray-600">{attributes.bedroom} bedroom apartment for {attributes.search_type === 'sales' ? 'sale' : 'rent'}</p>
            </div>

        
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">FACTS & FEATURES</h2>
              
             
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-gray-600">• {attributes.bedroom} Bedroom</span>
                <span className="text-gray-600">• {attributes.bathroom} Reception Rooms</span>
                <span className="text-gray-600">• Garden</span>
                <span className="text-gray-600">• Unfurnished</span>
                <span className="text-gray-600">• Available Now</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-gray-600 mb-1">Neighbourhood:</dt>
                  <dd className="font-medium">{attributes.address.address2}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Price per sqm:</dt>
                  <dd className="font-medium">€{Math.round(attributes.price / attributes.area).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Energy Rating:</dt>
                  <dd className="font-medium">D</dd>
                </div>
                <div>
                  <dt className="text-gray-600 mb-1">Council Tax Band:</dt>
                  <dd className="font-medium">A</dd>
                </div>
              </div>
            </div>

      
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Benefits of letting through John Shepherd:</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">• Online application process</li>
                <li className="text-gray-600">• Tenants insurance products available</li>
                <li className="text-gray-600">• Secure online payments</li>
                <li className="text-gray-600">• No Deposit Option may be available</li>
                <li className="text-gray-600">• Online property maintenance platform</li>
                <li className="text-gray-600">• Fully staffed high street branches</li>
              </ul>
            </div>

          
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
              <button className="w-full bg-black text-white py-4 px-4 rounded text-lg font-medium hover:bg-gray-900 transition-colors">
                CONTACT AGENT
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;