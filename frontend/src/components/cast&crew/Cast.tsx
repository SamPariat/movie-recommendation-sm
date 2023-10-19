import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MovieGrids from "../homepage/MovieGrids";

const Cast = () => {
  return (
    <Box
      bgcolor="primary.main"
      flexGrow={1}
      flexDirection="column"
      minHeight="100vh"
    >
      <Typography
        variant="h3"
        color="secondary.main"
        textAlign="left"
        pl={4}
        pt={4}
        pb={5}
        fontWeight="bold"
      >
        Cast & Crew
      </Typography>
      <Grid container justifyContent="center" lg={12}>
        <MovieGrids />
      </Grid>
      <Typography color="secondary.main" fontWeight="bold" variant="h4" py={4}>
        Director
      </Typography>
      {/* Director */}
      <Grid container justifyContent="center">
        <Grid item>
          <Paper
            elevation={3}
            sx={{ bgcolor: "primary.main", mb: 4, width: 250 }}
          >
            <Stack direction="column" />
            <img
              src="https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
              style={{
                maxWidth: 250,
                //   maxHeight: 300,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            />
            <Typography pt={1} pl={1} textAlign="left" fontWeight={700}>
              Intersteller
            </Typography>
            <Typography
              pl={1}
              textAlign="left"
              fontSize={11}
              color="secondary.main"
            >
              SciFi/Action
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cast;
