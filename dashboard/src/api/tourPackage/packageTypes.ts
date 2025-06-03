export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  currency: string;
  importantInfo: string;
  locationId: string;
  location: {
    id: string;
    name: string;
  };
  price: number;
  duration: number; 
  availability: "Available" | "SoldOut" | "ComingSoon";
  hotels: "Yes" | "No";
  imageUrl: string;
  review: number;
  categoryID: string;
  category: {
    id: string;
    name: string;
  };
  features: {
    id: string;
    name: string;
  }[];
  itineraries: {
    id: string;
    title: string;
    description: string;
  }[];
  inclusions: {
    id: string;
    name: string;
  }[];
  exclusions: {
    id: string;
    name: string;
  }[];
  policyID: string;
  policy: {
    id: string;
    bookingPolicy: string;
    cancellationPolicy: string;
    paymentTerms: string;
    visaDetail: string;
  };
  timeline: any;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  published_at?: string;
  scheduled_at?: string;
}

// export interface PackagePayload {
//   name: string;
//   slug: string;
//   description: string;
//   importantInfo: string;
//   location: string;
//   price: number;
//   duration: number;

//   availability: "Available" | "SoldOut" | "ComingSoon";
//   hotels: "Yes" | "No";
//   imageUrl: string;

//   categoryID: string;
//   inclusion_ids: string[];
//   exclusion_ids: string[];
//   feature_ids: string[];
//   timeline_ids: string[];

//   bookingPolicy: string;
//   cancellationPolicy: string;
//   paymentTerms: string;
//   visaDetail: string;

//   status: "draft" | "published" | "archived";
//   published_at?: string;
//   scheduled_at?: string;
// }

export interface PackagePayload {
  name: string;
  slug: string;
  description: string;
  importantInfo: string;
  locationId: string;
  price: string; 
  duration: string;
  availability: "Available" | "SoldOut" | "ComingSoon";
  hotels: "Yes" | "No";
  categoryID: string;
  featureIDs: string[];
  // itineraryIDs: string[];
  timeline: {
    day: number;
    title: string;
    description: string;
    selectedOptions: {
      value: string;
      label: string;
    }[];
  }[]; 
  inclusionIDs: string[];
  exclusionIDs: string[];
  policyID: string;
  imageUrl: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
