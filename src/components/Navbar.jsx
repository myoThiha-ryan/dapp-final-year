import React, { Component } from "react";
import Identicon from "identicon.js";
import {
  Facebook,
  Mail,
  Notifications,
  CloudUpload,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Modal,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
  Stack,
  Autocomplete,
  TextField,
} from "@mui/material";
import { MspaceConsumer } from "../context/mspaceContext";

const AddPostContainer = styled("div")(({ theme }) => ({
  width: "450px",
  height: "450px",
  padding: "20px",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StyledToolbar = styled(Toolbar)({
  backgroundColor: "#28464B",
  padding: "7px 0px",
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  width: "40%",
}));

const IconsContainer = styled(Box)(({ theme }) => ({
  display: "none",
  gap: 20,
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 10,
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
      searchValue: "",
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    console.log("closed");
  };

  handleInputChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleChange = (value) => {
    this.setState({ searchValue: value });
    console.log(value);
  };

  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const { appUsers, userAddress, connected } = props;
          return (
            <AppBar position="sticky">
              <StyledToolbar>
                <Typography
                  variant="h6"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  MSpace
                </Typography>
                <Facebook sx={{ display: { xs: "block", sm: "none" } }} />
                {connected ? (
                  <>
                    <Search>
                      <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        options={appUsers.map((user) => user.username)}
                        onInputChange={(event) => {
                          this.handleInputChange(event);
                        }}
                        onChange={(event, value) => {
                          this.handleChange(value);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            window.location.href = `/profile/${this.state.searchValue}`;
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Search..." />
                        )}
                        fullWidth
                      />
                    </Search>
                    <IconsContainer>
                      <Box sx={{ ":hover": { cursor: "pointer" } }}>
                        <Badge badgeContent={4} color="error">
                          <Mail sx={{ color: "white" }} />
                        </Badge>
                      </Box>
                      <Box sx={{ ":hover": { cursor: "pointer" } }}>
                        <Badge badgeContent={2} color="error">
                          <Notifications />
                        </Badge>
                      </Box>
                      <Box>
                        <Stack
                          direction={"row"}
                          gap={2}
                          onClick={this.handleClick}
                        >
                          <Box>
                            <Avatar
                              sx={{ width: 30, height: 30 }}
                              src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.props.user.profilePictureURL}`}
                            />
                          </Box>
                          <Box>
                            <Typography>{this.props.user.username}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </IconsContainer>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      open={Boolean(this.state.anchorEl)}
                      anchorEl={this.state.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem>Profile</MenuItem>
                      <MenuItem>My account</MenuItem>
                      <MenuItem onClick={this.props.handleLogout}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Box>
                      <img
                        className="ml-2"
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(
                          userAddress,
                          30
                        ).toString()}`}
                      />
                      {userAddress}
                    </Box>
                  </>
                )}
              </StyledToolbar>
            </AppBar>
          );
        }}
      </MspaceConsumer>
      /*<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={photo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          Decentragram
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account} </small>
            </small>
            {this.props.account ? (
              <img
                className="ml-2"
                width="30"
                height="30"
                src={`data:image/png;base64,${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
              />
            ) : (
              <span></span>
            )}
          </li>
        </ul>
      </nav>*/
    );
  }
}

export default Navbar;
