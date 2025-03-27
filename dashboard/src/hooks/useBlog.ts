import { blogApi } from "@/api/blog/blogApi";
import { Blog, BlogPayload } from "@/api/blog/blogTypes";
import { blogCategoryApi } from "@/api/blog/categories/blogCategoryApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
      toast.error(error.message || "Something went wrong!");
      console.log("Error:", error);
    },
  });
};

export const useBlogs = () =>
  useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: blogApi.getAllBlogs,
  });

export const useBlogById = (id: string) =>
  useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
  });

export const useCreateBlog = () =>
  useCustomMutation(
    (blogData: FormData) => blogApi.createBlog(blogData),
    ["blogs"],
    "Blog created successfully!"
  );

export const useUpdateBlog = () =>
  useCustomMutation(
    ({ id, blogData: updatedBlog }: { id: string; blogData: FormData }) =>
      blogApi.updateBlog(id, updatedBlog),
    ["blogs"],
    "Blog updated successfully!"
  );

export const useDeleteBlog = () =>
  useCustomMutation(
    (id: string) => blogApi.deleteBlog(id),
    ["blogs"],
    "Blog deleted successfully!"
  );

export const useUpdateBlogStatus = () =>
  useCustomMutation(
    ({ id, status }: { id: string; status: string }) =>
      blogApi.updateBlogStatus(id, status),
    ["blogs"],
    "Blog status updated successfully!"
  );

export const useBlogCategories = () =>
  useQuery({
    queryKey: ["blogCategories"],
    queryFn: blogCategoryApi.getAllCategories,
  });

export const useCreateBlogCategory = () =>
  useCustomMutation(
    (newCategory: { name: string }) =>
      blogCategoryApi.createCategory(newCategory),
    ["blogCategories"],
    "Category added successfully!"
  );

export const useUpdateBlogCategory = () =>
  useCustomMutation(
    ({ id, name }: { id: string; name: string }) =>
      blogCategoryApi.updateCategory(id, { name }),
    ["blogCategories"],
    "Category updated successfully!"
  );

export const useDeleteBlogCategory = () =>
  useCustomMutation(
    (id: string) => blogCategoryApi.deleteCategory(id),
    ["blogCategories"],
    "Category deleted successfully!"
  );
