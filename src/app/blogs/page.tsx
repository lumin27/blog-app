"use client";

import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import BlogClient from "@/components/BlogClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPosts } from "@/libs/actions";

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if it's mobile screen size

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          mt: "80px",
        }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Skeleton variant='text' height={50} width='50%' sx={{ ml: 4 }} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                px: 2,
                ml: 3,
              }}>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ width: isMobile ? "100%" : "30%" }}>
                  <Skeleton variant='rectangular' width='100%' height={380} />
                  <Skeleton variant='text' width='80%' height={35} />
                  <Skeleton variant='text' width='60%' height={30} />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <BlogClient posts={posts} />
        )}
      </Box>
    </Box>
  );
}
