import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackageFeature,
  PackageFeaturePayload,
} from "./packageFeaturesTypes";

export const packageFeatureApi = {
  getAllFeatures: async (): Promise<PackageFeature[]> => {
    const response = await httpClient.get<ApiResponse<PackageFeature[]>>(
      API_ENDPOINTS.PACKAGE_FEATURE.GET_ALL
    );
    return response.data.data;
  },

  getFeatureById: async (id: string): Promise<PackageFeature> => {
    const response = await httpClient.get<ApiResponse<PackageFeature>>(
      API_ENDPOINTS.PACKAGE_FEATURE.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createFeature: async (
    data: PackageFeaturePayload
  ): Promise<PackageFeature> => {
    const response = await httpClient.post<ApiResponse<PackageFeature>>(
      API_ENDPOINTS.PACKAGE_FEATURE.CREATE,
      data
    );
    return response.data.data;
  },

  updateFeature: async (
    id: string,
    data: PackageFeaturePayload
  ): Promise<PackageFeature> => {
    const response = await httpClient.patch<ApiResponse<PackageFeature>>(
      API_ENDPOINTS.PACKAGE_FEATURE.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteFeature: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_FEATURE.DELETE(id));
  },
};
