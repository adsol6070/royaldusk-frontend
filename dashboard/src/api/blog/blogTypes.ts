export interface Blog {
  id: string;
  title: string;
  slug: string;
  author: string;
  categoryId: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnail?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface BlogPayload {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  author: string;
  category: string;
  tags: string[];
  thumbnail: string;
  status: "draft" | "published" | "archived";
  published_at: string;
  scheduled_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
