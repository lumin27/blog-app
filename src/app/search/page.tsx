"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState, useTransition } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Post } from "@prisma/client";
import BlogPostCard from "@/components/BlogPostCard";
import { getPosts } from "@/libs/actions";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const dbposts = await getPosts();
        setPosts(dbposts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const performSearch = () => {
    if (query.trim().length < 1) {
      setSearchedPosts([]);
      return;
    }
    startTransition(() => {
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedPosts(filteredPosts);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  };
  const handleClear = () => {
    setQuery("");
    setSearchedPosts([]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F1FAEE",
      }}>
      <Header />
      <Box sx={{ flexGrow: 1, mx: { xs: 2, sm: 3 }, mt: 15, mb: 10 }}>
        <Typography
          variant='h4'
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#1D3557",
            mt: 3,
          }}>
          Search Any Blog Post Here
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <TextField
            sx={{ width: "80%" }}
            value={query}
            label='Search Blog Post'
            variant='outlined'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            InputProps={{
              endAdornment: query && (
                <InputAdornment position='end'>
                  <CloseIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleClear}
                    aria-label='clear search'
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display='flex' flexWrap='wrap' justifyContent='center'>
          {searchedPosts.length > 0
            ? searchedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            : null}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SearchPage;
