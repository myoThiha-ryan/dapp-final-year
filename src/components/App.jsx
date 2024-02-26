import React, { Component } from "react";
import Web3 from "web3";
import axios from "axios";
import FormData from "form-data";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Feed from "./Feed";
import {
  Box,
  Button,
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
  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected, You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // Get Network ID
    const networkId = await web3.eth.net.getId();
    const decentragramData = Decentragram.networks[networkId];
    // Get Contract
    if (decentragramData) {
      const decentragram = new web3.eth.Contract(
        Decentragram.abi,
        decentragramData.address
      );
      this.setState({ decentragram });
      // Get Username
      const userName = await decentragram.methods
        .getUsername(this.state.account)
        .call();
      this.setState({ userName });
      // Get User
      const user = await decentragram.methods
        .getUser(this.state.account)
        .call();
      this.setState({ user });
      // Get Friend Lists
      const friendLists = await decentragram.methods.getMyFriendList().call();
      this.setState({ friendLists });
      // Get All App User Lists
      const userLists = await decentragram.methods.getAllAppUser().call();
      this.setState({ userLists });
      // Get All App Feed Posts
      const feedPosts = await decentragram.methods.getAllFeedPosts().call();
      this.setState({ feedPosts });
      this.setState({ loading: false });
    } else {
      window.alert("Decentragram contract not deployed to detected network.");
    }
  };

  createAccount = async (username, biography) => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    const pinataMetadata = JSON.stringify({
      name: "Image1",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      const profileImgHash = res.data.IpfsHash;
      const getCreatedUser = await this.state.decentragram.methods
        .createAccount(username, biography, profileImgHash)
        .send({ from: this.state.account });
      this.setState({ loading: true });
      await getCreatedUser.wait();
      this.setState({ loading: false });
      window.location.href = "/";
    } catch (error) {
      this.setState({
        error: "Error while creating your account. Please reload your browser.",
      });
    }
  };

  createPost = async (content) => {
    console.log("Submitting file to IPFS....");
    const formData = new FormData();
    formData.append("file", this.state.file);
    const pinataMetadata = JSON.stringify({
      name: "image",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      const imageHash = res.data.IpfsHash;
      this.setState({ loading: true });
      this.state.decentragram.methods
        .createPost(content, imageHash)
        .send({ from: this.state.account });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        error: "Error while creating a post. Please reload your browser.",
      });
    }
  };

  connectWallet = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };

  handleLogout = () => {
    this.setState({ account: "" });
  };

  captureFile = (incommingFiles) => {
    const file = incommingFiles[0].file;
    console.log("This is from capture Files: ", file);
    this.setState({ file });
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("Buffer: ", this.state.buffer);
    };
  };

  uploadImage = async (description) => {
    console.log("Submitting file to IPFS....");
    const formData = new FormData();
    formData.append("file", this.state.file);
    const pinataMetadata = JSON.stringify({
      name: "Image1",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      const imageHash = res.data.IpfsHash;
      this.setState({ loading: true });
      this.state.decentragram.methods
        .uploadImage(imageHash, description)
        .send({ from: this.state.account });
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true });
    this.state.decentragram.methods
      .tipImageOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

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
    console.log(this.state.account);
    return (
      <ThemeProvider theme={this.state.modeTheme}>
        <Box
          bgcolor={"background.default"}
          color={"text.primary"}
          height={"100%"}
        >
          {this.state.account ? (
            <AccountRegistration captureFile={this.captureFile} />
          ) : (
            <Welcome connectWallet={this.connectWallet} />
          )}

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
