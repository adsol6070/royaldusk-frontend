import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { ApiResponse, Author, AuthorsApiResponse, Blog } from "./blogTypes";

export const blogApi = {
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await httpClient.get<ApiResponse<Blog[]>>(
      API_ENDPOINTS.BLOG.GET_ALL
    );
    return response.data.data;
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const response = await httpClient.get<ApiResponse<Blog>>(
      API_ENDPOINTS.BLOG.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createBlog: async (data: FormData): Promise<ApiResponse<void>> => {
    const response = await httpClient.post<ApiResponse<void>>(
      API_ENDPOINTS.BLOG.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateBlog: async (id: string, data: FormData): Promise<Blog> => {
    const response = await httpClient.patch<Blog>(
      API_ENDPOINTS.BLOG.UPDATE(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.BLOG.DELETE(id));
  },

  updateBlogStatus: async (id: string, status: string): Promise<Blog> => {
    const response = await httpClient.patch<Blog>(
      API_ENDPOINTS.BLOG.UPDATE_STATUS(id),
      { status }
    );
    return response.data;
  },

  getBlogAuthors: async (): Promise<Author[]> => {
    const response = await httpClient.get<ApiResponse<AuthorsApiResponse>>(
      API_ENDPOINTS.BLOG.GET_AUTHORS
    );
    return response.data.data.authors;
  },
};
