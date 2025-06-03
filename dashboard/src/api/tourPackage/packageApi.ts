import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { ApiResponse, Package } from "./packageTypes";

export const packageApi = {
  getAllPackages: async (): Promise<Package[]> => {
    const response = await httpClient.get<ApiResponse<Package[]>>(
      API_ENDPOINTS.PACKAGES.GET_ALL
    );
    return response.data.data;
  },

  getPackageById: async (id: string): Promise<Package> => {
    const response = await httpClient.get<ApiResponse<Package>>(
      API_ENDPOINTS.PACKAGES.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createPackage: async (data: FormData): Promise<ApiResponse<void>> => {
    const response = await httpClient.post<ApiResponse<void>>(
      API_ENDPOINTS.PACKAGES.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updatePackage: async (id: string, data: FormData): Promise<Package> => {
    const response = await httpClient.patch<Package>(
      API_ENDPOINTS.PACKAGES.UPDATE(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updatePackageAvailability: async (
    id: string,
    availability: string
  ): Promise<Package> => {
    const response = await httpClient.patch<Package>(
      API_ENDPOINTS.PACKAGES.UPDATE_AVAILABILITY(id),
      { availability }
    );
    return response.data;
  },

  deletePackage: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGES.DELETE(id));
  },
};
