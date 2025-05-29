import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackageCategory,
  PackageCategoryPayload,
} from "./packageCategoryTypes";

export const packageCategoryApi = {
  getAllCategories: async (): Promise<PackageCategory[]> => {
    const response = await httpClient.get<ApiResponse<PackageCategory[]>>(
      API_ENDPOINTS.PACKAGE_CATEGORY.GET_ALL
    );
    return response.data.data;
  },

  getCategoryById: async (id: string): Promise<PackageCategory> => {
    const response = await httpClient.get<ApiResponse<PackageCategory>>(
      API_ENDPOINTS.PACKAGE_CATEGORY.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createCategory: async (
    data: PackageCategoryPayload
  ): Promise<PackageCategory> => {
    const response = await httpClient.post<ApiResponse<PackageCategory>>(
      API_ENDPOINTS.PACKAGE_CATEGORY.CREATE,
      data
    );
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    data: PackageCategoryPayload
  ): Promise<PackageCategory> => {
    const response = await httpClient.patch<ApiResponse<PackageCategory>>(
      API_ENDPOINTS.PACKAGE_CATEGORY.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_CATEGORY.DELETE(id));
  },
};
