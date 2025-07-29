
export interface PropertyAttributes {
  title: string;
  description: string;
  long_description: string;
  price: number;
  bedroom: number;
  bathroom: number;
  area: number;
  address: {
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    building_name: string;
    building_number: string;
  };
  display_address: string;
  search_type: 'sales' | 'lettings';
  building: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: string;
  images: Array<{
    order: number;
    srcUrl: string;
    updatedAt: string;
  }>;
  latitude?: number;
  longitude?: number;
}

export interface Property {
  id: number;
  attributes: PropertyAttributes;
}


export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PropertiesResponse {
  data: Property[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  listingType?: 'sale' | 'rent';
  city?: string;
}


