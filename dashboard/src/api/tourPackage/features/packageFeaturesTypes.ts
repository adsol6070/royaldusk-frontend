export interface PackageFeature {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PackageFeaturePayload {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
