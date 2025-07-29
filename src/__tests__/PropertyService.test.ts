import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyService } from '../services/propertyService';
import type { Property } from '../types/Property';

(globalThis as any).fetch = vi.fn();


const mockCanvas = {
  getContext: vi.fn(),
  toDataURL: vi.fn(),
  width: 0,
  height: 0
};

const mockCtx = {
  drawImage: vi.fn()
};

vi.stubGlobal('document', {
  createElement: (tag: string) => {
    if (tag === 'canvas') return mockCanvas;
    return null;
  }
});

vi.stubGlobal('Image', class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  width: number = 800;
  height: number = 600;
  crossOrigin: string = '';

  constructor() {
    setTimeout(() => this.onload?.(), 0);
  }
});

describe('PropertyService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (mockCanvas.getContext as any).mockReturnValue(mockCtx);
    (mockCanvas.toDataURL as any).mockReturnValue('data:image/jpeg;base64,compressed');
  });

  describe('fetchProperties', () => {
    it('should fetch properties successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            attributes: {
              title: 'Test Property',
              price: 500000,
              bedroom: 3,
              bathroom: 2,
              area: 1200,
              address: {
                address1: '123 Test St',
                address2: 'London',
                address3: '',
                address4: '',
                postcode: 'SW1A 1AA',
                building_name: '',
                building_number: '123'
              },
              display_address: '123 Test St, London',
              search_type: 'sales',
              building: ['house'],
              images: [],
              featured: false,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
              publishedAt: '2024-01-01T00:00:00.000Z',
              description: 'A beautiful test property',
              long_description: 'A detailed description of the property'
            }
          }
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: 1
          }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await PropertyService.fetchProperties();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://mira-strapi-dev.q.starberry.com/api/properties')
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(PropertyService.fetchProperties()).rejects.toThrow('Failed to fetch properties');
    });
  });

  describe('compressImage', () => {
    it('should compress image successfully', async () => {
      const result = await PropertyService.compressImage('https://example.com/image.jpg');
      
      expect(result).toBe('data:image/jpeg;base64,compressed');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockCtx.drawImage).toHaveBeenCalled();
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.7);
    });

    it('should handle image load error', async () => {
      vi.stubGlobal('Image', class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';
        constructor() {
          setTimeout(() => this.onerror?.(), 0);
        }
      });

      const originalUrl = 'https://example.com/image.jpg';
      const result = await PropertyService.compressImage(originalUrl);
      
      expect(result).toBe(originalUrl);
    });

    it('should handle canvas context error', async () => {
      (mockCanvas.getContext as any).mockReturnValueOnce(null);

      const originalUrl = 'https://example.com/image.jpg';
      const result = await PropertyService.compressImage(originalUrl);
      
      expect(result).toBe(originalUrl);
    });

    it('should resize image if width exceeds maxWidth', async () => {
      vi.stubGlobal('Image', class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';
        width: number = 1000;
        height: number = 750;
        crossOrigin: string = '';
        constructor() {
          setTimeout(() => this.onload?.(), 0);
        }
      });

      await PropertyService.compressImage('https://example.com/image.jpg', 400);

      expect(mockCanvas.width).toBe(400);
      expect(mockCanvas.height).toBe(300);
    });
  });

  describe('getImageUrl', () => {
    it('should return thumbnail if available', () => {
      const property: Property = {
        id: 1,
        attributes: {
          title: 'Test Property',
          price: 500000,
          bedroom: 3,
          bathroom: 2,
          area: 1200,
          address: {
            address1: '123 Test St',
            address2: 'London',
            address3: '',
            address4: '',
            postcode: 'SW1A 1AA',
            building_name: '',
            building_number: '123'
          },
          display_address: '123 Test St, London',
          search_type: 'sales',
          building: ['house'],
          images: [],
          thumbnail: 'https://example.com/thumbnail.jpg',
          featured: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          publishedAt: '2024-01-01T00:00:00.000Z',
          description: 'A beautiful test property',
          long_description: 'A detailed description of the property'
        }
      };

      const imageUrl = PropertyService.getImageUrl(property);
      expect(imageUrl).toBe('https://example.com/thumbnail.jpg');
    });

    it('should return first image URL if no thumbnail', () => {
      const property: Property = {
        id: 1,
        attributes: {
          title: 'Test Property',
          price: 500000,
          bedroom: 3,
          bathroom: 2,
          area: 1200,
          address: {
            address1: '123 Test St',
            address2: 'London',
            address3: '',
            address4: '',
            postcode: 'SW1A 1AA',
            building_name: '',
            building_number: '123'
          },
          display_address: '123 Test St, London',
          search_type: 'sales',
          building: ['house'],
          images: [
            {
              order: 1,
              srcUrl: 'https://example.com/image1.jpg',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          ],
          thumbnail: '',
          featured: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          publishedAt: '2024-01-01T00:00:00.000Z',
          description: 'A beautiful test property',
          long_description: 'A detailed description of the property'
        }
      };

      const imageUrl = PropertyService.getImageUrl(property);
      expect(imageUrl).toBe('https://example.com/image1.jpg');
    });

    it('should return placeholder when no images exist', () => {
      const property: Property = {
        id: 1,
        attributes: {
          title: 'Test Property',
          price: 500000,
          bedroom: 3,
          bathroom: 2,
          area: 1200,
          address: {
            address1: '123 Test St',
            address2: 'London',
            address3: '',
            address4: '',
            postcode: 'SW1A 1AA',
            building_name: '',
            building_number: '123'
          },
          display_address: '123 Test St, London',
          search_type: 'sales',
          building: ['house'],
          images: [],
          thumbnail: '',
          featured: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          publishedAt: '2024-01-01T00:00:00.000Z',
          description: 'A beautiful test property',
          long_description: 'A detailed description of the property'
        }
      };

      const imageUrl = PropertyService.getImageUrl(property);
      expect(imageUrl).toBe('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=');
    });
  });

  describe('formatPrice', () => {
    it('should format price in GBP currency', () => {
      const formattedPrice = PropertyService.formatPrice(500000);
      expect(formattedPrice).toBe('£500,000');
    });

    it('should format price without decimals', () => {
      const formattedPrice = PropertyService.formatPrice(125500);
      expect(formattedPrice).toBe('£125,500');
    });
  });
});