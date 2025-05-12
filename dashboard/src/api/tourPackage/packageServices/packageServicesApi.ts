import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackageServices,
  PackageServicesPayload,
} from "./packageServicesTypes"; 

export const packageServicesApi = {
  getAllActivities: async (): Promise<PackageServices[]> => {
    const response = await httpClient.get<ApiResponse<PackageServices[]>>(
      API_ENDPOINTS.PACKAGE_SERVICES.GET_ALL
    );
    return response.data.data;
  },

  getActivityById: async (id: string): Promise<PackageServices> => {
    const response = await httpClient.get<ApiResponse<PackageServices>>(
      API_ENDPOINTS.PACKAGE_SERVICES.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createActivity: async (
    data: PackageServicesPayload
  ): Promise<PackageServices> => {
    const response = await httpClient.post<ApiResponse<PackageServices>>(
      API_ENDPOINTS.PACKAGE_SERVICES.CREATE,
      data
    );
    return response.data.data;
  },

  updateActivity: async (
    id: string,
    data: PackageServicesPayload
  ): Promise<PackageServices> => {
    const response = await httpClient.put<ApiResponse<PackageServices>>(
      API_ENDPOINTS.PACKAGE_SERVICES.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteActivity: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_SERVICES.DELETE(id));
  },
};
