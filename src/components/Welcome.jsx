import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import { TypeAnimation } from "react-type-animation";
import Logo from "../assets/logo.png";
import { MspaceConsumer } from "../context/mspaceContext";
import AccountRegistration from "./AccountRegistration";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreationPage: false,
    };
  }

  render() {
    return (
      <>
        {this.state.openCreationPage ? (
          <AccountRegistration />
        ) : (
          <Stack
            sx={{
              width: "100%",
              height: "100vh",
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "25px",
                }}
              >
                <Typography
                  fontFamily={"monospace"}
                  variant="h5"
                  color={"#46c4e3"}
                >
                  Welcome to our decentralized social media platform, where your
                  voice truly matters. Say goodbye to centralized control and
                  hello to a community-driven space.
                </Typography>
                <TypeAnimation
                  sequence={[
                    "Welcome to MSpace", // Types 'One'
                    2000, // Waits 1s
                    "Decentralised Social Experiece",
                    2000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  style={{
                    fontSize: "2em",
                    display: "inline-block",
                    color: "white",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={Logo}
                  alt=""
                  style={{ width: "300px", height: "300px" }}
                />
              </Box>
            </Stack>
            <Button
              variant="contained"
              sx={{ width: "150px", height: "60px", borderRadius: "0px" }}
              onClick={() => {
                this.setState({ openCreationPage: true });
              }}
            >
              Get Started
            </Button>
          </Stack>
        )}
      </>
    );
  }
}

export default Welcome;
