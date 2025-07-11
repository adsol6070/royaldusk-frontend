import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { ApiResponse, Tour } from "./tourTypes";

export const tourApi = {
  getAllTours: async (): Promise<Tour[]> => {
    const response = await httpClient.get<ApiResponse<Tour[]>>(
      API_ENDPOINTS.TOUR.GET_ALL
    );
    return response.data.data;
  },

  getTourById: async (id: string): Promise<Tour> => {
    const response = await httpClient.get<ApiResponse<Tour>>(
      API_ENDPOINTS.TOUR.GET_BY_ID(id)
    );
    return response.data.data;
  },

  createTour: async (data: FormData): Promise<ApiResponse<void>> => {
    const response = await httpClient.post<ApiResponse<void>>(
      API_ENDPOINTS.TOUR.CREATE,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return response.data;
  },

  updateTour: async (id: string, data: FormData): Promise<Tour> => {
    const response = await httpClient.patch<Tour>(
      API_ENDPOINTS.TOUR.UPDATE(id),
      data
    );
    return response.data;
  },

 updateTourAvailability: async (
    id: string,
    availability: string
  ): Promise<Tour> => {
    const response = await httpClient.patch<Tour>(
      API_ENDPOINTS.TOUR.UPDATE_AVAILABILITY(id),
      { availability }
    );
    return response.data;
  },

  deleteTour: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.TOUR.DELETE(id));
  },
};
