import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getBlogById(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: true,
      reaction: true,
      author: true,
      category: true,
    },
  });
  if (!post) return redirect("/blogs");
  return post;
}
