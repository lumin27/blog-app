"use client";

import Footer from "@/components/Footer";
import { createPost, getCategories } from "@/libs/actions";
import {
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface CategoryProps {
  id: number;
  name: string;
}
export default function BlogForm() {
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbCategories = await getCategories();
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
        bgcolor: "#F1FAEE",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
      <Container component='main' maxWidth='md' sx={{ flexGrow: 1, py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
          }}>
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            align='center'
            sx={{ mb: 3, color: "#1D3557" }}>
            Create a New Blog Post
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component='form' action={createPost} sx={{ "& > *": { mb: 3 } }}>
            <TextField
              required
              type='file'
              name='image'
              sx={{ minWidth: "100%" }}></TextField>
            <Typography variant='h6' gutterBottom>
              Title
            </Typography>
            <TextField
              required
              fullWidth
              placeholder='Enter your blog post title'
              name='title'
              label='Enter your blog post title'
            />
            <Typography variant='h6' gutterBottom mt={2}>
              Content
            </Typography>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label='Enter your blog post content'
              name='content'
            />

            <Typography variant='h6' gutterBottom mt={2}>
              Category
            </Typography>
            <FormControl fullWidth>
              <Select
                required
                value={categoryId || ""}
                name='categoryId'
                onChange={(e) => setCategoryId(e.target.value)}
                displayEmpty
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}>
                <MenuItem value='' disabled>
                  Select a category
                </MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              onClick={() => setLoading(true)}
              sx={{
                mt: 2,
                backgroundColor: "#5c3c92",
                "&:hover": {
                  backgroundColor: "#7b5fa5",
                },
              }}>
              {loading && categoryId ? "Uploading..." : "Create Post"}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
