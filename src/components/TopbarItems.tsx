"use client";

import {
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

<CloseIcon />;
interface TopbarItemsProps {
  id: number;
  label: string;
  route: string;
  pathName: string;
}

export const topBarItems: TopbarItemsProps[] = [
  {
    id: 1,
    label: "Home",
    route: "/home",
    pathName: "/home",
  },
  {
    id: 2,
    label: "Blogs",
    route: "/blogs",
    pathName: "/blogs",
  },
  {
    id: 3,
    label: "Category",
    route: "/categories",
    pathName: "/categories",
  },
  {
    id: 4,
    label: "Search",
    route: "/search",
    pathName: "/search",
  },
];

const TopbarItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathName = usePathname();

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const topBarList = (
    <Box
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          fontSize: "1.3rem",
        }}>
        {topBarItems.map((item) => (
          <Link
            style={{
              textDecoration: "none",
              cursor: "pointer",
            }}
            href={item.route}
            key={item.id}
            passHref>
            <ListItem
              sx={{
                color: pathName.includes(item.route) ? "yellow" : "white",
                "&:hover": {
                  fontWeight: "bold",
                  boxShadow: "0 3px 0 0 #f1faee ",
                  transition: "box-shadow 0.3s ease-out",
                },
              }}>
              {item.label}
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer anchor='right' open={isOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ bgcolor: "#F1FAEE", height: "100vh" }}>
            <Box
              role='presentation'
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              sx={{
                display: "flex",
                ml: "5px",
                mt: "5px",
              }}>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    borderRadius: "50%",
                    border: "2px solid black",
                  }}
                />
              </IconButton>
            </Box>
            <List
              sx={{
                fontSize: "1.2rem",
                width: { xs: "40vw", sm: "300px" },
                display: "flex",
                flexDirection: "column",
              }}>
              {topBarItems.map((item) => (
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    transition: "background-color 1s ease",
                  }}
                  href={item.route}
                  key={item.id}
                  passHref>
                  <ListItem
                    sx={{
                      color: pathName.includes(item.route)
                        ? "#5c3c92"
                        : "black",
                      fontWeight: pathName.includes(item.route)
                        ? "bold"
                        : "normal",
                      "&:hover": {
                        fontWeight: "bold",
                        boxShadow: "0 3px 0 0 #f1faee",
                        transform: "translateY(-3px)",
                        transition: "transform 0.3s",
                      },
                    }}>
                    {item.label}
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </Drawer>
      ) : (
        <Box>{topBarList}</Box>
      )}

      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: "80px",
            right: "15px",
            zIndex: 1300,
          }}>
          {isOpen ? null : (
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
              onClick={toggleDrawer(true)}
              sx={{
                position: "fixed",
                top: 75,
                right: 16,
                zIndex: 2,
              }}>
              <MenuIcon
                sx={{
                  border: "1px solid white",
                  bgcolor: "#6b705c",
                  borderRadius: "50%",
                  color: "white",
                  padding: "10px",
                  fontSize: "3rem",
                }}
              />
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
};

export default TopbarItems;
