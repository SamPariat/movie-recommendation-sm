import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import NavContainer from "./components/navbar/NavContainer";
import HomePage from "./components/homepage/HomePage";
import Reviews from "./components/reviews/Reviews";
import Cast from "./components/cast&crew/Cast";
import Login from "./components/login/Login";
// const HomePage = lazy(() => import("./components/homepage/HomePage"));
// const Reviews = lazy(() => import("./components/reviews/Reviews"));
// const Cast = lazy(() => import("./components/cast&crew/Cast"));
// const Login = lazy(() => import("./components/login/Login"));

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
    fontFamily: ["Raleway", "sans-serif"].join(","),
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavContainer />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: null },
      // { path: "login", element: <Login /> },
      { path: "cast-crew/:movieId", element: <Cast /> },
      { path: "reviews/:movieId", element: <Reviews /> },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
