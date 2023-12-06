import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

// import Gridsplit from "../homepage/GridSplit";
// import NotUserReviewsButton from "./NotUserReviewsButton";
// import { TextField } from "@mui/material";
import PopUpButton from "./PopUpButton";
import DynamicReviews from "./DynamicReviews";
// import NotUserReviewsButton from "./NotUserReviewsButton";
import ReviewGrids from "./ReviewGrids";
import ReviewStats from "./ReviewStats";

const Reviews = () => {
  const location = useParams();
  console.log(location);
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
        <Grid item pt={5}>
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
          <ReviewGrids />
        </Grid>
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
        <Grid item xs={12} sm={8} md={9} lg={10} mt={2}>
          <Paper elevation={3} sx={{ mx: 10, bgcolor: "primary.main", px: 3 }}>
            <Typography py={4} pl={0.4} textAlign="left" variant="subtitle2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              fuga quisquam molestias officia ab consectetur maxime nemo sed eum
              rem deserunt sequi explicabo veritatis incidunt debitis odio,
              reprehenderit ad nisi, fugit ipsam tempora magnam! Quos vero odio
              cupiditate ratione. Dolorem magni aperiam adipisci dolorum
              reprehenderit sint, quam explicabo recusandae. Numquam repellendus
              quas natus. Nemo fugit nobis fuga debitis eius beatae iure error
              id. Sed, tempora corrupti? Asperiores cum facilis distinctio quae?
              Nisi, tempore voluptas. Iusto, magnam! Deleniti molestias,
              suscipit repudiandae fugiat voluptate earum perferendis similique
              voluptates. Quaerat sunt vero, earum in, atque porro consectetur
              at perferendis reiciendis natus placeat id.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reviews;
