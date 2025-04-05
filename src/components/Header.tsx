"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TopbarItems from "./TopbarItems";
import { signOut } from "next-auth/react";
import { getUser } from "@/libs/actions";

const Header = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  const isAuthenticated = user && user.email;

  return (
    <Box
      sx={{
        width: "100vw",
        backgroundColor: "#5c3c92",
        color: "#F1FAEE",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "10px",
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}>
      <Box sx={{ display: "flex", gap: "100px" }}>
        <Typography variant='h4' fontWeight='bold'>
          BlogApp
        </Typography>
        <TopbarItems />
      </Box>

      <Box sx={{ display: "flex", gap: "20px" }}>
        {user === null ? null : isAuthenticated ? (
          <>
            <Link href='/post'>
              <Button
                variant='contained'
                sx={{ color: "#F1FAEE", bgcolor: "#5c3c92" }}>
                Create
              </Button>
            </Link>
            <Button
              sx={{ color: "#F1FAEE", bgcolor: "#5c3c92" }}
              variant='contained'
              onClick={() => signOut({ callbackUrl: "/blogs" })}>
              Logout
            </Button>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography mr={2}>Create An Account</Typography>
            <Link href='/signin'>
              <Button
                variant='contained'
                sx={{ color: "#F1FAEE", bgcolor: "#5c3c92", mr: 2 }}>
                Log In
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
