import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackageLocation,
} from "./packageLocationTypes";

export const packageLocationApi = {
  getAllLocations: async (): Promise<PackageLocation[]> => {
    const response = await httpClient.get<ApiResponse<PackageLocation[]>>(
      API_ENDPOINTS.PACKAGE_LOCATION.GET_ALL
    );
    return response.data.data;
  },

  getLocationById: async (id: string): Promise<PackageLocation> => {
    const response = await httpClient.get<ApiResponse<PackageLocation>>(
      API_ENDPOINTS.PACKAGE_LOCATION.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createLocation: async (
    data: FormData
  ): Promise<PackageLocation> => {
    const response = await httpClient.post<ApiResponse<PackageLocation>>(
      API_ENDPOINTS.PACKAGE_LOCATION.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  updateLocation: async (
    id: string,
    data: FormData
  ): Promise<PackageLocation> => {
    const response = await httpClient.patch<ApiResponse<PackageLocation>>(
      API_ENDPOINTS.PACKAGE_LOCATION.UPDATE(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  deleteLocation: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_LOCATION.DELETE(id));
  },
};
