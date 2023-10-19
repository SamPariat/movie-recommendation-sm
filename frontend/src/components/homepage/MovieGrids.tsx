import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";

import type { MovieData } from "../../types/movie";
import api from "../../api";

const MovieGrids = () => {
  const [recommendations, setRecommendations] = useState<MovieData[] | null>(
    null
  );

  const fetchRecommendations = async () => {
    try {
      const response = await api<MovieData[]>("GET", "/model/recommendation", {
        movie: "Thor",
      });

      setRecommendations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <Grid container columnSpacing={5} rowSpacing={1} justifyContent="center">
      {recommendations &&
        recommendations.map((recommendation) => (
          <Grid item key={recommendation.title}>
            <Paper
              elevation={3}
              sx={{ bgcolor: "primary.main", mb: 4, maxWidth: 250 }}
            >
              <Stack direction="column" justifyContent="center">
                <img
                  src={recommendation.imagePath}
                  style={{
                    width: 250,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                />
                <Typography
                  pt={1}
                  pl={1}
                  textAlign="left"
                  fontWeight={700}
                  noWrap
                >
                  {recommendation.title}
                </Typography>
                <Typography
                  pl={1}
                  textAlign="left"
                  fontSize={11}
                  color="secondary.main"
                >
                  SciFi/Action
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};

export default MovieGrids;
