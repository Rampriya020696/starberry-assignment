import type { Property, PropertiesResponse, SearchFilters } from '../types/Property';

const BASE_URL = 'https://mira-strapi-dev.q.starberry.com/api';

export class PropertyService {
  static async fetchProperties(
    page: number = 1,
    pageSize: number = 25,
    filters?: SearchFilters
  ): Promise<PropertiesResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'sort[0]': 'createdAt:desc'
      });

      // Add filters to the query parameters
      if (filters) {
        if (filters.minPrice) {
          params.append('filters[price][$gte]', filters.minPrice.toString());
        }
        if (filters.maxPrice) {
          params.append('filters[price][$lte]', filters.maxPrice.toString());
        }
        if (filters.bedrooms) {
          params.append('filters[bedroom][$eq]', filters.bedrooms.toString());
        }
        if (filters.bathrooms) {
          params.append('filters[bathroom][$eq]', filters.bathrooms.toString());
        }
        if (filters.listingType) {
          params.append('filters[search_type][$eq]', filters.listingType === 'sale' ? 'sales' : 'lettings');
        }
      }

      const response = await fetch(`${BASE_URL}/properties?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  static async compressImage(url: string, maxWidth: number = 400): Promise<string> {
    try {
      
      const img = new Image();
      
         const imageLoadPromise = new Promise<string>((resolve, reject) => {
        img.onload = () => {

          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (maxWidth * height) / width;
            width = maxWidth;
          }

        
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

     
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedUrl);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      });

      
      img.crossOrigin = 'anonymous';
      img.src = url;

      return await imageLoadPromise;
    } catch (error) {
      console.error('Error compressing image:', error);
      return url; 
    }
  }

  static getImageUrl(property: Property): string {

    if (property.attributes.thumbnail) {
      return property.attributes.thumbnail;
    }

  
    const images = property.attributes.images;
    if (images && images.length > 0) {
      return images[0].srcUrl;
    }

    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}