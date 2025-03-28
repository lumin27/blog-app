"use client";

import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#F1FAEE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
      <Typography
        component='h1'
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, fontSize: "2rem" }}>
        Welcome to BlogApp
      </Typography>
      <Typography sx={{ textAlign: "center", mb: 4, maxWidth: 350 }}>
        Sign in to your account to continue.
      </Typography>
      <Button
        sx={{
          bgcolor: "#1D3557",
          color: "white",
          "&:hover": { bgcolor: "#457B9D" },
        }}
        variant='contained'
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google", { callbackUrl: "/blogs" })}>
        Sign in with Google
      </Button>
    </Box>
  );
}
