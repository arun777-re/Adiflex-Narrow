import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import {useDispatch,useSelector} from 'react-redux';

const Navbar = ({ handleDrawerToggle }) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  return (
    <AppBar
      position="fixed"
      elevation={1}
      color="inherit"
      sx={{
        width: {
          md: `calc(100% - 260px)`,
        },
        ml: {
          md: "260px",
        },
        borderBottom: "1px solid #e5e7eb",
        bgcolor: "#fff",
      }}
    >
      <Toolbar>
        {/* Mobile Menu */}

        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: {
              md: "none",
            },
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* ERP Title */}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            flexGrow: 1,
          }}
        >
          Manufacturing ERP
        </Typography>

        {/* Notification */}

        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>

        {/* User */}

        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          ml={2}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={14}
            >
              {user?.user?.name || "Admin"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {user?.user?.role || "admin"}
            </Typography>
          </Box>

          <Avatar>
            {(user?.user?.name || "A")
              .charAt(0)
              .toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;