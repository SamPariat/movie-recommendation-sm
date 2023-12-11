import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

type User_ReviewsProps = {
  name: string;
  review: string;
  sentiment: string;
};

const User_Reviews = ({ name, review, sentiment }: User_ReviewsProps) => {
  return (
    <Grid item xs={12} sm={8} md={9} lg={10} mt={2} pb={3}>
      <Paper elevation={3} sx={{ mx: 10, bgcolor: "primary.main", px: 3 }}>
        <Stack spacing={1}>
          <Typography
            py={1}
            pl={0.4}
            textAlign="left"
            variant="subtitle2"
            fontWeight="bold"
          >
            User Name: {name}
          </Typography>
          <Typography py={1} pl={0.4} textAlign="left" variant="subtitle2">
            {review}
          </Typography>
          <Typography py={1} pl={0.4} textAlign="left" variant="subtitle2" fontWeight="bold" color="secondary">
            Predicted Sentiment: {sentiment}
          </Typography>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default User_Reviews;
