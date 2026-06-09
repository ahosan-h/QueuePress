"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SearchContent() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const setLoading = useBlogStore((state) => state.setLoading);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);

        const token = await getToken();
        if (!token) return;

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

  const filteredBlogs = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();

    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowerQuery) ||
        blog.summary?.toLowerCase().includes(lowerQuery) ||
        blog.content.toLowerCase().includes(lowerQuery) ||
        blog.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery),
        ),
    );
  }, [blogs, query]);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Search Results</h1>

        <p className="text-muted-foreground">
          {query ? (
            <>
              Found{" "}
              <span className="font-semibold text-foreground">
                {filteredBlogs.length}
              </span>{" "}
              blog
              {filteredBlogs.length !== 1 ? "s" : ""} for{" "}
              <span className="font-semibold text-foreground">
                {`"${query}"`}
              </span>
            </>
          ) : (
            "Enter a search query to find blogs"
          )}
        </p>
      </div>

      {query.trim() && filteredBlogs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="mb-2 text-xl font-semibold">No blogs found</h2>

            <p className="mb-6 text-center text-muted-foreground">
              {"We couldn't find any blogs matching "}
              <span className="font-medium">{`"${query}"`}</span>
              {". Try a different search term or "}
              <Link href="/blogs/new" className="text-primary hover:underline">
                create a new blog
              </Link>
              .
            </p>

            <Button asChild variant="outline">
              <Link href="/blogs">View all blogs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : query.trim() ? (
        <div className="space-y-3">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}/edit`}
              className="block"
            >
              <Card className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                        {blog.title}
                      </h3>

                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {blog.summary || blog.content.slice(0, 120)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {blog.keywords?.slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-muted px-2 py-1 text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 md:ml-4">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {blog.status}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="mb-2 text-xl font-semibold">Start searching</h2>

            <p className="text-center text-muted-foreground">
              Use the search bar to find blogs by title, content, or keywords.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
