import { Box, Button, Stack, Typography, styled } from "@mui/material";
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
    };
  }

  updateFiles = (incomingFiles) => {
    console.log("This is from incoming Files", incomingFiles[0].file);
    this.setState({ value: incomingFiles[0] });
  };

  removeFile = () => {
    this.setState({ value: undefined });
  };

  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const { createAccount, captureFile } = props;
          return (
            <>
              <Navbar />
              <Stack
                sx={{
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "black",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "400px" }}>
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const username = this.username.value;
                      const biography = this.biography.value;
                      {
                        console.log(username, biography);
                      }
                      createAccount(username, biography);
                    }}
                  >
                    <Stack
                      direction={"column"}
                      gap={"15px"}
                      alignItems={"center"}
                    >
                      <Typography variant="h6" color={"#46c4e3"}>
                        Please Create an Account
                      </Typography>
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
            </>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default AccountRegistration;
