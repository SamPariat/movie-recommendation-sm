import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import User_Reviews from "./User_Reviews";

// import Gridsplit from "../homepage/GridSplit";
// import NotUserReviewsButton from "./NotUserReviewsButton";
// import { TextField } from "@mui/material";
import DynamicReviews from "./DynamicReviews";
import PopUpButton from "./PopUpButton";
// import NotUserReviewsButton from "./NotUserReviewsButton";
import api from "../../api";
import RecommendMovies from "./RecommendMovies";
import ReviewStats from "./ReviewStats";
import { CircularProgress } from "@mui/material";

const Reviews = () => {
  // const location = useParams();
  // console.log(location);
  const location = useLocation();
  console.log(location);

  const [page, setPage] = useState<number>(1);

  const fetchUserReviews = async () => {
    const response = await api<{ reviews: any[] }>(
      "get",
      `/sentiment/get-reviews/${location.state.name}?page=${page}&limit=3`,
      null,
      null
    );
    return response.data;
  };

  const { data, status } = useQuery({
    queryKey: ["User reviews", location.state.name, page],
    queryFn: fetchUserReviews,
  });

  console.log(data);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setPage(value);
  };

  // if (status === "pending") {
  //   return <CircularProgress />;
  // }

  return (
    <Box
      bgcolor="primary.main"
      flexGrow={1}
      flexDirection="column"
      minHeight="100vh"
    >
      <Grid container pt={10}>
        <Grid item>
          <DynamicReviews />
          {/* <NotUserReviewsButton/> */}
        </Grid>
        {/* <Grid item pt={5}>
          <Typography
            textAlign="left"
            px={10}
            color="secondary.main"
            variant="h5"
            fontWeight="bold"
          >
            Recommended Movies For You
          </Typography>
        </Grid>
        <Grid item pt={5} pl={2}>
          <RecommendMovies />
        </Grid> */}
        <RecommendMovies />
      </Grid>
      <Grid container>
        <Grid item pt={5}>
          <Typography
            textAlign="left"
            px={10}
            color="secondary.main"
            variant="h5"
            fontWeight="bold"
          >
            Review Statistics
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item>
          <ReviewStats />
        </Grid>
      </Grid>
      <Typography
        textAlign="left"
        px={10}
        color="secondary.main"
        variant="h5"
        fontWeight="bold"
      >
        Write Your Own Review
      </Typography>
      <Grid container py={5} justifyContent="center">
        <Grid item xs={12} sm={8} md={9} lg={10} mt={2}>
          <PopUpButton />
        </Grid>
      </Grid>
      <Typography
        textAlign="left"
        px={10}
        color="secondary.main"
        variant="h5"
        fontWeight="bold"
      >
        User Reviews
      </Typography>
      <Grid container py={5} justifyContent="center">
        {data?.reviews.map((review) => (
          <User_Reviews
            key={review._id}
            name={review.name}
            review={review.review}
            sentiment={review.sentiment}
          />
        ))}
      </Grid>
      <Stack alignItems="center">
        <Pagination
          count={10}
          page={page}
          onChange={handleChange}
          variant="outlined"
          color="secondary"
        />
      </Stack>
    </Box>
  );
};

export default Reviews;
