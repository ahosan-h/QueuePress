import { useAuthAction } from "@/hooks/use-auth-action";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  blogId: string;
}

export function EditBlogButton({ blogId }: Props) {
  const router = useRouter();

  const { requireAuth } = useAuthAction();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => requireAuth(() => router.push(`/blogs/${blogId}/edit`))}
    >
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );
}
