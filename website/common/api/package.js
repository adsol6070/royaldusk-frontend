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

function PackageService() {
  return {
    sendEnquiry: (data) => {
      return HttpClient.post(`/package-service/api/package-enquiry`, data, { _skipAuth: true });
    },

    getAllPackages: () => {
      return HttpClient.get(`/package-service/api/package`, { _skipAuth: true });
    },

    getPackageById: (id) => {
      return HttpClient.get(`/package-service/api/package/${id}`, { _skipAuth: true });
    },

    getPackageLocations: () => {
      return HttpClient.get(`/package-service/api/package-location`, { _skipAuth: true });
    },

    getPackageByLocationId: (locationId) => {
      return HttpClient.get(`/package-service/api/package/location/${locationId}`, { _skipAuth: true });
    },
  };
}

export default PackageService();
