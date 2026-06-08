import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">Blogs</p>

          <p className="text-muted-foreground">
            Manage and schedule your blog posts
          </p>
        </div>

        <Button asChild>
          <Link href="/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>
    </div>
  );
}
