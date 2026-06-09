"use client";

import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";
import { Blog } from "@/types/blog";

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
import { CalendarDays, Clock } from "lucide-react";

interface BlogsTableProps {
  blogs?: Blog[];
}

export function BlogsTable({ blogs }: BlogsTableProps) {
  const { getToken } = useAuth();

  const blogsToRender = blogs ?? useBlogStore((state) => state.blogs);

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

  if (blogsToRender.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border">
        <div className="text-center">
          <h3 className="font-medium">No blogs found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or create a new blog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:hidden">
        {blogsToRender.map((blog) => (
          <div
            key={blog._id}
            className="flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            {/* --- Card Body --- */}
            <div className="p-5">
              {/* Header: Title & Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
                    {blog.title}
                  </h3>
                </div>
                <div className="shrink-0 mt-0.5">
                  <BlogStatusBadge status={blog.status} />
                </div>
              </div>

              {/* Summary */}
              <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2">
                {blog.summary || blog.content.slice(0, 120)}
              </p>

              {/* Metadata (Reading Time & Date) */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{blog.readingTime ?? 0} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              {blog.keywords?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {blog.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                  {/* Show remaining count if more than 3 keywords */}
                  {blog.keywords.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-secondary/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      +{blog.keywords.length - 3}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {/* --- Card Footer Actions --- */}
            <div className="flex items-center justify-end gap-3 border-t bg-muted/20 px-5 py-3">
              <EditBlogButton blogId={blog._id} />
              <DeleteBlogButton onDelete={() => handleDelete(blog._id)} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="py-4 text-left text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Title
              </TableHead>

              <TableHead className="py-4 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="py-4 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Reading Time
              </TableHead>

              <TableHead className="py-4 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Keywords
              </TableHead>

              <TableHead className="py-4 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Created
              </TableHead>

              <TableHead className="text-right py-4 text-sm uppercase tracking-[0.12em] text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {blogsToRender.map((blog) => (
              <TableRow key={blog._id} className="transition hover:bg-muted/50">
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{blog.title}</p>

                    {blog.summary ? (
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {blog.summary}
                      </p>
                    ) : (
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        No summary available
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <BlogStatusBadge status={blog.status} />
                </TableCell>

                <TableCell className="py-4 text-sm text-muted-foreground">
                  {blog.readingTime ?? 0} min
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords?.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border px-2 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="py-4 text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="py-4">
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
    </div>
  );
}
