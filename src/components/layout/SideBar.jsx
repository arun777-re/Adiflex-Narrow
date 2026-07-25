import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  menuConfig,
} from "../../config/menuConfig";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  logout,
} from "../../redux/slices/authSlices";


const Sidebar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}) => {


  const dispatch =
    useDispatch();


  const navigate =
    useNavigate();


  // AUTH USER
  const {
    user,
  } =
    useSelector(
      (state) =>
        state.auth
    );


  // ACTUAL LOGGED-IN USER

  const loggedInUser =
    user?.user;


  const role =
    loggedInUser?.role;


  const division =
    loggedInUser?.division;


  // ==========================================
  // ROLE BASED MENUS
  // ==========================================

  const menus =
    menuConfig[role] || [];


  console.log(
    "Sidebar User:",
    loggedInUser
  );


  console.log(
    "Sidebar Role:",
    role
  );


  console.log(
    "Sidebar Division:",
    division
  );


  console.log(
    "Sidebar Menus:",
    menus
  );


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout =
    () => {

      dispatch(
        logout()
      );


      navigate(
        "/"
      );

    };


  // ==========================================
  // DRAWER CONTENT
  // ==========================================

  const drawer = (

    <>

      {/* HEADER */}

      <Toolbar

        sx={{

          justifyContent:
            "center",

          alignItems:
            "center",

          minHeight:
            70,

        }}

      >

        <Typography

          variant="h6"

          fontWeight={700}

          color="primary"

        >

          ERP SYSTEM

        </Typography>

      </Toolbar>


      <Divider />


      {/* MENUS */}

      <List

        sx={{

          px: 1,

          mt: 1,

        }}

      >

        {menus.map(

          (item) => (

            <ListItemButton

              key={
                item.id
              }

              component={
                NavLink
              }

              to={
                item.path
              }

              onClick={
                handleDrawerToggle
              }

              sx={{

                borderRadius:
                  2,

                mb:
                  0.5,


                "&.active": {

                  bgcolor:
                    "primary.main",

                  color:
                    "#fff",


                  "& .MuiListItemIcon-root":
                    {

                      color:
                        "#fff",

                    },

                },

              }}

            >

              <ListItemIcon>

                {
                  item.icon
                }

              </ListItemIcon>


              <ListItemText

                primary={
                  item.title
                }

              />

            </ListItemButton>

          )

        )}

      </List>


      {/* USER SECTION */}

      <Box

        sx={{

          mt:
            "auto",

          p:
            2,

        }}

      >

        <Divider

          sx={{

            mb:
              2,

          }}

        />


        {/* USER NAME */}

        <Typography

          variant="subtitle2"

          fontWeight={600}

        >

          {
            loggedInUser?.name ||
            "User"
          }

        </Typography>


        {/* ROLE */}

        <Typography

          variant="body2"

          color="text.secondary"

          sx={{

            textTransform:
              "capitalize",

          }}

        >

          Role:{" "}

          {
            role ||
            "Unknown"
          }

        </Typography>


        {/* DIVISION */}

        <Typography

          variant="body2"

          color="text.secondary"

          sx={{

            textTransform:
              "capitalize",

            mb:
              2,

          }}

        >

          Division:{" "}

          {
            division ||
            "Unknown"
          }

        </Typography>


        {/* LOGOUT */}

        <ListItemButton

          onClick={
            handleLogout
          }

          sx={{

            borderRadius:
              2,

            color:
              "error.main",


            "&:hover": {

              bgcolor:
                "error.lighter",

            },

          }}

        >

          <ListItemIcon

            sx={{

              color:
                "error.main",

            }}

          >

            <LogoutRoundedIcon />

          </ListItemIcon>


          <ListItemText

            primary={
              "Logout"
            }

          />

        </ListItemButton>

      </Box>

    </>

  );


  return (

    <Box

      component="nav"

      sx={{

        width: {

          md:
            drawerWidth,

        },

        flexShrink: {

          md:
            0,

        },

      }}

    >

      {/* MOBILE DRAWER */}

      <Drawer

        variant="temporary"

        open={
          mobileOpen
        }

        onClose={
          handleDrawerToggle
        }

        ModalProps={{

          keepMounted:
            true,

        }}

        sx={{

          display: {

            xs:
              "block",

            md:
              "none",

          },


          "& .MuiDrawer-paper":
            {

              width:
                drawerWidth,

              boxSizing:
                "border-box",

            },

        }}

      >

        {
          drawer
        }

      </Drawer>


      {/* DESKTOP DRAWER */}

      <Drawer

        variant="permanent"

        open

        sx={{

          display: {

            xs:
              "none",

            md:
              "block",

          },


          "& .MuiDrawer-paper":
            {

              width:
                drawerWidth,

              boxSizing:
                "border-box",

              display:
                "flex",

              flexDirection:
                "column",

            },

        }}

      >

        {
          drawer
        }

      </Drawer>

    </Box>

  );

};


export default Sidebar;