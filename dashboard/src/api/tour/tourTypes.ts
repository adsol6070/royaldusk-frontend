export interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  duration: number; 
  tag: string;
  locationId: string;
  location: {
    id: string;
    name: string;
  };
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  tourAvailability: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourPayload {
  name: string;
  slug: string;
  description: string;
  price: string;
  tourAvailability: string;
  duration: string;
  tag: string;
  locationId: string;
  categoryID: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
