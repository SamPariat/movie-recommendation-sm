import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Suspense, useState } from "react";
import { Link } from "@mui/material";
import request from "../../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [signUp, setSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signUp && password === confirmPassword) {
      try {
        const response = await request("POST", "/auth/local/signup", null, {
          email,
          password,
          name,
        });

        // Handle successful response
        console.log("Registration successful!", response.data);
        // You might want to redirect or perform other actions upon successful registration
      } catch (error) {
        // Handle error response
        console.error("Try Again. Data was not sent to Backend!", error);
      }
    } else if (!signUp) {
      try {
        const response = await request("POST", "/auth/local/login", null, {
          email,
          password,
        });

        // Handle successful response
        console.log("Registration successful!", response.data);

        const profile = await request("GET", "/profile", null, {});
        console.log(profile.data);

        localStorage.setItem("name", (response.data as any).user.name);
        // You might want to redirect or perform other actions upon successful registration
        navigate("/");
      } catch (error) {
        // Handle error response
        console.error("Try Again. Data was not sent to Backend!", error);
      }
    } else {
      console.log("Chutiye Gaand se Type Mat Kar!");
    }
  };

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
          {signUp ? "Sign Up" : "Log In"}
        </Typography>
        <form method="post" onSubmit={handleSubmit}>
          <Grid container justifyContent="center" rowSpacing={5}>
            <Grid item xs={12}>
              <Stack alignItems="center">
                {signUp && (
                  <TextField
                    placeholder="Name.."
                    variant="outlined"
                    color="secondary"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                      mt: 5,
                      width: 500,
                    }}
                  />
                )}
                <TextField
                  placeholder="Email.."
                  variant="outlined"
                  color="secondary"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {signUp && (
                  <TextField
                    placeholder="Confirm Password.."
                    variant="outlined"
                    color="secondary"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    sx={{
                      mt: 5,
                      width: 500,
                    }}
                  />
                )}
                <Button
                  color="secondary"
                  sx={{ width: 250, mt: 4 }}
                  variant="contained"
                  type="submit"
                >
                  {signUp ? "Sign Up" : "Sign In"}
                </Button>
                <Button
                  color="secondary"
                  sx={{ width: 250, mt: 4 }}
                  variant="contained"
                  startIcon={<GoogleIcon />}
                >
                  Sign In With Google
                </Button>
                <Link
                  color="secondary.main"
                  sx={{ mt: 4, cursor: "pointer" }}
                  onClick={() => setSignUp(!signUp)}
                >
                  {signUp ? "SignUp" : "Don't have an account? Sign Up"}
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Suspense>
  );
};

export default Login;
