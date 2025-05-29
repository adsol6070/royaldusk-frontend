import { packageCategoryApi } from "@/api/tourPackage/categories/packageCategoryApi";
import { packageFeatureApi } from "@/api/tourPackage/features/packageFeaturesApi";
import { packageApi } from "@/api/tourPackage/packageApi";
import { packageItineraryApi } from "@/api/tourPackage/packageItenary/packageItenariesApi";
import { PackageItinerary } from "@/api/tourPackage/packageItenary/packageItenariesTypes";
import { packagePolicyApi } from "@/api/tourPackage/packagePolicy/packagePolicyApi";
import { packageServicesApi } from "@/api/tourPackage/packageServices/packageServicesApi";
import { Package } from "@/api/tourPackage/packageTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PackagePolicy, PackagePolicyPayload } from "@/api/tourPackage/packagePolicy/packagePolicyTypes";
import { Enquiry, EnquiryPayload } from "@/api/tourPackage/enquires/packageEnquiryTypes";
import { packageEnquiryApi } from "@/api/tourPackage/enquires/packageEnquiryApi";

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
// Package Hooks 
export const usePackages = () =>
  useQuery<Package[], Error>({
    queryKey: ["packages"],
    queryFn: packageApi.getAllPackages,
  });

export const usePackageById = (id: string) =>
  useQuery<Package, Error>({
    queryKey: ["package", id],
    queryFn: () => packageApi.getPackageById(id),
    enabled: !!id,
  });

export const useCreatePackage = () =>
  useCustomMutation(
    (packageData: FormData) => packageApi.createPackage(packageData),
    ["packages"],
    "Package created successfully!"
  );

export const useUpdatePackage = () =>
  useCustomMutation(
    ({ id, packageData }: { id: string; packageData: FormData }) =>
      packageApi.updatePackage(id, packageData),
    ["packages"],
    "Package updated successfully!"
  );

  export const useUpdatePackageAvailability = () =>
    useCustomMutation(
      ({ id, availability }: { id: string; availability: string }) =>
        packageApi.updatePackageAvailability(id, availability),
      ["packages"],
      "Package availability updated successfully!"
    );

export const useDeletePackage = () =>
  useCustomMutation(
    (id: string) => packageApi.deletePackage(id),
    ["packages"],
    "Package deleted successfully!"
  );

// Package Category Hooks 
  export const usePackageCategories = () =>
    useQuery({
      queryKey: ["packageCategories"],
      queryFn: packageCategoryApi.getAllCategories,
    });
  
  export const useCreatePackageCategory = () =>
    useCustomMutation(
      (newCategory: { name: string }) =>
        packageCategoryApi.createCategory(newCategory),
      ["packageCategories"],
      "Category added successfully!"
    );
  
  export const useUpdatePackageCategory = () =>
    useCustomMutation(
      ({ id, name }: { id: string; name: string }) =>
        packageCategoryApi.updateCategory(id, { name }),
      ["packageCategories"],
      "Category updated successfully!"
    );
  
  export const useDeletePackageCategory = () =>
    useCustomMutation(
      (id: string) => packageCategoryApi.deleteCategory(id),
      ["packageCategories"],
      "Category deleted successfully!"
    );
  
  // Package Services Hooks 
  export const usePackageServices = () =>
    useQuery({
      queryKey: ["packageServices"],
      queryFn: packageServicesApi.getAllActivities,
    });
  
  export const useCreatePackageServices = () =>
    useCustomMutation(
      (newActivity: { name: string }) =>
        packageServicesApi.createActivity(newActivity),
      ["packageServices"],
      "Services added successfully!"
    );
  
  export const useUpdatePackageServices = () =>
    useCustomMutation(
      ({ id, name }: { id: string; name: string }) =>
        packageServicesApi.updateActivity(id, { name }),
      ["packageServices"],
      "Services updated successfully!"
    );
  
  export const useDeletePackageServices = () =>
    useCustomMutation(
      (id: string) => packageServicesApi.deleteActivity(id),
      ["packageServices"],
      "Services deleted successfully!"
    );
  
// Package Features Hooks 
export const usePackageFeatures = () =>
  useQuery({
    queryKey: ["packageFeatures"],
    queryFn: packageFeatureApi.getAllFeatures,
  });

