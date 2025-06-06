export interface BookingSummary {
  id: string;
  guestName: string;
  guestEmail: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
  packageName: string | null;
  travelDate: string | null;
  travelers: number;
  paymentStatus: string;
  totalAmountPaid: number;
  currency: string | null;
}

export interface BookingDetail {
  id: string;
  guestName: string;
  guestEmail: string;
  guestMobile: string;
  guestNationality: string;
  remarks?: string;
  agreedToTerms: boolean;
  status: string;
  confirmationPdfPath: string | null;
  createdAt: string;
  items: {
    id: string;
    packageId: string;
    packageName: string;
    travelers: number;
    startDate: string;
  }[];
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
