export type BlogStatus = "draft" | "scheduled" | "published";

export interface Blog {
  _id: string;

  userId: string;

  title: string;

  content: string;

  slug: string;

  summary?: string;

  keywords: string[];

  readingTime?: number;

  status: BlogStatus;

  scheduledAt?: string;

  createdAt: string;

  updatedAt: string;
}
