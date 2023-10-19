// import SearchIcon from "@mui/icons-material/Search";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
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
      const response = await api<MovieOption[]>("GET", "/movie/all", null);

      console.log(response.data);

      setMovies(response.data);
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
          {/* <TextField
            placeholder="Please Enter a Movie.."
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{
              mt: 5,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="secondary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          /> */}
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
