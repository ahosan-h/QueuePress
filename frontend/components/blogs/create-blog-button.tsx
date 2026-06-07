"use client";

import { useAuthAction } from "@/hooks/use-auth-action";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function CreateBlogButton() {
  const router = useRouter();

  const { requireAuth } = useAuthAction();
  return (
    <Button onClick={() => requireAuth(() => router.push("/blogs/new"))}>
      <Plus className="mr-2 h-4 w-4" />
      Create Blog
    </Button>
  );
}
