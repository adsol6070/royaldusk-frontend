import { invoiceApi } from "@/api/invoice/invoiceApi";
import { Invoice } from "@/api/invoice/invoiceTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// 🔁 Reusable mutation hook
const useCustomMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  queryKey: string[],
  successMessage: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong!");
      console.error("Mutation Error:", error);
    },
  });
};

export const useAllInvoices = () =>
  useQuery<Invoice[], Error>({
    queryKey: ["invoices"],
    queryFn: invoiceApi.getAllInvoices,
  });

export const useInvoiceById = (id: string) =>
  useQuery<Invoice, Error>({
    queryKey: ["invoice", id],
    queryFn: () => invoiceApi.getInvoiceById(id),
    enabled: !!id,
  });

export const useDeleteInvoice = () =>
  useCustomMutation(
    (id: string) => invoiceApi.deleteInvoice(id),
    ["invoices"],
    "Invoice deleted successfully!"
  );
