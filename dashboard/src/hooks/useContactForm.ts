import { contactApi } from "@/api/contact/contactApi";
import {
  ContactMessage,
  ContactMessagePayload,
} from "@/api/contact/contactTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Generic custom mutation wrapper
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
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error("Contact Error:", error);
    },
  });
};

// ✅ Get all contact messages (Admin)
export const useContactMessages = () =>
  useQuery<ContactMessage[], Error>({
    queryKey: ["contact-messages"],
    queryFn: contactApi.getAll,
  });

// ✅ Get contact message by ID
export const useContactById = (id: string) =>
  useQuery<ContactMessage, Error>({
    queryKey: ["contact-message", id],
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  });

// ✅ Create contact message (Public form)
export const useCreateContact = () =>
  useCustomMutation(
    (payload: ContactMessagePayload) => contactApi.submit(payload),
    ["contact-messages"],
    "Message sent successfully!"
  );

// ✅ Delete contact message
export const useDeleteContact = () =>
  useCustomMutation(
    (id: string) => contactApi.deleteById(id),
    ["contact-messages"],
    "Message deleted successfully!"
  );
