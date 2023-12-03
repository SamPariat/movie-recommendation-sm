import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
// import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CastInfo } from "../../types/movie";

import api from "../../api";

type CastGridProps = {
  info ?: CastInfo | null;
};

const CastGrid = ({info} : CastGridProps) => {
  if (status === "pending") {
    return <CircularProgress />;
  }

  return (
    <Grid container columnSpacing={5} rowSpacing={1} justifyContent="center">
      {info &&
        info.actors.map((actor) => (
          <Grid item key={actor.name}>
            <Paper
              elevation={3}
              sx={{ bgcolor: "primary.main", mb: 4, maxWidth: 250 }}
            >
              <Stack direction="column" justifyContent="center">
                <img
                  src={actor.imagePath}
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
                  {actor.name}
                </Typography>
                <Typography
                  pl={1}
                  textAlign="left"
                  fontSize={11}
                  color="secondary.main"
                >
                  {actor.character}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};

export default CastGrid;
