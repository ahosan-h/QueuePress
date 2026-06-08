import { apiFetch } from "@/lib/api";
import { Blog, CreateBlogDto, UpdateBlogDto } from "@/types/blog";

export const BlogService = {
  getAll: (token: string) => apiFetch<Blog[]>("/blogs", { token }),

  getById: (id: string, token: string) =>
    apiFetch<Blog>(`/blogs/${id}`, { token }),

  create: (data: CreateBlogDto, token: string) =>
    apiFetch<Blog>("/blogs", {
      method: "POST",
      token,
      body: data,
    }),

  update: (id: string, data: UpdateBlogDto, token: string) =>
    apiFetch<Blog>(`/blogs/${id}`, {
      method: "PATCH",
      token,
      body: data,
    }),

  remove: (id: string, token: string) =>
    apiFetch(`/blogs/${id}`, {
      method: "DELETE",
      token,
    }),
};
