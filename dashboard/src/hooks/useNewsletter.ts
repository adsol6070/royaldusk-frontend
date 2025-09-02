import { newsletterApi } from "@/api/newsletter/newsletterApi";
import { NewsletterSubscriber, NewsletterUpdatePayload } from "@/api/newsletter/newsletterTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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
      console.error("Newsletter Error:", error);
    },
  });
};

// ✅ Get all subscribers
export const useNewsletterSubscribers = () =>
  useQuery<NewsletterSubscriber[], Error>({
    queryKey: ["newsletter-subscribers"],
    queryFn: newsletterApi.getAll,
  });

// ✅ Get subscriber by ID
export const useNewsletterById = (id: string) =>
  useQuery<NewsletterSubscriber, Error>({
    queryKey: ["newsletter-subscriber", id],
    queryFn: () => newsletterApi.getById(id),
    enabled: !!id,
  });

// ✅ Create (Subscribe)
export const useSubscribeNewsletter = () =>
  useCustomMutation(
    (email: string) => newsletterApi.subscribe(email),
    ["newsletter-subscribers"],
    "Subscribed successfully!"
  );

// ✅ Update subscription status (resubscribe/unsubscribe)
export const useUpdateNewsletterStatus = () =>
  useCustomMutation(
    (payload: NewsletterUpdatePayload) => newsletterApi.updateStatus(payload),
    ["newsletter-subscribers"],
    "Subscription updated!"
  );

// ✅ Delete subscriber
export const useDeleteSubscriber = () =>
  useCustomMutation(
    (id: string) => newsletterApi.deleteById(id),
    ["newsletter-subscribers"],
    "Subscriber deleted!"
  );
