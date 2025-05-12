import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  Enquiry,
  EnquiryPayload,
} from "./packageEnquiryTypes";

export const packageEnquiryApi = {
  getAllEnquiries: async (): Promise<Enquiry[]> => {
    const response = await httpClient.get<ApiResponse<Enquiry[]>>(
      API_ENDPOINTS.PACKAGE_ENQUIRY.GET_ALL
    );
    return response.data.data;
  },

  getEnquiryById: async (id: string): Promise<Enquiry> => {
    const response = await httpClient.get<ApiResponse<Enquiry>>(
      API_ENDPOINTS.PACKAGE_ENQUIRY.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createEnquiry: async (data: EnquiryPayload): Promise<Enquiry> => {
    const response = await httpClient.post<ApiResponse<Enquiry>>(
      API_ENDPOINTS.PACKAGE_ENQUIRY.CREATE,
      data
    );
    return response.data.data;
  },

  deleteEnquiry: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_ENQUIRY.DELETE(id));
  },
};
