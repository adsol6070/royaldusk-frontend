import { HttpClient } from "../helpers";

// bookingservice for managing blog operations
function BookingService() {
  return {
    createPayment: (data) => {
      return HttpClient.post(`/payment-service/payment/create-intent`, data, { _skipAuth: true });
    },
  };
}

export default BookingService();
