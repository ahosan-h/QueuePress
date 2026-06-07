import { apiFetch } from "@/lib/api";
import { Blog, CreateBlogDto, UpdateBlogDto } from "@/types/blog";

export const BlogService = {
  getAll: () => apiFetch<Blog[]>("/blogs"),

  getById: (id: string) => apiFetch<Blog>(`/blogs/${id}`),

  create: (data: CreateBlogDto, token: string) =>
    apiFetch<Blog>("/blogs", {
      method: "POST",
      token,
      body: data,
    }),

  update: (data: UpdateBlogDto, token: string, id: string) =>
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
