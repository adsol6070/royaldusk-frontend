import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { ApiResponse, BookingDetail, BookingSummary } from "./bookingTypes";

export const bookingApi = {
  getAllBookings: async (): Promise<BookingSummary[]> => {
    const response = await httpClient.get<ApiResponse<BookingSummary[]>>(
      API_ENDPOINTS.BOOKING.GET_ALL
    );
    return response.data.data;
  },
  getBookingById: async (id: string): Promise<BookingDetail> => {
    if (!id) throw new Error("No ID passed to getBookingById");
    console.log("📡 Fetching booking by ID:", id);

    const response = await httpClient.get<ApiResponse<BookingDetail>>(
      API_ENDPOINTS.BOOKING.GET_BY_ID(id)
    );

    console.log("✅ Booking API Response:", response);
    return response.data.data;
  },

  downloadBookingConfirmation: async (id: string): Promise<Blob> => {
    if (!id) throw new Error("No ID passed to downloadBookingConfirmation");

    const response = await httpClient.get(
      API_ENDPOINTS.BOOKING.DOWNLOAD_CONFIRMATION(id),
      {
        responseType: "blob",
      }
    );

    return response.data as Blob;
  },
};
