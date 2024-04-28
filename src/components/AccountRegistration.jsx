import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import logo from "../assets/logo.png";
import { MspaceConsumer } from "../context/mspaceContext";
import React, { Component } from "react";
import { FileInputButton, FileCard } from "@files-ui/react";
import Navbar from "./Navbar";

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

class AccountRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      open: false,
      error: "",
    };
  }

  updateFiles = (incomingFiles) => {
    console.log("This is from incoming Files", incomingFiles[0].file);
    this.setState({ value: incomingFiles[0] });
  };

  removeFile = () => {
    this.setState({ value: undefined });
  };

  handleClose = () => {
    this.setState({ open: false, error: "" });
  };

  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const { createAccount, captureFile, success } = props;
          return (
            <>
              <Navbar />
              <Stack
                sx={{
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "black",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "400px", mt: "200px" }}>
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const username = this.username.value;
                      const biography = this.biography.value;
                      if (username === "") {
                        this.setState({ error: "Username is required" });
                      } else {
                        createAccount(username, biography);
                      }
                    }}
                  >
                    <Stack
                      direction={"column"}
                      gap={"20px"}
                      alignItems={"center"}
                    >
                      <Typography variant="h6" color={"white"}>
                        Create an Account
                      </Typography>
                      <input
                        id="username"
                        type="text"
                        ref={(input) => {
                          this.username = input;
                        }}
                        className="form-control"
                        placeholder="Enter username..."
                      />
                      <input
                        id="biography"
                        type="text"
                        ref={(input) => {
                          this.biography = input;
                        }}
                        className="form-control"
                        placeholder="Enter biography..."
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
                            captureFile(files);
                          }}
                          accept="image/*"
                          style={{ width: "100%" }}
                        />
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ width: "100%" }}
                      >
                        Create
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </Stack>
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
                  <Alert
                    severity="error"
                    sx={{ width: "400px", height: "100px" }}
                  >
                    <AlertTitle>Error</AlertTitle>
                    {this.state.error}
                  </Alert>
                </Modal>
              )}
              {success && (
                <Modal
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  open={success ? true : false}
                  onClose={this.handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Alert
                    severity="success"
                    sx={{ width: "400px", height: "100px" }}
                  >
                    <AlertTitle>Success</AlertTitle>
                    {success}
                  </Alert>
                </Modal>
              )}
            </>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default AccountRegistration;
