import { HttpClient } from '../helpers';

// const accessTokenKey = 'access_token';

// // Function to get authorization headers
// const getAuthHeaders = (isMultipart = false) => {
//   const token = localStorage.getItem(accessTokenKey);
//   const headers = {};

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (isMultipart) {
//     headers['Content-Type'] = 'multipart/form-data';
//   }

//   return headers;
// };

function TourService() {
  return {

    getAllTours: () => {
      return HttpClient.get(`/tour-service/api/tours`, { _skipAuth: true });
    },

    getTourById: (id) => {
      return HttpClient.get(`/tour-service/api/tours/${id}`, { _skipAuth: true });
    },
  };
}

export default TourService();
