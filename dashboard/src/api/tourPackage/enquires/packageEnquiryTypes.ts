// Full Enquiry Data Structure (e.g. from API)
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  isdCode: string;
  dob: string;
  adults: string;
  children: string;
  flightBooked: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  packageID: string;
  package?: {
    id: string;
    name: string;
    price: number;
  };
}

// Payload for creating a new Enquiry (e.g. POST request)
export interface EnquiryPayload {
  name: string;
  email: string;
  mobile: string;
  isdCode: string;
  dob: string;
  adults: string;
  children: string;
  flightBooked: string;
  remarks?: string;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
