import React, { Component } from "react";
import {
  AccountCircle,
  AddBusiness,
  Article,
  Group,
  Home,
  LightMode,
  ModeNight,
  People,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  PaletteMode,
  Switch,
} from "@mui/material";
import { MspaceConsumer } from "../context/mspaceContext";

class Sidebar extends Component {
  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const { userAccountDetails } = props;
          const currentRoute = window.location.href.slice(21);
          console.log("Current Route: ", currentRoute);
          return (
            <Box p={2} flex={1} sx={{ display: { xs: "none", sm: "block" } }}>
              <Box position="fixed">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      href="/"
                      selected={currentRoute === "/"}
                    >
                      <ListItemIcon>
                        <Home />
                      </ListItemIcon>
                      <ListItemText primary="Homepage" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a" href="#pages">
                      <ListItemIcon>
                        <Article />
                      </ListItemIcon>
                      <ListItemText primary="Pages" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a" href="#groups">
                      <ListItemIcon>
                        <Group />
                      </ListItemIcon>
                      <ListItemText primary="Groups" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a" href="#marketplace">
                      <ListItemIcon>
                        <AddBusiness />
                      </ListItemIcon>
                      <ListItemText primary="Marketplace" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      href="/friends"
                      selected={currentRoute === "/friends"}
                    >
                      <ListItemIcon>
                        <People />
                      </ListItemIcon>
                      <ListItemText primary="Friends" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      href="/settings"
                      selected={currentRoute === "/settings"}
                    >
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      href={`/profile/${userAccountDetails.username}`}
                      selected={currentRoute.slice(0, 8) === "/profile"}
                    >
                      <ListItemIcon>
                        <AccountCircle />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {this.props.theme === "light" ? (
                          <LightMode />
                        ) : (
                          <ModeNight />
                        )}
                      </ListItemIcon>
                      <Switch onClick={this.props.setTheme} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Box>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Sidebar;
