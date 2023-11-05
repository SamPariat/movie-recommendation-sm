import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./components/homepage/HomePage";
import NavContainer from "./components/navbar/NavContainer";
import Reviews from "./components/reviews/Reviews";
import Cast from "./components/cast&crew/Cast";
import Login from "./components/login/Login";

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: amber[600],
    },
    mode: "dark",
    warning: {
      main: grey[800],
    },
  },
  typography: {
    fontFamily: "monospace",
    fontWeightMedium: 800,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavContainer />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: null },
      { path: "login", element: <Login /> },
      { path: "cast-crew/:movieId", element: <Cast /> },
      { path: "reviews/:movieId", element: <Reviews /> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
