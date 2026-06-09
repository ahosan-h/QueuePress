"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { CreateBlogDto } from "@/types/blog";

interface Props {
  initialValues?: CreateBlogDto;

  onSubmit: (values: CreateBlogDto) => Promise<void>;
}

export function BlogForm({ initialValues, onSubmit }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");

  const [summary, setSummary] = useState(initialValues?.summary ?? "");

  const [content, setContent] = useState(initialValues?.content ?? "");

  const [keywords, setKeywords] = useState(
    initialValues?.keywords?.join(", ") ?? "",
  );

  const [scheduledAt, setScheduledAt] = useState(
    initialValues?.scheduledAt ?? "",
  );

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit({
        title,
        summary,
        content,

        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),

        scheduledAt: scheduledAt || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>

        <Input
          placeholder="NestJS BullMQ Guide"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>

        <Textarea
          rows={3}
          placeholder="Short summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>

        <Textarea
          rows={14}
          placeholder="Write your blog..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Keywords</label>

        <Input
          placeholder="nestjs, bullmq, redis"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Schedule Publish</label>

        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Blog"}
      </Button>
    </form>
  );
}
