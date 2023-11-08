import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";

const pages = [
  { id: "home-button", title: "Home", to: "/" },
  { id: "about-button", title: "About", to: "/about" },
  { id: "login-button", title: "Log In", to: "/login" },
];

type NavButtonsProps = {
  // For setting the state of the navigation open/close
  navMenuCloseHandler: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

/**
 * Returns a component that shows the navigation buttons when the screen is large
 * @param {NavButtonsProps} props Props needed for the NavButtons component
 *
 */
const NavButtons = ({ navMenuCloseHandler }: NavButtonsProps) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {pages.map((page) => (
        <Button
          key={page.id}
          onClick={navMenuCloseHandler}
          component={Link}
          to={page.to}
          sx={{ my: 2, color: "secondary.main", display: "block" }}
        >
          {page.title}
        </Button>
      ))}
    </Box>
  );
};

export default NavButtons;
