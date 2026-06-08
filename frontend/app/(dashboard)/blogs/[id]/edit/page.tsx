import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditBlogView } from "@/components/blogs/edit-blog-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit Blog</h1>

      <EditBlogView blogId={params.id} />
    </div>
  );
}
