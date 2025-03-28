"use client";

import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ThumbUp,
  Favorite,
  ThumbUpOutlined,
  FavoriteBorderOutlined,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState, useTransition } from "react";
import {
  createComment,
  deleteComment,
  getComments,
  getReactions,
  getUser,
  getUserReactions,
  toggleReaction,
  updateComment,
} from "@/libs/actions";
import { ReactionType, User } from "@prisma/client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Link from "next/link";

interface Props {
  postId: number;
  userId: number;
}

interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: Date;
}

const CommentSections = ({ postId, userId }: Props) => {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [newComment, setNewComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editComment, setEditComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState<any>(null);
  const [reactions, setReactions] = useState({
    likes: 0,
    loves: 0,
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const dbuser = await getUser();
        setUser(dbuser);
        const dbComments = await getComments(postId);
        if (dbComments?.success) {
          setComments(dbComments.comments);
        } else {
          setComments([]);
        }
        const dbReactions = await getReactions(postId);
        const userReactions = await getUserReactions(postId);
        if (dbReactions?.success) {
          setReactions(dbReactions.reactions);
        } else {
          setReactions({ likes: 0, loves: 0 });
        }

        if (userReactions?.success) {
          setUserReaction(userReactions.userReaction);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [postId, userId]);

  const handleReaction = (type: ReactionType) => {
    const previousReaction = userReaction;
    const newReactions = { ...reactions };
    if (previousReaction === type) {
      newReactions[type === ReactionType.LIKE ? "likes" : "loves"] -= 1;
      setUserReaction(null);
    } else {
      if (previousReaction) {
        newReactions[
          previousReaction === ReactionType.LIKE ? "likes" : "loves"
        ] -= 1;
      }

      newReactions[type === ReactionType.LIKE ? "likes" : "loves"] += 1;
      setUserReaction(type);
    }

    setReactions(newReactions);
    startTransition(async () => {
      try {
        await toggleReaction(postId, type);
      } catch (error) {
        console.error("Error toggling reaction:", error);
        setUserReaction(previousReaction);
        const reactionsRes = await getReactions(postId);
        if (reactionsRes?.success) {
          setReactions(reactionsRes.reactions);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stack direction='row' spacing={2}>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box>
                <IconButton
                  onClick={() => handleReaction(ReactionType.LIKE)}
                  color={
                    userReaction === ReactionType.LIKE ? "primary" : "default"
                  }>
                  <Badge badgeContent={reactions.likes} color='primary'>
                    {userReaction ? <ThumbUp /> : <ThumbUpOutlined />}
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={() => handleReaction(ReactionType.LOVE)}
                  color={
                    userReaction === ReactionType.LOVE ? "error" : "default"
                  }>
                  <Badge badgeContent={reactions.loves} color='error'>
                    {userReaction == ReactionType.LOVE ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </Badge>
                </IconButton>
              </Box>
              <Box
                onClick={() => setNewComment(true)}
                sx={{ display: "flex", ml: 4, alignItems: "center" }}>
                <IconButton>
                  <AddCommentIcon />
                </IconButton>
                <Typography variant='body1' sx={{ cursor: "pointer" }}>
                  New Comment
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Box>
                <IconButton
                  onClick={() => alert("You need to sign in to react!")}>
                  <Badge badgeContent={reactions.likes} color='primary'>
                    <ThumbUpOutlined />
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={() => alert("You need to sign in to react!")}>
                  <Badge badgeContent={reactions.loves} color='error'>
                    {userReaction == ReactionType.LOVE ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </Badge>
                </IconButton>
              </Box>
              <Box sx={{ ml: 2 }}>
                <Link href={"/signin"} style={{ textDecoration: "none" }}>
                  <Typography
                    variant='body1'
                    sx={{
                      cursor: "pointer",
                      color: "red",
                      mt: 1,
                      textDecoration: "underline",
                    }}>
                    Need to Sign in to comment
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>
      {newComment ? (
        <Card sx={{ mb: 4, borderRadius: "3gi0px" }}>
          <CardContent>
            <Box
              component={"form"}
              action={createComment}
              sx={{ borderRadius: "20px", overflow: "hidden" }}>
              <input type='hidden' name='postId' value={postId} />
              {userId ? (
                <input type='hidden' name='userId' value={userId} />
              ) : null}
              {isMobile ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                  }}>
                  <TextField
                    name='text'
                    fullWidth
                    multiline
                    rows={Math.min(
                      10,
                      Math.max(2, Math.floor(query.length / 30))
                    )}
                    value={editComment ? "" : query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Add a comment...'
                    variant='outlined'
                    sx={{
                      bgcolor: "grey.100",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                    }}
                  />
                  {query.trim().length > 0 ? (
                    <IconButton
                      type='submit'
                      sx={{
                        color: "primary.main",
                        alignSelf: "flex-end",
                      }}>
                      <SendIcon />
                    </IconButton>
                  ) : null}
                </Box>
              ) : (
                <TextField
                  name='text'
                  fullWidth
                  multiline
                  rows={Math.min(
                    10,
                    Math.max(2, Math.floor(query.length / 30))
                  )}
                  value={editComment ? "" : query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Add a comment...'
                  variant='outlined'
                  sx={{
                    bgcolor: "grey.100",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          type='submit'
                          sx={{
                            color:
                              query.trim().length > 0
                                ? "primary.main"
                                : "text.secondary",
                            position: "absolute",
                            right: 10,
                            bottom: 10,
                          }}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Divider sx={{ mb: 3 }} />
      )}
      {comments.length > 0 && (
        <>
          <Typography variant='h6' gutterBottom>
            Comments
          </Typography>
          <Paper sx={{ p: 2 }}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                }}>
                <Avatar sx={{ mr: 1 }}>{comment.author.name[0]}</Avatar>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "grey.100",
                    borderRadius: "18px",
                    p: 1,
                    overflow: "hidden",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <Typography variant='subtitle1' mr={1}>
                      {comment.author.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {comment.createdAt.toLocaleString()}
                    </Typography>
                    {user?.email === comment.author.email && (
                      <Box sx={{ ml: "auto", display: "flex" }}>
                        <IconButton
                          onClick={() => {
                            setEditComment(true);
                            setEditCommentId(comment.id);
                          }}
                          sx={{
                            ":hover": { color: "primary.main" },
                          }}>
                          <EditIcon
                            sx={{
                              fontSize: "1rem",
                              color: isMobile ? "primary.main" : "",
                            }}
                          />
                        </IconButton>
                        <Box component={"form"} action={deleteComment}>
                          <IconButton
                            type='submit'
                            sx={{ ":hover": { color: "error.main" } }}>
                            <DeleteIcon
                              sx={{
                                fontSize: "1rem",
                                color: isMobile ? "error.main" : "",
                              }}
                            />
                            <input type='hidden' name='id' value={comment.id} />
                            <input type='hidden' name='postId' value={postId} />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  {editComment && comment.id === editCommentId ? (
                    <Box
                      component={"form"}
                      action={updateComment}
                      sx={{ borderRadius: "20px", overflow: "hidden" }}>
                      <input type='hidden' name='id' value={comment.id} />
                      <input type='hidden' name='postId' value={postId} />
                      <TextField
                        name='text'
                        fullWidth
                        multiline
                        rows={2}
                        defaultValue={comment.text}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Add a comment...'
                        variant='outlined'
                        sx={{
                          bgcolor: "grey.100",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                type='submit'
                                sx={{
                                  color:
                                    query.trim().length > 0
                                      ? "primary.main"
                                      : "text.secondary",
                                  position: "absolute",
                                  right: 10,
                                  bottom: 10,
                                }}>
                                <SendIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography
                      variant='body1'
                      sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}>
                      {comment.text}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default CommentSections;
