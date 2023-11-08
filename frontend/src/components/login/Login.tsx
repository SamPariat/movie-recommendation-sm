import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";

const Login = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Box
        bgcolor="primary.main"
        flexGrow={1}
        flexDirection="column"
        minHeight="100vh"
      >
        <Typography
          fontWeight="bold"
          color="secondary"
          variant="h3"
          py={4}
          textAlign="center"
        >
          Login
        </Typography>
        <Grid container justifyContent="center" rowSpacing={5}>
          <Grid item xs={12}>
            <Stack alignItems="center">
              <TextField
                placeholder="Email.."
                variant="outlined"
                color="secondary"
                label="Email"
                sx={{
                  mt: 5,
                  width: 500,
                }}
              />
              <TextField
                placeholder="Password.."
                variant="outlined"
                color="secondary"
                label="Password"
                type="password"
                sx={{
                  mt: 5,
                  width: 500,
                }}
              />
              <Button
                color="secondary"
                sx={{ width: 250, mt: 4 }}
                variant="contained"
              >
                Sign In
              </Button>
              <Button
                color="secondary"
                sx={{ width: 250, mt: 4 }}
                variant="contained"
                startIcon={<GoogleIcon />}
              >
                Sign In With Google
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Suspense>
  );
};

export default Login;
