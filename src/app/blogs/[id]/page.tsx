import {
  Box,
  Container,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { getBlogById } from "../actions";
import CommentSections from "@/components/CommentSections";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePost, getUser } from "@/libs/actions";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(Number(id));
  const user = await getUser();

  if (!blog) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant='h4'>Blog not found</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container component='main' sx={{ flexGrow: 1, py: 4 }}>
        <Typography sx={{ mb: 2 }} variant='h3' component='h1' gutterBottom>
          {blog.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}>
            <Avatar src={blog.author.name} alt={blog.author.name}>
              {blog.author.name[0]}
            </Avatar>
            <Box>
              <Typography variant='subtitle1'>{blog.author.name}</Typography>
              <Typography variant='subtitle2' color='text.secondary'>
                {blog.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            <Chip label={blog.category.name} color='primary' />
          </Box>

          {user?.email === blog.author.email && (
            <Box component='form' action={deletePost}>
              <IconButton aria-label='delete' type='submit' color='error'>
                <DeleteIcon sx={{ fontSize: "2rem" }} />
                <input type='hidden' name='id' value={blog.id} />
              </IconButton>
            </Box>
          )}
        </Box>

        {blog.imagePath && (
          <Box sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
            <img
              src={blog.imagePath}
              alt={blog.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <Typography
          variant='body1'
          component='article'
          sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
          {blog.content}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <CommentSections postId={blog.id} userId={blog.authorId} />
      </Container>
    </Box>
  );
}
