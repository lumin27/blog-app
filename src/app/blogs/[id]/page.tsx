import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { getBlogById } from "../actions";
import CommentSections from "@/components/CommentSections";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePost, getUser } from "@/libs/actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function BlogDetail({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(Number(id));
  const user = await getUser();

  if (!blog) {
    return <Box>Blog not found</Box>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
      <Container component={"main"} sx={{ flexGrow: 1, py: 4 }}>
        <Typography sx={{ mb: 2 }} variant='h4' gutterBottom>
          {blog.title}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
            }}>
            <Avatar sx={{ mr: 2 }}>{blog.author.name[0]}</Avatar>
            <Typography sx={{ mr: 2 }} variant='subtitle1'>
              {blog.author.name}
            </Typography>
            <Typography
              variant='subtitle2'
              color='text.secondary'
              sx={{ mr: 2 }}>
              {blog.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Chip label={blog.category.name} />
            {user?.email === blog.author.email ? (
              <Box
                component={"form"}
                action={deletePost}
                sx={{ display: "flex", ml: "auto" }}>
                <IconButton aria-label='delete' type='submit'>
                  <DeleteIcon sx={{ color: "red", fontSize: "2rem" }} />
                  <input type='hidden' name='id' value={blog.id} />
                </IconButton>
              </Box>
            ) : null}
          </Box>
        </Box>
        <Box>
          <Box>
            <img
              src={blog.imagePath as string}
              alt={blog.title}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Typography variant='body1' sx={{ whiteSpace: "pre-wrap" }}>
              {blog.content}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <CommentSections postId={blog.id} userId={blog.author.id} />
        </Box>
      </Container>
    </Box>
  );
}
