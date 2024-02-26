import React, { Component } from "react";
import Identicon from "identicon.js";
import {
  Button,
  Fab,
  Modal,
  Tooltip,
  Typography,
  Box,
  styled,
  Avatar,
  Stack,
} from "@mui/material";
import { Add as AddIcon, CloudUpload } from "@mui/icons-material";

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

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    return (
      <>
        <Tooltip
          title="Add Post"
          onClick={this.handleOpen}
          sx={{
            position: "fixed",
            bottom: 20,
            left: { xs: "calc(50% - 25px)", sm: 20 },
          }}
        >
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Tooltip>
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <AddPostContainer>
            {this.props.user.username ? (
              <Box>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const content = this.content.value;
                    this.props.createPost(content);
                  }}
                >
                  <Stack direction={"column"} gap={3}>
                    <Stack direction={"row"} gap={2} onClick={this.handleClick}>
                      <Box>
                        <Avatar
                          sx={{ width: 30, height: 30 }}
                          src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.props.user.profilePictureHash}`}
                        />
                      </Box>
                      <Box>
                        <Typography>{this.props.user.username}</Typography>
                      </Box>
                    </Stack>
                    <input
                      id="content"
                      type="text"
                      ref={(input) => {
                        this.content = input;
                      }}
                      className="form-control"
                      placeholder="What's on your mind?"
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
            ) : (
              <span></span>
            )}
          </AddPostContainer>
        </Modal>
      </>
    );
  }
}

export default Add;
