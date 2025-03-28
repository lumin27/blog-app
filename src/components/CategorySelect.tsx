import React from "react";
import { FormControl, MenuItem, Select, Typography, Box } from "@mui/material";
import { getCategories } from "@/libs/actions";
import { Category } from "@prisma/client";

interface Props {
  categories: Category[];
}

export default async function CategorySelect() {
  const categories = await getCategories();
  return (
    <Box>
      <Typography variant='h6' gutterBottom mt={2}>
        Category
      </Typography>
      <FormControl fullWidth>
        <Select
          value={""}
          onChange={(e) => console.log(e.target.value)}
          displayEmpty
          sx={{
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}>
          <MenuItem value='' disabled>
            Select a category
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
