export interface PackagePolicy {
  id: string;
  bookingPolicy: string;
  visaDetail: string;
  cancellationPolicy: string;
  paymentTerms: string;
  created_at: string;
  updated_at: string;
}

export interface PackagePolicyPayload {
  bookingPolicy: string;
  visaDetail: string;
  cancellationPolicy: string;
  paymentTerms: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
