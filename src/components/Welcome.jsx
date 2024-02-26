import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import { TypeAnimation } from "react-type-animation";
import MetaMask from "../metaMask.png";

class Welcome extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Stack
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: "black",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "40%",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            pt: "30px",
          }}
        >
          <Typography fontFamily={"monospace"} variant="h5" color={"#46c4e3"}>
            Welcome to our decentralized social media platform, where your voice
            truly matters. Say goodbye to centralized control and hello to a
            community-driven space.
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
            style={{ fontSize: "2em", display: "inline-block", color: "white" }}
          />
        </Box>
        <Box
          sx={{
            width: "40%",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={MetaMask}
            alt=""
            style={{ width: "400px", height: "400px" }}
          />
          <Button
            variant="contained"
            sx={{ width: "200px" }}
            onClick={this.props.connectWallet}
          >
            Connect Wallet
          </Button>
        </Box>
      </Stack>
    );
  }
}

export default Welcome;
