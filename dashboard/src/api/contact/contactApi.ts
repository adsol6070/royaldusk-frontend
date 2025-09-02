import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import {
  ContactMessage,
  ContactMessagePayload,
  ApiResponse,
} from "./contactTypes";

export const contactApi = {
  // ✅ POST: Submit a new contact message
  submit: async (payload: ContactMessagePayload): Promise<ContactMessage> => {
    const response = await httpClient.post<ApiResponse<ContactMessage>>(
      API_ENDPOINTS.CONTACT.SUBMIT,
      payload
    );
    return response.data.data;
  },

  // ✅ GET: All contact messages (admin only)
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await httpClient.get<ApiResponse<ContactMessage[]>>(
      API_ENDPOINTS.CONTACT.GET_ALL
    );
    return response.data.data;
  },

  // ✅ GET: Specific contact message by ID
  getById: async (id: string): Promise<ContactMessage> => {
    const response = await httpClient.get<ApiResponse<ContactMessage>>(
      API_ENDPOINTS.CONTACT.GET_BY_ID(id)
    );
    return response.data.data;
  },

  // ✅ DELETE: Delete contact message by ID
  deleteById: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.CONTACT.DELETE(id));
  },
};
