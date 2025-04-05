import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";
import React from "react";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Header />
      <Box sx={{ mt: "80px", minHeight: "100vh" }}>{children}</Box>
      <Footer />
    </Box>
  );
}
