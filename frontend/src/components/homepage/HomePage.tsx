import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";

import GridSplit from "./GridSplit";
import MovieGrids from "./MovieGrids";
import SearchList from "./SearchList";

const HomePage = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Box bgcolor="primary.main" flexGrow={1} flexDirection="column">
        <Typography
          pt={5}
          variant="h3"
          color="secondary"
          fontWeight={600}
          textAlign="center"
        >
          Welcome to CineSuggest
        </Typography>
        <Grid container justifyContent="center" rowSpacing={5}>
          <Grid item xs={8}>
            <SearchList />
          </Grid>
          <Grid item xs={12}>
            <GridSplit />
          </Grid>
          <Grid item xs={12}>
            <Typography
              pl={10}
              textAlign="left"
              variant="h5"
              color="secondary"
              fontWeight={700}
            >
              Recommended Movies For You
            </Typography>
          </Grid>
          <Grid item>
            <MovieGrids />
          </Grid>
        </Grid>
      </Box>
    </Suspense>
  );
};

export default HomePage;
