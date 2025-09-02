export interface Blog {
  id: string;
  title: string;
  slug: string;
  authorID: string;
  categoryID: string;
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
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface BlogPayload {
  title: string;
  slug: string;
  categoryID: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt: string;
  scheduledAt?: string;
  authorID: string;
  thumbnail: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
  displayName: string;
}

export interface AuthorsApiResponse {
  authors: Author[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
