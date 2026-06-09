"use client";

import { useEffect } from "react";

import { useAuth } from "@clerk/nextjs";

import { toast } from "sonner";

import { BlogService } from "@/services/blog.service";

import { useBlogStore } from "@/stores/blog-store";

import { Blog } from "@/types/blog";

import { BlogsTable } from "@/components/blogs/blogs-table";

import { CreateBlogButton } from "@/components/blogs/create-blog-button";
import { createBlogSocket } from "@/lib/socket";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function BlogsPage() {
  const { getToken } = useAuth();

  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const setLoading = useBlogStore((state) => state.setLoading);
  const updateBlog = useBlogStore((state) => state.updateBlog);

  const totalBlogs = blogs.length;
  const publishedCount = blogs.filter(
    (blog) => blog.status === "published",
  ).length;
  const scheduledCount = blogs.filter(
    (blog) => blog.status === "scheduled",
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "draft").length;

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);

        const token = await getToken();

        if (!token) {
          return;
        }

        const data = await BlogService.getAll(token);

        setBlogs(data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, [getToken, setBlogs, setLoading]);

  useEffect(() => {
    const socket = createBlogSocket();

    const handleBlogPublished = (blog: Blog) => {
      updateBlog(blog);
      toast.success(`Blog published: ${blog.title}`);
    };

    const handleBlogUpdated = (blog: Blog) => {
      updateBlog(blog);
    };

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("blogPublished", handleBlogPublished);
    socket.on("blogUpdated", handleBlogUpdated);

    socket.connect();

    return () => {
      socket.off("blogPublished", handleBlogPublished);
      socket.off("blogUpdated", handleBlogUpdated);
      socket.disconnect();
    };
  }, [updateBlog]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog management</h1>
          <p className="text-muted-foreground">
            All content in one place with publishing status, schedule, and
            actions.
          </p>
        </div>
        <CreateBlogButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total posts</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {totalBlogs}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Published</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {publishedCount}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheduled</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {scheduledCount}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Drafts</CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {draftCount}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Blog library</CardTitle>
            <CardDescription>
              Browse all posts, update status, or edit the next release.
            </CardDescription>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {totalBlogs} {totalBlogs === 1 ? "post" : "posts"}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <BlogsTable blogs={blogs} />
        </CardContent>
      </Card>
    </div>
  );
}
