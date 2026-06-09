import { Badge } from "@/components/ui/badge";

interface Props {
  status: "draft" | "scheduled" | "published";
}

export function BlogStatusBadge({ status }: Props) {
  switch (status) {
    case "draft":
      return <Badge variant="secondary">Draft</Badge>;

    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>;

    case "published":
      return <Badge>Published</Badge>;

    default:
      return null;
  }
}
