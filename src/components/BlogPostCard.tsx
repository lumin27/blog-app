"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { ThumbUp, Favorite } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

interface Props {
  post: any;
}

export default function BlogPostCard({ post }: Props) {
  const [loading, setLoading] = useState(false);
  const { title, content, author, category } = post;
  const [onHover, setOnHover] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const imageUrl = post.imagePath
    ? post.imagePath
    : "https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg";

  return (
    <Card
      sx={{
        height: "100%",
        width: isMobile ? 380 : 350,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": { boxShadow: 6 },
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component='img'
          image={imageUrl}
          alt={post}
          sx={{
            borderRadius: " 2px 2px 8px 8px",
            height: { sm: 150, md: 380 },
          }}
        />
        {onHover && (
          <Chip
            label={category.name}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#1D3557",
              color: "white",
            }}
          />
        )}
        {isMobile && (
          <Chip
            label={category.name}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#1D3557",
              color: "white",
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant='h6' noWrap>
          {title}
        </Typography>
        <Box sx={{ maxHeight: 90, maxWidth: 350, overflow: "hidden" }}>
          <Typography
            variant='body1'
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "pre-line",
            }}>
            {content}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}>
        <Typography variant='caption' color='text.secondary'>
          {post.createdAt.toLocaleDateString()} | By {author.name} |
          <IconButton size='small' sx={{ mb: 0.5 }}>
            <ThumbUp color='primary' sx={{ fontSize: "1rem" }} />
            <Favorite color='error' sx={{ fontSize: "1rem" }} />
          </IconButton>
          <Typography variant='caption' sx={{ fontSize: "0.9rem", ml: 0.5 }}>
            {post.reaction.length || ""}
          </Typography>
        </Typography>
        <Button
          size='small'
          component={Link}
          href={`/blogs/${post.id}`}
          onClick={() => setLoading(true)}>
          {loading ? "Loading..." : "Read More"}
        </Button>
      </CardActions>
    </Card>
  );
}
