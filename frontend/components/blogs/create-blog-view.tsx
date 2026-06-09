"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { BlogForm } from "./blog-form";

import { BlogService } from "@/services/blog.service";

import { useBlogStore } from "@/stores/blog-store";

import { CreateBlogDto } from "@/types/blog";

export function CreateBlogView() {
  const router = useRouter();

  const { getToken } = useAuth();

  const addBlog = useBlogStore((state) => state.addBlog);

  async function handleCreate(values: CreateBlogDto) {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Login required");
        return;
      }

      const blog = await BlogService.create(values, token);

      addBlog(blog);

      toast.success("Blog created successfully");

      router.push("/blogs");
    } catch (error) {
      console.error(error);

      toast.error("Failed to create blog");
    }
  }

  return <BlogForm onSubmit={handleCreate} />;
}
