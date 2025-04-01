import BlogClient from "@/components/BlogClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPosts } from "@/libs/actions";
import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default async function BlogsPage() {
  const postPromise = getPosts();
  return (
    <Box>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          mt: "80px",
        }}>
        <Suspense fallback={<CircularProgress sx={{ alignSelf: "center" }} />}>
          <BlogContent postsPromise={postPromise} />
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}

async function BlogContent({ postsPromise }: { postsPromise: Promise<any> }) {
  const posts = await postsPromise;
  return <BlogClient posts={posts} />;
}