export const useCreatePackageFeatures = () =>
  useCustomMutation(
    (newFeature: { name: string }) =>
      packageFeatureApi.createFeature(newFeature),
    ["packageFeatures"],
    "Feature added successfully!"
  );

export const useUpdatePackageFeatures = () =>
  useCustomMutation(
    ({ id, name }: { id: string; name: string }) =>
      packageFeatureApi.updateFeature(id, { name }),
    ["packageFeatures"],
    "Feature updated successfully!"
  );

export const useDeletePackageFeatures = () =>
  useCustomMutation(
    (id: string) => packageFeatureApi.deleteFeature(id),
    ["packageFeatures"],
    "Feature deleted successfully!"
  );
  
  // Package Itineraries Hooks 
  export const usePackageItineraries = () =>
    useQuery<PackageItinerary[], Error>({
      queryKey: ["packageItineraries"],
      queryFn: packageItineraryApi.getAllItinerary,
    });
  
  export const usePackageItineraryById = (id: string) =>
    useQuery<PackageItinerary, Error>({
      queryKey: ["packageItinerary", id],
      queryFn: () => packageItineraryApi.getItineraryById(id),
      enabled: !!id,
    });
  
  export const useCreatePackageItinerary = () =>
    useCustomMutation(
      (itineraryData: { title: string; description: string; }) =>
        packageItineraryApi.createItinerary(itineraryData),
      ["packageItineraries"],
      "Package itinerary created successfully!"
    );
  
  export const useUpdatePackageItinerary = () =>
    useCustomMutation(
      ({
        id,
        itineraryData,
      }: { id: string; itineraryData: { title: string; description: string } }) =>
        packageItineraryApi.updateItinerary(id, itineraryData),
      ["packageItineraries"],
      "Package itinerary updated successfully!"
    );
  
  export const useDeletePackageItinerary = () =>
    useCustomMutation(
      (id: string) => packageItineraryApi.deleteItinerary(id),
      ["packageItineraries"],
      "Package itinerary deleted successfully!"
    );

  // Package Policy Hooks

export const usePackagePolicies = () =>
  useQuery<PackagePolicy[], Error>({
    queryKey: ["packagePolicies"],
    queryFn: packagePolicyApi.getAllPolicies,
  });

export const usePackagePolicyById = (id: string) =>
  useQuery<PackagePolicy, Error>({
    queryKey: ["packagePolicy", id],
    queryFn: () => packagePolicyApi.getPolicyById(id),
    enabled: !!id,
  });

export const useCreatePackagePolicy = () =>
  useCustomMutation(
    (policyData: PackagePolicyPayload) =>
      packagePolicyApi.createPolicy(policyData),
    ["packagePolicies"],
    "Package policy created successfully!"
  );

export const useUpdatePackagePolicy = () =>
  useCustomMutation(
    ({
      id,
      policyData,
    }: { id: string; policyData: PackagePolicyPayload }) =>
      packagePolicyApi.updatePolicy(id, policyData),
    ["packagePolicies"],
    "Package policy updated successfully!"
  );

export const useDeletePackagePolicy = () =>
  useCustomMutation(
    (id: string) => packagePolicyApi.deletePolicy(id),
    ["packagePolicies"],
    "Package policy deleted successfully!"
  );

  // 📌 GET All Enquiries
export const usePackageEnquiries = () =>
  useQuery<Enquiry[], Error>({
    queryKey: ["packageEnquiries"],
    queryFn: packageEnquiryApi.getAllEnquiries,
  });

// 📌 GET Single Enquiry
export const usePackageEnquiryById = (id: string) =>
  useQuery<Enquiry, Error>({
    queryKey: ["packageEnquiry", id],
    queryFn: () => packageEnquiryApi.getEnquiryById(id),
    enabled: !!id,
  });

// 📌 CREATE Enquiry
export const useCreatePackageEnquiry = () =>
  useCustomMutation(
    (data: EnquiryPayload) => packageEnquiryApi.createEnquiry(data),
    ["packageEnquiries"],
    "Enquiry submitted successfully!"
  );

// 📌 DELETE Enquiry
export const useDeletePackageEnquiry = () =>
  useCustomMutation(
    (id: string) => packageEnquiryApi.deleteEnquiry(id),
    ["packageEnquiries"],
    "Enquiry deleted successfully!"
  );