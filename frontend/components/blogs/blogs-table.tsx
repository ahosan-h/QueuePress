"use client";

import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BlogStatusBadge } from "./blog-status-badge";
import { EditBlogButton } from "./edit-blog-button";
import { DeleteBlogButton } from "./delete-blog-button";

export function BlogsTable() {
  const { getToken } = useAuth();

  const blogs = useBlogStore((state) => state.blogs);

  const removeBlog = useBlogStore((state) => state.removeBlog);

  const loading = useBlogStore((state) => state.loading);

  const handleDelete = async (blogId: string) => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Login required");
        return;
      }

      await BlogService.remove(blogId, token);

      removeBlog(blogId);

      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border">
        <p className="text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border">
        <div className="text-center">
          <h3 className="font-medium">No blogs yet</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first blog to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Reading Time</TableHead>

            <TableHead>Keywords</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog._id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{blog.title}</p>

                  {blog.summary && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {blog.summary}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <BlogStatusBadge status={blog.status} />
              </TableCell>

              <TableCell>{blog.readingTime ?? 0} min</TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {blog.keywords?.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md border px-2 py-1 text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                {new Date(blog.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <EditBlogButton blogId={blog._id} />

                  <DeleteBlogButton onDelete={() => handleDelete(blog._id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
