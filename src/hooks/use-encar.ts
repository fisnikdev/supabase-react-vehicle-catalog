import { useQuery, keepPreviousData } from "@tanstack/react-query";


const BASE_URL = import.meta.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";
const ENCAR_URL = `${BASE_URL}/functions/v1/encar`;

export interface EncarCar {
  id: number;
  manufacturer: string;
  model: string;
  badge: string;
  badgeDetail: string;
  year: number;
  priceKrw: number;
  priceEur: number;
  mileage: number;
  displacement?: number;
  photos?: string[];     
  fuelType: string;
  transmission: string;
  image: string;
  isWarranty: boolean;
}

interface Brand {
  english: string;
  korean: string;
}

interface BrandsResponse {
  brands: (Brand | string)[]; 
}

interface CarsResponse {
  cars: EncarCar[];
  total: number;
}

const FALLBACK_BRANDS = [
  "BMW", "Mercedes-Benz", "Audi", "Porsche", "Tesla", 
  "Land Rover", "Volkswagen", "Hyundai", "Kia", "Toyota"
];

export function useCarBrands() {
  return useQuery<string[]>({
    queryKey: ['encar-brands'],
    queryFn: async () => {
      try {
        const response = await fetch(`${ENCAR_URL}?action=brands`);
        if (!response.ok) return FALLBACK_BRANDS;
        
        const data = await response.json() as BrandsResponse;
        
        if (data.brands && Array.isArray(data.brands) && data.brands.length > 0) {
           return data.brands
             .map((b: Brand | string) => (typeof b === 'object' ? b.english || b.korean : b))
             .filter(Boolean) as string[];
        }
        
        return FALLBACK_BRANDS;
      } catch (error) {
        console.error('Failed to fetch brands, using fallback:', error);
        return FALLBACK_BRANDS;
      }
    },
    staleTime: 1000 * 60 * 60,
  });
}

interface ModelsResponse {
  models: string[];
}

const FALLBACK_MODELS: Record<string, string[]> = {
  "BMW": ["3 Series", "5 Series", "7 Series", "X3", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  "Audi": ["A3", "A4", "A6", "Q5", "Q7"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
};

export function useCarModels(manufacturer: string | null) {
  return useQuery<string[]>({
    queryKey: ['encar-models', manufacturer],
    queryFn: async () => {
      if (!manufacturer) return [];
      try {
        const response = await fetch(`${ENCAR_URL}?action=models&manufacturer=${encodeURIComponent(manufacturer)}`);
        if (!response.ok) return FALLBACK_MODELS[manufacturer] || [];
        const data = await response.json() as ModelsResponse;
        return data.models && data.models.length > 0 
          ? data.models 
          : (FALLBACK_MODELS[manufacturer] || []);
      } catch (error) {
        console.error('Failed to fetch models, using fallback:', error);
        return FALLBACK_MODELS[manufacturer] || [];
      }
    },
    enabled: !!manufacturer,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCarList(
  manufacturer: string | null,
  modelGroup: string | null,
  count: number = 20,
  page: number = 0,
  yearFrom?: number,
  priceFrom?: number,
  yearTo?: number,
  priceTo?: number,
  mileageFrom?: number,
  mileageTo?: number,
  fuelType?: string,
  transmission?: string,
  exteriorColor?: string,
  noAccident?: boolean,
  keyword?: string, 
  sort?: string     
) {
  return useQuery({
    queryKey: [
      'encar-cars', 
      manufacturer, 
      modelGroup, 
      count, 
      page, 
      yearFrom, 
      priceFrom, 
      yearTo, 
      priceTo, 
      mileageFrom, 
      mileageTo, 
      fuelType, 
      transmission, 
      exteriorColor, 
      noAccident,
      keyword, 
      sort
    ],
    queryFn: async () => {
      if (!manufacturer) return { cars: [], total: 0 };

      const params = new URLSearchParams();

      params.append('action', 'list');
      params.append('manufacturer', manufacturer);
      params.append('count', count.toString());
      params.append('page', page.toString());

      if (modelGroup) params.append('modelGroup', modelGroup);
      if (yearFrom) params.append('yearFrom', yearFrom.toString());
      if (yearTo) params.append('yearTo', yearTo.toString());
      if (priceFrom) params.append('priceFrom', priceFrom.toString());
      if (priceTo) params.append('priceTo', priceTo.toString());
      if (mileageFrom) params.append('mileageFrom', mileageFrom.toString());
      if (mileageTo) params.append('mileageTo', mileageTo.toString());
      if (fuelType) params.append('fuelType', fuelType);
      if (transmission) params.append('transmission', transmission);
      if (exteriorColor) params.append('exteriorColor', exteriorColor);
      
      if (noAccident === true) params.append('noAccident', 'true');
      if (noAccident === false) params.append('noAccident', 'false');

      if (keyword) params.append('keyword', keyword);
      if (sort) params.append('sort', sort);

      const response = await fetch(`${ENCAR_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });

      if (!response.ok) {
        console.error('Fetch error');
        throw new Error('Failed to fetch cars');
      }

      return response.json();
    },
    enabled: !!manufacturer,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData, 
  });
}

export function useFeaturedCars(brands: string[] = ['BMW', 'Mercedes-Benz', 'Audi']) {
  return useQuery<EncarCar[]>({
    queryKey: ['encar-featured', brands],
    queryFn: async () => {
      const promises = brands.map(async (brand) => {
        try {
          const response = await fetch(
            `${ENCAR_URL}?action=list&manufacturer=${encodeURIComponent(brand)}&count=2&page=0`
          );
          if (!response.ok) return [];
          const data: CarsResponse = await response.json();
          return data.cars || [];
        } catch (e) {
          return [];
        }
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export interface CarDetail extends EncarCar {
  images: string[];
 
  color: string;
  seats: number;
  doors: number;
  options: any;
  description: string;
  location: string;
  accidentHistory: boolean;
  mileageStatus: string;
}

export function useCarDetail(carId: string | undefined) {
  return useQuery<CarDetail>({
    queryKey: ['encar-detail', carId],
    queryFn: async () => {
      if (!carId) throw new Error('Car ID is required');
      const response = await fetch(`${ENCAR_URL}?action=detail&id=${encodeURIComponent(carId)}`);
      if (!response.ok) throw new Error('Failed to fetch car details');
      return response.json();
    },
    enabled: !!carId,
    staleTime: 1000 * 60 * 5,
  });
}