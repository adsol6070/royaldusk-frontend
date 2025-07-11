import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import {
  NewsletterSubscriber,
  NewsletterUpdatePayload,
  ApiResponse,
} from "./newsletterTypes";

export const newsletterApi = {
  // ✅ GET all subscribers
  getAll: async (): Promise<NewsletterSubscriber[]> => {
    const response = await httpClient.get<ApiResponse<NewsletterSubscriber[]>>(
      API_ENDPOINTS.NEWSLETTER.GET_ALL
    );
    return response.data.data;
  },

  // ✅ GET subscriber by ID
  getById: async (id: string): Promise<NewsletterSubscriber> => {
    const response = await httpClient.get<ApiResponse<NewsletterSubscriber>>(
      API_ENDPOINTS.NEWSLETTER.GET_BY_ID(id)
    );
    return response.data.data;
  },

  // ✅ POST subscribe
  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    const response = await httpClient.post<ApiResponse<NewsletterSubscriber>>(
      API_ENDPOINTS.NEWSLETTER.SUBSCRIBE,
      { email }
    );
    return response.data.data;
  },

  // ✅ POST update subscription status
  updateStatus: async (payload: NewsletterUpdatePayload): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.NEWSLETTER.UPDATE, payload);
  },

  // ✅ DELETE subscriber
  deleteById: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.NEWSLETTER.DELETE(id));
  },
};
