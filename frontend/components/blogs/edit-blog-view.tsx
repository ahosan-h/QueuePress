"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BlogForm } from "./blog-form";
import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";
import { Blog, CreateBlogDto } from "@/types/blog";

interface Props {
  blogId: string;
}

export function EditBlogView({ blogId }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const updateBlog = useBlogStore((state) => state.updateBlog);

  const [initialValues, setInitialValues] = useState<CreateBlogDto | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        const token = await getToken();

        if (!token) {
          toast.error("Login required");
          return;
        }

        const blog = await BlogService.getById(blogId, token);

        setInitialValues({
          title: blog.title,
          summary: blog.summary ?? "",
          content: blog.content,
          keywords: blog.keywords ?? [],
          scheduledAt: blog.scheduledAt ?? undefined,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [blogId, getToken]);

  async function handleUpdate(values: CreateBlogDto) {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Login required");
        return;
      }

      const blog = await BlogService.update(blogId, values, token);

      updateBlog(blog);
      toast.success("Blog updated successfully");
      router.push("/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border">
        <p className="text-muted-foreground">Loading blog...</p>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="rounded-xl border p-6">
        <p className="text-muted-foreground">Blog not found.</p>
      </div>
    );
  }

  return <BlogForm initialValues={initialValues} onSubmit={handleUpdate} />;
}
