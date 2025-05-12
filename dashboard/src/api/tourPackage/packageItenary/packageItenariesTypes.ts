export interface PackageItinerary {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PackageItineraryPayload {
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
