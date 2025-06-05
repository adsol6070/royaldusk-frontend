import { bookingApi } from "@/api/bookings/bookingApi";
import { BookingDetail, BookingSummary } from "@/api/bookings/bookingTypes";
import { useQuery } from "@tanstack/react-query";

export const useBookings = () =>
  useQuery<BookingSummary[], Error>({
    queryKey: ["bookings"],
    queryFn: bookingApi.getAllBookings,
  });

export const useBookingById = (id: string) =>
  useQuery<BookingDetail, Error>({
    queryKey: ["booking", id],
    queryFn: () => bookingApi.getBookingById(id),
    enabled: !!id,
  });
