"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { BarChart3, Sparkles, Clock, FileText } from "lucide-react";

import { BlogService } from "@/services/blog.service";
import { useBlogStore } from "@/stores/blog-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  const { getToken } = useAuth();
  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const setLoading = useBlogStore((state) => state.setLoading);

  useEffect(() => {
    async function loadAnalytics() {
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
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [getToken, setBlogs, setLoading]);

  const totalBlogs = blogs.length;
  const scheduledCount = blogs.filter(
    (blog) => blog.status === "scheduled",
  ).length;
  const publishedCount = blogs.filter(
    (blog) => blog.status === "published",
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "draft").length;

  const topKeywords = useMemo(() => {
    const allKeywords = blogs.flatMap((blog) => blog.keywords || []);
    const counts = allKeywords.reduce<Record<string, number>>(
      (acc, keyword) => {
        acc[keyword] = (acc[keyword] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [blogs]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Review content performance and publishing trends for your blogs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <CardTitle>Total blogs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalBlogs}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <CardTitle>Published</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{publishedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <CardTitle>Scheduled</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{scheduledCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <CardTitle>Drafts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{draftCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top keywords</CardTitle>
            <CardDescription>
              Most used keywords across your published and draft posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No keywords found yet.
              </p>
            ) : (
              <div className="space-y-2">
                {topKeywords.map(([keyword, count]) => (
                  <div
                    key={keyword}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <span className="font-medium">{keyword}</span>
                    <span className="text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing distribution</CardTitle>
            <CardDescription>
              Breakdown of post statuses across your current blog library.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Published",
                value: publishedCount,
                color: "bg-emerald-500",
              },
              {
                label: "Scheduled",
                value: scheduledCount,
                color: "bg-amber-500",
              },
              { label: "Draft", value: draftCount, color: "bg-slate-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-muted">
                  <div
                    className={`${item.color} h-2.5 rounded-full`}
                    style={{
                      width: `${totalBlogs === 0 ? 0 : (item.value / totalBlogs) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
