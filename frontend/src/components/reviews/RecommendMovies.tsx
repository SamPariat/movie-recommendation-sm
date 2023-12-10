import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
// import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api";

const RecommendMovies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchTop5Recommends = async () => {
    const response = await api<any>(
      "get",
      `/model/recommendation?movie=${location.state.name}`,
      null,
      null
    );
    return response.data.recommendations;
  };

  const { data, status } = useQuery({
    queryKey: ["top 5 recommends", location.state.name],
    queryFn: fetchTop5Recommends,
  });

  console.log(data);

  if (status === "pending") {
    return <CircularProgress />;
  }

  return (
    <>
      <Grid item pt={5}>
        <Typography
          textAlign="left"
          px={10}
          color="secondary.main"
          variant="h5"
          fontWeight="bold"
        >
          {data && "Recommended Movies For You"}
        </Typography>
      </Grid>
      <Grid item pt={5} pl={2}>
        <Grid
          container
          columnSpacing={5}
          rowSpacing={1}
          justifyContent="center"
        >
          {data &&
            data.map((recommendation: any) => (
              <Grid item key={recommendation.title}>
                <Paper
                  elevation={3}
                  onClick={() =>
                    navigate(`reviews/${recommendation.id}`, {
                      state: { name: recommendation.title },
                    })
                  }
                  sx={{
                    bgcolor: "primary.main",
                    mb: 4,
                    maxWidth: 250,
                    cursor: "pointer",
                  }}
                >
                  <Stack direction="column" justifyContent="center">
                    <img
                      src={recommendation.imagePath}
                      alt={recommendation.title}
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
                  </Stack>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RecommendMovies;
