import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import type { Property, SearchFilters } from '../types/Property';
import { PropertyService } from '../services/propertyService';

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const scrollPosition = useRef(0);
  const pageSize = 25;

 
  const [filters, setFilters] = useState<SearchFilters>({
    bedrooms: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    listingType: 'sale',
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

 
  useEffect(() => {
    if (location.state?.fromDetail) {
      window.scrollTo(0, scrollPosition.current);
    
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const { data, isLoading, error, refetch } = useProperties(currentPage, pageSize, filters);

 
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

  const LoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200" />
          <div className="p-5">
            <div className="h-6 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-8 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const { attributes } = property;
    const [imageUrl, setImageUrl] = useState<string>(PLACEHOLDER_IMAGE);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);
    const formattedPrice = PropertyService.formatPrice(attributes.price);
    const hasValidImage = attributes.thumbnail || (attributes.images && attributes.images.length > 0);

    useEffect(() => {
      const loadAndCompressImage = async () => {
        try {
          const originalUrl = PropertyService.getImageUrl(property);
          if (originalUrl === PLACEHOLDER_IMAGE) {
            setImageUrl(PLACEHOLDER_IMAGE);
            setIsImageLoading(false);
            return;
          }

          setIsImageLoading(true);
          const compressedUrl = await PropertyService.compressImage(originalUrl);
          setImageUrl(compressedUrl);
          setIsImageLoading(false);
        } catch (error) {
          console.error('Error loading image:', error);
          setHasImageError(true);
          setIsImageLoading(false);
        }
      };

      loadAndCompressImage();
    }, [property]);

    const handlePropertyClick = () => {
    
      scrollPosition.current = window.scrollY;
      setIsNavigating(true);

   
      navigate(`/property/${property.id}`, { 
        state: { 
          property,
          fromSearch: true
        }
      });
    };

    return (
      <div className="bg-white rounded-lg overflow-hidden cursor-pointer" onClick={handlePropertyClick}>
       
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={imageUrl}
            alt={attributes.title}
            className="w-full h-[220px] object-cover"
            onError={() => setHasImageError(true)}
          />
         
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-2xl font-light">CO</span>
            </div>
          </div>
       
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>


        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{attributes.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{attributes.bedroom} bedroom apartment for {attributes.search_type === 'sales' ? 'sale' : 'rent'}</p>
          <div className="text-xl font-bold mb-2">€{attributes.price.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  const priceOptions = [
    { value: undefined, label: 'No limit' },
    { value: 100000, label: '€100,000' },
    { value: 200000, label: '€200,000' },
    { value: 300000, label: '€300,000' },
    { value: 500000, label: '€500,000' },
    { value: 750000, label: '€750,000' },
    { value: 1000000, label: '€1,000,000' },
    { value: 2000000, label: '€2,000,000' },
    { value: 5000000, label: '€5,000,000' },
  ];


  const handleFilterChange = (filterName: keyof SearchFilters, value: any) => {
    setFilters(prev => {

      if (filterName === 'minPrice') {
        const numValue = value === '' ? undefined : Number(value);
        if (prev.maxPrice && numValue && numValue > prev.maxPrice) {
          return { ...prev, minPrice: prev.maxPrice, maxPrice: numValue };
        }
        return { ...prev, minPrice: numValue };
      }
      if (filterName === 'maxPrice') {
        const numValue = value === '' ? undefined : Number(value);
        if (prev.minPrice && numValue && numValue < prev.minPrice) {
          return { ...prev, maxPrice: prev.minPrice, minPrice: numValue };
        }
        return { ...prev, maxPrice: numValue };
      }
      return { ...prev, [filterName]: value === '' ? undefined : value };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
   
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold mb-6">Property for {filters.listingType === 'sale' ? 'Sale' : 'Rent'}</h1>
          
        
          <div className="flex flex-wrap gap-4 items-center">
       
            <select 
              className="px-4 py-2 border rounded-md text-sm min-w-[140px]"
              value={filters.listingType || 'sale'}
              onChange={(e) => handleFilterChange('listingType', e.target.value as 'sale' | 'rent')}
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

           
            <select 
              className="px-4 py-2 border rounded-md text-sm min-w-[140px]"
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Any Bedrooms</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Bedroom' : 'Bedrooms'}</option>
              ))}
              <option value="7">7+ Bedrooms</option>
            </select>

          
            <select 
              className="px-4 py-2 border rounded-md text-sm min-w-[120px]"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            >
              <option value="">Min Price</option>
              {priceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>


            <select 
              className="px-4 py-2 border rounded-md text-sm min-w-[120px]"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            >
              <option value="">Max Price</option>
              {priceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button
              onClick={() => setFilters({
                bedrooms: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                listingType: 'sale',
              })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
            
            <span className="ml-auto text-sm text-gray-600">
              {data?.meta?.pagination?.total || 0} Results
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center text-red-600">Error loading properties</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

      
        {data?.meta?.pagination && data.meta.pagination.pageCount > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: data.meta.pagination.pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'bg-white text-black border hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;