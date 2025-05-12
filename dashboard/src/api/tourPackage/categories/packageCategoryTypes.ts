export interface PackageCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PackageCategoryPayload {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
