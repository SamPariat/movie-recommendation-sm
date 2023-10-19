import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const NavContainer = () => {
  return (
    <Box
      bgcolor="primary.main"
      flexGrow={1}
      flexDirection="column"
      minHeight="100vh"
    >
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default NavContainer;
