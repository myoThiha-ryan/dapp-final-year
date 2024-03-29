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
} from "@mui/material";

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
  padding: "7px 13px",
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
    };
  }

  handleModalOpen = () => {
    this.setState({ open: true });
  };

  handleModalClose = () => {
    this.setState({ open: false });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    console.log("closed");
  };

  render() {
    return (
      <AppBar position="sticky">
        <StyledToolbar>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            DeSoci
          </Typography>
          <Facebook sx={{ display: { xs: "block", sm: "none" } }} />
          <Search>
            <InputBase fullWidth placeholder="Search..."></InputBase>
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
              <Stack direction={"row"} gap={2} onClick={this.handleClick}>
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
        </StyledToolbar>
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
          <MenuItem onClick={this.props.handleLogout}>Logout</MenuItem>
        </Menu>
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={this.state.open}
          onClose={this.handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <AddPostContainer>
            <Box>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const username = this.username.value;
                  const biography = this.biography.value;
                  const accountAddress = this.props.account;
                  {
                    console.log(username, biography, accountAddress);
                  }
                  this.props.createAccount(username, biography, accountAddress);
                }}
              >
                <Stack direction={"column"} gap={3}>
                  <Typography variant="h6">Please Create an Account</Typography>
                  <input
                    id="username"
                    type="text"
                    ref={(input) => {
                      this.username = input;
                    }}
                    className="form-control"
                    placeholder="Please type username..."
                    required
                  />
                  <input
                    id="biography"
                    type="text"
                    ref={(input) => {
                      this.biography = input;
                    }}
                    className="form-control"
                    placeholder="Please type biography..."
                    required
                  />
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUpload />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      accept=".jpg, .jpeg, .png, .bmp, .gif"
                      onChange={this.props.captureFile}
                    />
                  </Button>
                  <Button type="submit" variant="contained">
                    Add Post
                  </Button>
                </Stack>
              </form>
            </Box>
          </AddPostContainer>
        </Modal>
      </AppBar>
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
