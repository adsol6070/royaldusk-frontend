import { tourApi } from "@/api/tour/tourApi";
import { Tour } from "@/api/tour/tourTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Reusable custom mutation hook
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

// Get all tours
export const useTours = () =>
  useQuery<Tour[], Error>({
    queryKey: ["tours"],
    queryFn: tourApi.getAllTours,
  });

// Get tour by ID
export const useTourById = (id: string) =>
  useQuery<Tour, Error>({
    queryKey: ["tour", id],
    queryFn: () => tourApi.getTourById(id),
    enabled: !!id,
  });

// Create tour
export const useCreateTour = () =>
  useCustomMutation(
    (tourData: FormData) => tourApi.createTour(tourData),
    ["tours"],
    "Tour created successfully!"
  );

// Update tour
export const useUpdateTour = () =>
  useCustomMutation(
    ({ id, tourData }: { id: string; tourData: FormData }) =>
      tourApi.updateTour(id, tourData),
    ["tours"],
    "Tour updated successfully!"
  );

// Delete tour
export const useDeleteTour = () =>
  useCustomMutation(
    (id: string) => tourApi.deleteTour(id),
    ["tours"],
    "Tour deleted successfully!"
  );

