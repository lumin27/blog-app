import BlogClient from "@/components/BlogClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPosts } from "@/libs/actions";
import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default async function BlogsPage() {
  const posts = await getPosts();
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
          <BlogClient posts={posts} />{" "}
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}
