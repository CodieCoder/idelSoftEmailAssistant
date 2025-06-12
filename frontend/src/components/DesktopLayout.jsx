import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { AccountBox } from "@mui/icons-material";

const routes = [
  { path: "/", icon: <EmailIcon />, label: "Emails" },
  { path: "/settings", icon: <AccountBox />, label: "Settings" },
];

const DesktopLayout = ({ sideContent, mainContent }) => {
  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Grid container sx={{ height: "100vh" }} wrap="nowrap">
        <Grid item sx={{ backgroundColor: "#f5f5f5", width: "50px" }}>
          <List>
            {routes.map((route) => (
              <ListItem key={route.path} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{route.icon}</ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            overflowY: "auto",
            height: "100vh",
            backgroundColor: "white",
          }}
        >
          {sideContent}
        </Grid>

        <Grid item xs={7} sx={{ p: 2 }}>
          {mainContent}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DesktopLayout;
