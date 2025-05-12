export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  importantInfo: string;
  location: string;
  price: number;
  duration: string;

  category_id: string;
  category_name: string;

  inclusion_ids: string[];
  inclusion_names: string[];

  exclusion_ids: string[];
  exclusion_names: string[];

  timeline_ids: string[];
  timeline_titles: string[];

  bookingPolicy: string;
  cancellationPolicy: string;
  paymentTerms: string;
  visaDetails: string;

  availability: "Available" | "Sold Out" | "Coming Soon";
  hotels: "Yes" | "No";
  imageUrl: string;

  published_at?: string;
  scheduled_at?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PackagePayload {
  name: string;
  slug: string;
  description: string;
  importantInfo: string;
  location: string;
  price: number;
  duration: string;

  category_id: string;
  inclusion_ids: string[];
  exclusion_ids: string[];
  timeline_ids: string[];

  bookingPolicy: string;
  cancellationPolicy: string;
  paymentTerms: string;
  visaDetails: string;

  availability: "Available" | "Sold Out" | "Coming Soon";
  hotels: "Yes" | "No";
  imageUrl: string;

  status: "draft" | "published" | "archived";
  published_at?: string;
  scheduled_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
