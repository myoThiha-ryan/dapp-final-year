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
  Alert,
  AlertTitle,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { FileInputButton, FileCard } from "@files-ui/react";

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
      value: "",
      error: "",
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, error: "" });
  };

  updateFiles = (incomingFiles) => {
    console.log("This is from incoming Files", incomingFiles[0].file);
    this.setState({ value: incomingFiles[0] });
  };

  removeFile = () => {
    this.setState({ value: undefined });
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
            <Box>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const postDescritpion = this.postDescritpion.value;
                  const postType = "jpg";
                  if (postDescritpion === "") {
                    this.setState({ error: "Post Description is Required!" });
                  } else {
                    this.props.createPost(postDescritpion, postType);
                  }
                }}
              >
                <Stack direction={"column"} gap={3}>
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
                  <input
                    id="content"
                    type="text"
                    ref={(input) => {
                      this.postDescritpion = input;
                    }}
                    className="form-control"
                    placeholder="What's on your mind?"
                  />
                  {this.state.value ? (
                    <FileCard
                      {...this.state.value}
                      onDelete={this.removeFile}
                      info
                      preview
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <FileInputButton
                      onChange={(files) => {
                        this.updateFiles(files);
                        this.props.captureFile(files);
                      }}
                      accept="image/*"
                      style={{ width: "100%" }}
                    />
                  )}
                  <Button type="submit" variant="contained">
                    Add Post
                  </Button>
                </Stack>
              </form>
            </Box>
          </AddPostContainer>
        </Modal>
        {this.state.error && (
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            open={this.state.error ? true : false}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Alert severity="error" sx={{ width: "400px", height: "100px" }}>
              <AlertTitle>Error</AlertTitle>
              {this.state.error}
            </Alert>
          </Modal>
        )}
        {this.props.success && (
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            open={this.props.success ? true : false}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Alert severity="success" sx={{ width: "400px", height: "100px" }}>
              <AlertTitle>Success</AlertTitle>
              {this.props.success}
            </Alert>
          </Modal>
        )}
      </>
    );
  }
}

export default Add;
