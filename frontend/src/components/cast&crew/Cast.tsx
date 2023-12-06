import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

// import MovieGrids from "../homepage/MovieGrids";
import { CastInfo } from "../../types/movie";
import api from '../../api'
import { useQuery } from "@tanstack/react-query";
import CastGrid from "./CastGrid";

const Cast = () => {
  const params = useParams();
  const fetchCastInfo = async () => {
    const response = await api<CastInfo | null>(
      "get",
      `/movie/cast?id=${params.movieId}`,
      null
    );
    return response.data;
  };

  const { data } = useQuery<CastInfo | null>({
    queryKey: ["cast info"],
    queryFn: fetchCastInfo,
  });

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
        textAlign="center"
        pl={4}
        pt={4}
        pb={5}
        fontWeight="bold"
      >
        Cast & Crew
      </Typography>
      <Grid container justifyContent="center" lg={12}>
        <CastGrid info = {data}/>
      </Grid>
      <Typography
        color="secondary.main"
        fontWeight="bold"
        variant="h4"
        py={4}
        textAlign="center"
      >
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
              src={data?.director[0].imagePath}
              style={{
                maxWidth: 250,
                //   maxHeight: 300,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            />
            <Typography pt={1} pl={1} textAlign="left" fontWeight={700}>
              {data?.director[0].name}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cast;
