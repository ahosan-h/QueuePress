"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthAction } from "@/hooks/use-auth-action";

interface Props {
  onDelete: () => void;
}

export function DeleteBlogButton({ onDelete }: Props) {
  const { requireAuth } = useAuthAction();

  return (
    <Button
      size="icon"
      variant="destructive"
      onClick={() =>
        requireAuth(() => {
          toast.info("Deleting blog...");

          onDelete();
        })
      }
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
