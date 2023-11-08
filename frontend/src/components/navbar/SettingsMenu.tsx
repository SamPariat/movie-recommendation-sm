import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const settings = ["Profile", "Account", "Logout"];

type SettingsMenuProps = {
  // For the anchor element
  userAnchor: HTMLElement | null;
  // For setting the userAnchor's state
  setUserAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

/**
 *
 * Returns a SettingsMenu that displays when the Avatar is clicked
 * @param {SettingsMenuProps} props Props needed for the SettingsMenu component
 * 
 */
const SettingsMenu = ({ userAnchor, setUserAnchor }: SettingsMenuProps) => {
  const handleCloseUserMenu = () => {
    setUserAnchor(null);
  };

  return (
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={userAnchor}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(userAnchor)}
      onClose={handleCloseUserMenu}
    >
      {settings.map((setting) => (
        <MenuItem key={setting} onClick={handleCloseUserMenu}>
          <Typography fontWeight={700} color="secondary" textAlign="center">
            {setting}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default SettingsMenu;
