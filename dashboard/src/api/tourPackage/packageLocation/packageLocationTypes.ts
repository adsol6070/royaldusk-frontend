export interface PackageLocation {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageLocationPayload {
  name: string;
  image: File; 
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}