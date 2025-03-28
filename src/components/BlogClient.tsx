"use client";

import { Box, Container, Typography } from "@mui/material";
import BlogPostCard from "@/components/BlogPostCard";
import { Post } from "@prisma/client";

interface Props {
  posts: Post[];
}

const ClientBlog = ({ posts }: Props) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container
        component='main'
        sx={{
          flexGrow: 1,
          py: 4,
        }}>
        <Typography variant='h5' gutterBottom>
          Post Your Blogs Here
        </Typography>
        <Box display='flex' flexWrap='wrap' justifyContent='flex-start' gap={1}>
          {posts.map((post) => (
            <Box
              key={post.id}
              sx={{
                m: 1,
                flexBasis: { xs: "100%", sm: "48%", md: "24%" },
              }}>
              <BlogPostCard post={post} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ClientBlog;
