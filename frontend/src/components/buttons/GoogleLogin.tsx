import Button from "@mui/material/Button";

const GoogleLogin = () => {
  const signIn = () => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/auth/google/authenticate`,
      "_self"
    );
  };

  return (
    <Button bgcolor="primary.main" onClick={signIn}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLogin;
