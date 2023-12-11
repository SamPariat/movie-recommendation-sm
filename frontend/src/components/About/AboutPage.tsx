import React from "react";
import { Typography, Paper, Box, Grid, Stack } from "@mui/material";

const AboutPage = () => {
  return (
    <Box>
      <Typography
        textAlign="center"
        color="secondary"
        variant="h3"
        fontWeight="600"
        py={5}
      >
        Frameworks Used
      </Typography>
      <Grid container py={5} justifyContent="center">
        <Grid item xs={12} sm={8} md={9} lg={6} mt={2} pb={3}>
          <Paper elevation={3} sx={{ mx: 10, bgcolor: "primary.main", px: 3 }}>
            <Stack spacing={1}>
              <Typography
                py={1}
                pl={0.4}
                textAlign="center"
                variant="h5"
                fontWeight="bold"
                color="secondary"
              >
                Frontend
              </Typography>
              <Typography py={1} pl={0.4} textAlign="center" variant="subtitle2">
                React.js
              </Typography>
              <Typography py={1} pl={0.4} textAlign="center" variant="subtitle2">
                Material UI
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={9} lg={6} mt={2} pb={3}>
          <Paper elevation={3} sx={{ mx: 10, bgcolor: "primary.main", px: 3 }}>
            <Stack spacing={1}>
              <Typography
                py={1}
                pl={0.4}
                textAlign="center"
                variant="h5"
                fontWeight="bold"
                color="secondary"
              >
                Backend
              </Typography>
              <Typography py={1} pl={0.4} textAlign="center" variant="subtitle2">
                Node.js
              </Typography>
              <Typography py={1} pl={0.4} textAlign="center" variant="subtitle2">
                Flask
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;
