export interface Tour {
  id: string; 
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourPayload {
  name: string;
  description: string;
  location: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
