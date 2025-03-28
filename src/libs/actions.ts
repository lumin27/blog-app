"use server";

import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "./cloudinary";
import { ReactionType } from "@prisma/client";

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      category: true,
      comments: {
        include: {
          author: true,
        },
      },
      reaction: true,
    },
  });
}

// User Sate
export async function getUser() {
  const session = await getServerSession();
  if (session && session.user) {
    return session.user;
  }
  return;
}

export async function createUser(nextUser: User) {
  const { name, email } = nextUser;

  await prisma.user.create({
    data: {
      name: name as string,
      email: email as string,
    },
  });
  revalidatePath("/blogs");
}

export async function getAuthorId() {
  const session = await getServerSession();
  const author = await prisma.user.findFirst({
    where: {
      email: session?.user?.email as string,
    },
  });
  return author?.id;
}

// Posts State

export async function createPost(formData: FormData) {
  const authorId = await getAuthorId();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId");
  const file = formData.get("image") as File | null;

  let imageUrl =
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg";

  if (file) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
      folder: "blog_images",
    });
    imageUrl = uploadResponse.secure_url;
  }

  await prisma.post.create({
    data: {
      title,
      content,
      authorId: authorId as number,
      categoryId: Number(categoryId),
      imagePath: imageUrl,
    },
  });
  redirect("/blogs");
}

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.comments.deleteMany({
    where: {
      postId: Number(id),
    },
  });
  await prisma.reaction.deleteMany({
    where: {
      postId: Number(id),
    },
  });
  await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  redirect("/blogs");
}

// Reactions state

export async function toggleReaction(
  postId: number,
  reactionType: ReactionType
) {
  try {
    const userId = await getAuthorId();
    if (!userId) {
      return { success: false };
    }
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId: userId as number,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === reactionType && reactionType !== null) {
        await prisma.reaction.delete({
          where: {
            id: existingReaction.id,
          },
        });
      } else {
        await prisma.reaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            type: reactionType,
          },
        });
      }
    } else {
      await prisma.reaction.create({
        data: {
          postId,
          userId: userId as number,
          type: reactionType,
        },
      });
    }
    revalidatePath(`/blogs/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}

export async function getReactions(postId: number) {
  try {
    const likesCount = await prisma.reaction.count({
      where: {
        postId,
        type: ReactionType.LIKE,
      },
    });

    const lovesCount = await prisma.reaction.count({
      where: {
        postId,
        type: ReactionType.LOVE,
      },
    });
    return {
      success: true,
      reactions: { likes: likesCount, loves: lovesCount },
    };
  } catch (error) {
    console.error("Error fetching reactions:", error);
  }
}

export async function getUserReactions(postId: number) {
  try {
    const userId = await getAuthorId();
    const userReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId,
      },
    });
    return {
      success: true,
      userReaction: userReaction ? userReaction.type : null,
    };
  } catch (error) {
    console.error("Error fetching user reactions:", error);
  }
}

// Comments State

export async function createComment(formData: FormData) {
  const postId = formData.get("postId") as string;
  const text = formData.get("text") as string;
  const userId = await getAuthorId();

  if (text === "") {
    redirect(`/blogs/${Number(postId)}`);
  }

  await prisma.comments.create({
    data: {
      text,
      post: {
        connect: {
          id: Number(postId),
        },
      },
      author: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
  redirect(`/blogs/${Number(postId)}`);
}

export async function updateComment(formData: FormData) {
  const postId = formData.get("postId") as string;
  const id = formData.get("id") as string;
  const text = formData.get("text") as string;
  await prisma.comments.update({
    where: {
      id: Number(id),
    },
    data: {
      text,
    },
  });
  redirect(`/blogs/${Number(postId)}`);
}

export async function deleteComment(formData: FormData) {
  const id = Number(formData.get("id"));
  const postId = Number(formData.get("postId"));
  await prisma.comments.delete({
    where: { id },
  });
  redirect(`/blogs/${postId}`);
}
export async function getComments(postId: number) {
  try {
    const comments = await prisma.comments.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
