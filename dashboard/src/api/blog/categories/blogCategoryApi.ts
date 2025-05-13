import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  BlogCategory,
  BlogCategoryPayload,
} from "./blogCategoryTypes";

export const blogCategoryApi = {
  getAllCategories: async (): Promise<BlogCategory[]> => {
    const response = await httpClient.get<ApiResponse<BlogCategory[]>>(
      API_ENDPOINTS.BLOG_CATEGORY.GET_ALL
    );
    return response.data.data;
  },

  getCategoryById: async (id: string): Promise<BlogCategory> => {
    const response = await httpClient.get<ApiResponse<BlogCategory>>(
      API_ENDPOINTS.BLOG_CATEGORY.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createCategory: async (data: BlogCategoryPayload): Promise<BlogCategory> => {
    const response = await httpClient.post<ApiResponse<BlogCategory>>(
      API_ENDPOINTS.BLOG_CATEGORY.CREATE,
      data
    );
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    data: BlogCategoryPayload
  ): Promise<BlogCategory> => {
    console.log("Data:", data);
    const response = await httpClient.patch<ApiResponse<BlogCategory>>(
      API_ENDPOINTS.BLOG_CATEGORY.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.BLOG_CATEGORY.DELETE(id));
  },
};
