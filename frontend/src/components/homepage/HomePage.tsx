import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import api from "../../api";
import GridSplit from "./GridSplit";
import MovieGrids from "./MovieGrids";

interface MovieOption {
  id: number;
  title: string;
}

const HomePage = () => {
  const [movies, setMovies] = useState<MovieOption[] | null>(null);

  const filterOptions = createFilterOptions({
    limit: 50,
    stringify: (option: MovieOption) => option.title,
  });

  const fetchAllMovies = async () => {
    try {
      const response = await api<{ dicc_arr: MovieOption[] }>(
        "GET",
        "/movie/all",
        null
      );

      setMovies(response.data.dicc_arr);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  return (
    <Box bgcolor="primary.main" flexGrow={1} flexDirection="column">
      <Typography
        pt={5}
        variant="h4"
        color="secondary"
        fontWeight={600}
        textAlign="center"
      >
        Welcome to CineSuggest!
      </Typography>
      <Grid container justifyContent="center" rowSpacing={5}>
        <Grid item xs={8}>
          {movies && (
            <Autocomplete
              disablePortal
              blurOnSelect="mouse"
              options={movies}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select a Movie..." />
              )}
              getOptionLabel={(option) => option.title}
              filterOptions={filterOptions}
            />
          )}
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
  );
};

export default HomePage;
