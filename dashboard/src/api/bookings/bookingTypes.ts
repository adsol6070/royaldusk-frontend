export interface BookingSummary {
  id: string;
  guestName: string;
  guestEmail: string;
  guestMobile?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
  serviceType: "Package" | "Tour" | "Hotel" | "Activity" | "Transport";
  serviceId: string;
  serviceData: {
    name?: string;
    travelDate?: string;
    travelers?: number;
    [key: string]: any;
  };
  paymentStatus: "succeeded" | "pending" | "failed" | "canceled" | string;
  totalAmountPaid: number;
  currency: string | null;
}

export interface BookingDetail {
  id: string;
  guestName?: string;
  guestEmail?: string;
  guestMobile?: string;
  guestNationality?: string;
  remarks?: string;
  agreedToTerms: boolean;
  status: "Pending" | "Confirmed" | "Cancelled";
  confirmationPdfPath?: string | null;
  createdAt: string;
  serviceType: "Package" | "Tour" | "Hotel" | "Activity" | "Transport";
  serviceId: string;
  serviceData: Record<string, any>; // JSON blob for the selected service
  payments: {
    provider: string;
    providerRefId: string;
    status: string;
    amount: number;
    currency: string;
    receiptUrl?: string;
    cardBrand?: string;
    cardLast4?: string;
    createdAt: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
