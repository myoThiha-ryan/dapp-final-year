import React, { Component } from "react";
import { MspaceConsumer } from "../context/mspaceContext";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Paper,
  styled,
  Stack,
  Typography,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { FileInputButton, FileCard } from "@files-ui/react";
import { convertDate } from "../utils/apiFeature";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export class Setting extends Component {
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
          const { userAccountDetails, captureFile } = props;
          return (
            <Stack p={4} flex={6} sx={{ display: { xs: "none", sm: "block" } }}>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const username = this.username.value;
                  const biography = this.biography.value;
                  {
                    console.log(username, biography);
                  }
                  // createAccount(username, biography);
                }}
              >
                <Stack gap={4}>
                  <Typography variant="h6">Edit Profile</Typography>
                  <Stack direction={"row"} alignItems={"center"} gap={3}>
                    <Avatar
                      alt={userAccountDetails.username}
                      src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${userAccountDetails.profilePictureURL}`}
                      sx={{ width: "100px", height: "100px" }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {userAccountDetails.username}
                      </Typography>
                      <Typography variant="body1">
                        Joined Since -{" "}
                        {convertDate(userAccountDetails.timeCreated)}
                      </Typography>
                    </Box>
                    {this.state.value ? (
                      <FileCard
                        {...this.state.value}
                        onDelete={this.removeFile}
                        info
                        preview
                        style={{ width: "200px" }}
                      />
                    ) : (
                      <FileInputButton
                        onChange={(files) => {
                          this.updateFiles(files);
                          captureFile(files);
                        }}
                        accept="image/*"
                        style={{ width: "100px" }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2">Username</Typography>
                  <Textarea
                    aria-label="minimum height"
                    minRows={3}
                    value={userAccountDetails.username}
                  />
                  <Typography variant="body2">Biography</Typography>
                  <Textarea
                    aria-label="minimum height"
                    minRows={3}
                    value={userAccountDetails.biography}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ width: "100px" }}
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            </Stack>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Setting;
