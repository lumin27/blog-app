"use client";

import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        bgcolor: "#F1FAEE",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        height: "100vh",
        pt: {
          xs: "120px",
          sm: "150px",
          md: "150px",
          xl: "180px",
          "2xl": "210px",
        },
        pb: {
          xs: "16px",
          sm: "120px",
          md: "120px",
          xl: "160px",
          "2xl": "200px",
        },
      }}>
      <Container maxWidth='lg'>
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent='center'
          sx={{ bgcolor: "#F1FAEE" }}>
          <Box width='100%' px={4}>
            <Box mx='auto' maxWidth='800px' textAlign='center'>
              <Typography
                variant='h3'
                component='h1'
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  color: "text.primary",
                  dark: { color: "text.secondary" },
                }}>
                Next js Blog (CRUD) Full-Stack Website Using Prisma
              </Typography>
              <Typography
                variant='body1'
                component='p'
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.125rem",
                    md: "1.25rem",
                  },
                  fontWeight: "medium",
                  opacity: 0.9,
                  color: "text.secondary",
                }}>
                This is a Next.js full-stack template that we can use to create
                Blogs based on different categories and also with
                authentication. We can also use this template to create a
                full-stack website using Next.js, Prisma, and PostgreSQL. This
                website is full of functionalities.
              </Typography>
            </Box>
            <Box
              display='flex'
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent='center'
              alignItems='center'
              gap={2}>
              <Link href='/blogs' passHref>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{
                    py: 2,
                    px: 4,
                    mt: 2,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}>
                  Explore All Blogs
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
