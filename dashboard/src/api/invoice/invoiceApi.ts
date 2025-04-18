import { API_ENDPOINTS } from "@/config/api.config";
import { httpClient } from "../httpClient";
import { ApiResponse, Invoice } from "./invoiceTypes";

export const invoiceApi = {
  // Get All Invoices
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await httpClient.get<ApiResponse<Invoice[]>>(
      API_ENDPOINTS.INVOICE.GET_ALL
    );
    return response.data.data;
  },
  // Get Invoice by ID
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await httpClient.get<ApiResponse<Invoice>>(
      API_ENDPOINTS.INVOICE.GET_BY_ID(id)
    );
    return response.data.data;
  },

  // Delete Invoice
  deleteInvoice: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.INVOICE.DELETE(id));
  },
};
