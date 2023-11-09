import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import type { TrendingInfo } from "../../types/movie";

const NotUserReviewsButton = () => {
  const fetchLatestTrending = async () => {
    const response = await api<TrendingInfo | null>(
      "get",
      "/movie/latest-trending",
      null
    );
    return response.data;
  };

  const { data, status } = useQuery<TrendingInfo | null>({
    queryKey: ["latest trending"],
    queryFn: fetchLatestTrending,
  });

  const navigate = useNavigate();

  return (
    <Grid container columnSpacing={1}>
      <Grid item xs={12} sm={4} md={3} lg={2} alignItems="center">
        <img
          src={data?.imagePath}
          style={{
            maxWidth: 250,
            borderRadius: 15,
            marginLeft: 30,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8} md={9} lg={10}>
        <Paper elevation={3} sx={{ mx: 10, bgcolor: "primary.main", px: 4 }}>
          <Typography
            pt={2}
            pl={0.4}
            textAlign="left"
            gutterBottom
            color="secondary"
            fontWeight="bold"
            variant="h4"
          >
            {data?.title}
          </Typography>
          <Typography ml={0.3} gutterBottom textAlign="left" fontSize={13}>
            2002
          </Typography>
          <Grid container columnSpacing={2} pl={0.4}>
            <Grid item ml={0.2}>
              <Typography
                border={1}
                borderRadius={4}
                padding={0.8}
                fontSize={11}
                fontWeight="bold"
              >
                Action
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                border={1}
                borderRadius={4}
                padding={0.8}
                fontSize={11}
                fontWeight="bold"
              >
                SciFi
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                border={1}
                borderRadius={4}
                padding={0.8}
                fontSize={11}
                fontWeight="bold"
              >
                Future
              </Typography>
            </Grid>
          </Grid>
          <Typography
            pl={0.4}
            gutterBottom
            textAlign="left"
            color="secondary"
            mt={1}
          >
            Overview
          </Typography>
          <Typography pl={0.4} textAlign="left" variant="subtitle2">
            {data?.tagline}
          </Typography>
          <Grid container mt={2} columnSpacing={4} pl={0.8} pb={2}>
            <Grid item>
              <Button
                sx={{ color: "white", border: 1, borderRadius: 20 }}
                onClick={() => navigate(`/cast-crew/${data?.id}`)}
              >
                Cast & Crew
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NotUserReviewsButton;
