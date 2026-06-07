import { apiFetch } from "@/lib/api";
import { Blog } from "@/types/blog";

export const BlogService = {
  getAll: () => apiFetch<Blog[]>("/blogs"),

  getById: (id: string) => apiFetch<Blog>(`/blogs/${id}`),

  create: (data: Partial<Blog>, token: string) =>
    apiFetch<Blog>("/blogs", {
      method: "POST",
      token,
      body: data,
    }),
};
