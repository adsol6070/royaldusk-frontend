import { HttpClient } from "../helpers";

// bookingservice for managing blog operations
function BookingService() {
  return {
    createBooking: (data) => {
      return HttpClient.post(`/booking-service/api/booking`, data, { _skipAuth: true });
    },
    getBookingById: (id) => {
      return HttpClient.get(`/booking-service/api/booking/${id}`, { _skipAuth: true });
    },
  };
}

export default BookingService();
