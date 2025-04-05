"use client";

import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCategories, getPosts } from "@/libs/actions";
import { Box, Chip, Stack, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

interface CategoryProps {
  id: number;
  name: string;
}

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.name === selectedCategory)
    : posts;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbPosts = await getPosts();
        const dbCategories = await getCategories();
        setPosts(dbPosts);
        setCategories(dbCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F1FAEE",
      }}>
      <Header />
      <Box component={"main"} sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: "bold" }}>
          Latest Blog Posts
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Skeleton variant='text' width={100} height={40} />
            <Skeleton variant='text' width={100} height={40} />
            <Skeleton variant='text' width={100} height={40} />
          </Box>
        ) : (
          <Stack direction='row' flexWrap='wrap' gap={1}>
            <Chip
              label='All'
              onClick={() => setSelectedCategory(null)}
              color={selectedCategory === null ? "primary" : "default"}
            />
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => setSelectedCategory(category.name)}
                color={
                  selectedCategory === category.name ? "primary" : "default"
                }
              />
            ))}
          </Stack>
        )}

        {loading ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            {[...Array(4)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "23%" },
                  mt: 2,
                }}>
                <Skeleton variant='rectangular' width='100%' height={400} />
                <Skeleton
                  variant='text'
                  width='80%'
                  height={20}
                  sx={{ mt: 1 }}
                />
                <Skeleton variant='text' width='60%' height={20} />
              </Box>
            ))}
          </Box>
        ) : filteredPosts.length > 0 ? (
          <Box
            display='flex'
            flexWrap='wrap'
            gap={2}
            sx={{
              justifyContent: "flex-start",
              mt: 2,
            }}>
            {filteredPosts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  mt: 1,
                  flexBasis: { xs: "100%", sm: "48%", md: "24%" },
                }}>
                <BlogPostCard post={post} />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant='h5' sx={{ mt: 20, textAlign: "center" }}>
            No posts found for this category.
          </Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Categories;
