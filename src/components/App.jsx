import React, { Component } from "react";
import Web3 from "web3";
import axios from "axios";
import FormData from "form-data";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Feed from "./Feed";
import { MspaceConsumer } from "../context/mspaceContext";
import { Outlet } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Sidebar from "./Sidebar";
import Add from "./Add";
import dotenv from "dotenv";
import Rightbar from "./Rightbar";
import Welcome from "./Welcome";
import AccountRegistration from "./AccountRegistration";

// Get the environment variable for JWT
dotenv.config();
const JWT = `Bearer ${process.env.REACT_APP_PINATA_JWT}`;

class App extends Component {
  setTheme = () => {
    this.state.theme === "light"
      ? this.setState({
          theme: "dark",
          modeTheme: createTheme({
            palette: {
              mode: "dark",
            },
          }),
        })
      : this.setState({
          theme: "light",
          modeTheme: createTheme({
            palette: {
              mode: "light",
            },
          }),
        });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      user: "",
      userName: "",
      decentragram: {},
      friendLists: [],
      userLists: [],
      feedPosts: [],
      loading: true,
      error: "",
      theme: "light",
    };
    this.state.modeTheme = createTheme({
      palette: {
        mode: this.state.theme,
      },
    });
  }

  render() {
    return (
      <ThemeProvider theme={this.state.modeTheme}>
        <Box
          bgcolor={"background.default"}
          color={"text.primary"}
          height={"100%"}
        >
          <MspaceConsumer>
            {(props) => {
              const {
                userAddress,
                captureFile,
                createPost,
                connected,
                userAccountDetails,
                appUsers,
              } = props;
              // console.log(props);
              return connected ? (
                <>
                  <Navbar user={userAccountDetails} />
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    justifyContent="space-between"
                  >
                    <Sidebar
                      theme={this.state.theme}
                      setTheme={this.setTheme}
                    ></Sidebar>
                    <Outlet></Outlet>
                    {/* <Feed feedPosts={allAppPosts} /> */}
                    <Rightbar appUsers={appUsers} userAddress={userAddress} />
                    <Add
                      account={userAddress}
                      user={userAccountDetails}
                      captureFile={captureFile}
                      createPost={createPost}
                    ></Add>
                  </Stack>
                </>
              ) : (
                <AccountRegistration />
              );
            }}
          </MspaceConsumer>
          {/* {this.state.account ? (
            <AccountRegistration
              captureFile={this.captureFile}
              createAccount={this.createAccount}
            />
          ) : (
            <Welcome connectWallet={this.connectWallet} />
          )} */}
          {/* <Navbar
            account={this.state.account}
            user={this.state.user}
            userName={this.state.userName}
            connectWallet={this.connectWallet}
            handleLogout={this.handleLogout}
            captureFile={this.captureFile}
            createAccount={this.createAccount}
            error={this.state.error}
          />
          <Stack direction="row" justifyContent="space-between">
            {this.state.userName ? (
              <Sidebar
                theme={this.state.theme}
                setTheme={this.setTheme}
              ></Sidebar>
            ) : (
              ""
            )}
            {this.state.loading ? (
              <Box>
                <Typography variant="h6">Loading</Typography>
              </Box>
            ) : (
              <Feed
                account={this.state.account}
                userName={this.state.userName}
                feedPosts={this.state.feedPosts}
              />
            )} 
            {this.state.userName ? (
              <Rightbar userLists={this.state.userLists}></Rightbar>
            ) : (
              ""
            )}
          </Stack>
          <Add
            account={this.state.account}
            user={this.state.user}
            captureFile={this.captureFile}
            createPost={this.createPost}
            tipImageOwner={this.tipImageOwner}
          ></Add> */}
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
