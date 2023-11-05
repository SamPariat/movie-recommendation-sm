import { Typography, Box, Grid, TextField, Stack, Button } from "@mui/material";

const Login = () => {
  return (
    <Box
      bgcolor="primary.main"
      flexGrow={1}
      flexDirection="column"
      minHeight="100vh"
    >
      <Typography fontWeight="bold" color="secondary" variant="h3" py={4} textAlign="center">
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
            <Typography
              variant="h5"
              py={4}
              fontWeight="bold"
              color="secondary.main"
            >
              Sign In Using Google
            </Typography>
            <Button color="secondary" sx={{ width: 250 }} variant="contained">
              Google
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
