import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../../httpClient";
import {
  ApiResponse,
  PackageItinerary,
  PackageItineraryPayload,
} from "./packageItenariesTypes"; 

export const packageItineraryApi = {
  getAllItinerary: async (): Promise<PackageItinerary[]> => {
    const response = await httpClient.get<ApiResponse<PackageItinerary[]>>(
      API_ENDPOINTS.PACKAGE_ITINERARY.GET_ALL
    );
    return response.data.data;
  },

  getItineraryById: async (id: string): Promise<PackageItinerary> => {
    const response = await httpClient.get<ApiResponse<PackageItinerary>>(
      API_ENDPOINTS.PACKAGE_ITINERARY.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createItinerary: async (
    data: PackageItineraryPayload
  ): Promise<PackageItinerary> => {
    const response = await httpClient.post<ApiResponse<PackageItinerary>>(
      API_ENDPOINTS.PACKAGE_ITINERARY.CREATE,
      data
    );
    return response.data.data;
  },

  updateItinerary: async (
    id: string,
    data: PackageItineraryPayload
  ): Promise<PackageItinerary> => {
    const response = await httpClient.patch<ApiResponse<PackageItinerary>>(
      API_ENDPOINTS.PACKAGE_ITINERARY.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteItinerary: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PACKAGE_ITINERARY.DELETE(id));
  },
};
