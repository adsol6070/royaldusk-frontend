import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackagePolicy,
  PackagePolicyPayload,
} from "./packagePolicyTypes";

export const packagePolicyApi = {
  getAllPolicies: async (): Promise<PackagePolicy[]> => {
    const response = await httpClient.get<ApiResponse<PackagePolicy[]>>(
      API_ENDPOINTS.PACKAGE_POLICY.GET_ALL
    );
    return response.data.data;
  },

  getPolicyById: async (id: string): Promise<PackagePolicy> => {
    const response = await httpClient.get<ApiResponse<PackagePolicy>>(
      API_ENDPOINTS.PACKAGE_POLICY.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createPolicy: async (
    data: PackagePolicyPayload
  ): Promise<PackagePolicy> => {
    const response = await httpClient.post<ApiResponse<PackagePolicy>>(
      API_ENDPOINTS.PACKAGE_POLICY.CREATE,
      data
    );
    return response.data.data;
  },

  updatePolicy: async (
    id: string,
    data: PackagePolicyPayload
  ): Promise<PackagePolicy> => {
    const response = await httpClient.patch<ApiResponse<PackagePolicy>>(
      API_ENDPOINTS.PACKAGE_POLICY.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deletePolicy: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_POLICY.DELETE(id));
  },
};
