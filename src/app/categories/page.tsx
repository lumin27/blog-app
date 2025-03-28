"use client";

import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCategories, getPosts } from "@/libs/actions";
import {
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface CategoryProps {
  id: number;
  name: string;
}

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.name === selectedCategory)
    : posts;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbposts = await getPosts();
        const dbCategories = await getCategories();
        setPosts(dbposts);
        setCategories(dbCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
              color={selectedCategory === category.name ? "primary" : "default"}
            />
          ))}
        </Stack>
        {filteredPosts.length > 0 ? (
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
