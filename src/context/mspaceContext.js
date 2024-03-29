import React, { Component } from "react";
import Web3 from "web3";
import Decentragram from "../abis/Decentragram.json";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

// Get the environment variable for JWT
dotenv.config();
const JWT = `Bearer ${process.env.REACT_APP_PINATA_JWT}`;
const MspaceContext = React.createContext();
export const MspaceConsumer = MspaceContext.Consumer;

export class MspaceProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: "",
      totalUser: 0,
      appUsers: [],
      currentUserPosts: [],
      likedPostIds: [],
      dislikedPostIds: [],
      allAppPosts: [],
      userAccountDetails: {},
      userFollowers: [],
      userFollowings: [],
      connected: false,
      decentragram: {},
      loading: false,
      error: "",
    };
  }

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
    const account = accounts[0];
    // Get Network ID
    const networkId = await web3.eth.net.getId();
    const decentragramData = Decentragram.networks[networkId];
    // Get Contract
    if (decentragramData) {
      const decentragram = new web3.eth.Contract(
        Decentragram.abi,
        decentragramData.address
      );
      this.setState({ userAddress: account, decentragram });
      //GET ALL USER ADDRESS
      let isAccountCreated = false;
      const getAddresses = await decentragram.methods.getAddresses().call();
      for (let i = 0; i < getAddresses.length; i++) {
        if (getAddresses[i].toLowerCase() === account.toLowerCase()) {
          isAccountCreated = true;
        }
      }
      //GET ALL USER
      const getAllAppUser = await decentragram.methods.getAllAppUser().call();

      const _parsedAppUsers = getAllAppUser.map((appUser) => ({
        owner: appUser.owner,
        username: appUser.username,
        biography: appUser.biography,
        profilePictureURL: appUser.profilePictureURL,
        timeCreated: appUser.timeCreated.toNumber(),
        userID: appUser.id.toNumber(),
        postCount: appUser.postCount.toNumber(),
        followerCount: appUser.followerCount.toNumber(),
        followingCount: appUser.followingCount.toNumber(),
      }));

      //GET APP POST
      const getAllPosts = await decentragram.methods.getAllPosts().call();
      const _parsedAllPosts = getAllPosts.map((post) => ({
        postID: post.postId.toNumber(),
        author: post.author,
        username: post.username,
        profilePictureURL: post.profilePictureURL,
        postType: post.postType,
        postURL: post.postURL,
        postDescription: post.postDescription,
        timeCreated: post.timeCreated.toNumber(),
        tipAmount: post.tipAmount,
        likes: post.likes.toNumber(),
        dislikes: post.dislikes.toNumber(),
      }));

      //GET TOTAL Number Of USER
      const getUserCount = await decentragram.methods.getUserCount().call();

      if (account) {
        //GET USER POST
        const getPosts = await decentragram.methods.getPosts(account).call();

        const _parsedCurrentUserPosts = getPosts.map((post) => ({
          postID: post.postId.toNumber(),
          author: post.author,
          username: post.username,
          profilePictureURL: post.profilePictureURL,
          postType: post.postType,
          postURL: post.postURL,
          postDescription: post.postDescription,
          timeCreated: post.timeCreated.toNumber(),
          tipAmount: post.tipAmount,
          likes: post.likes.toNumber(),
          dislikes: post.dislikes.toNumber(),
        }));

        //Get All LikedPosts
        const getAllLikedPostIds = await decentragram.methods
          .getLikedPostIDs(account)
          .call();
        const _getAllLikedPostIds = getAllLikedPostIds.map((id) =>
          id.toNumber()
        );

        //Get All LikedPosts
        const getAllDislikedPostIds = await decentragram.methods
          .getDislikedPostIDs(account)
          .call();
        const _getAllDislikedPostIds = getAllDislikedPostIds.map((id) =>
          id.toNumber()
        );
        //GET USER DETAILS
        const userDetails = await decentragram.methods.profiles(account).call();
        const _parsedData = {
          owner: userDetails.owner,
          username: userDetails.username,
          biography: userDetails.biography,
          profilePictureURL: userDetails.profilePictureURL,
          timeCreated: userDetails.timeCreated.toNumber(),
          userID: userDetails.id.toNumber(),
          postCount: userDetails.postCount.toNumber(),
          followerCount: userDetails.followerCount.toNumber(),
          followingCount: userDetails.followingCount.toNumber(),
        };

        //GET USER FOLLOWERS
        const getFollowers = await decentragram.methods
          .getFollowers(account)
          .call();
        const followers = await Promise.all(
          getFollowers.map(async (address) => {
            const singleFollower = await decentragram.methods
              .profiles(address)
              .call();
            return {
              owner: singleFollower.owner,
              username: singleFollower.username,
              biography: singleFollower.biography,
              profilePictureURL: singleFollower.profilePictureURL,
              timeCreated: singleFollower.timeCreated.toNumber(),
              userID: singleFollower.id.toNumber(),
              postCount: singleFollower.postCount.toNumber(),
              followerCount: singleFollower.followerCount.toNumber(),
              followingCount: singleFollower.followingCount.toNumber(),
            };
          })
        );

        //GET USER FOLLOWING
        const getFollowing = await decentragram.methods
          .getFollowing(account)
          .call();
        const followerings = await Promise.all(
          getFollowing.map(async (address) => {
            const singleFollowing = await decentragram.methods
              .profiles(address)
              .call();
            return {
              owner: singleFollowing.owner,
              username: singleFollowing.username,
              biography: singleFollowing.biography,
              profilePictureURL: singleFollowing.profilePictureURL,
              timeCreated: singleFollowing.timeCreated.toNumber(),
              userID: singleFollowing.id.toNumber(),
              postCount: singleFollowing.postCount.toNumber(),
              followerCount: singleFollowing.followerCount.toNumber(),
              followingCount: singleFollowing.followingCount.toNumber(),
            };
          })
        );

        this.setState({
          userAddress: account,
          decentragram,
          connected: isAccountCreated,
          appUsers: _parsedAppUsers,
          allAppPosts: _parsedAllPosts,
          totalUser: getUserCount.toNumber(),
          currentUserPosts: _parsedCurrentUserPosts,
          likedPostIds: _getAllLikedPostIds,
          dislikedPostIds: _getAllDislikedPostIds,
          userAccountDetails: _parsedData,
          userFollowers: followers,
          userFollowings: followerings,
        });
      }
    } else {
      window.alert("Decentragram contract not deployed to detected network.");
    }
  };

  // connectWallet = async () => {
  //   await this.loadWeb3();
  //   await this.loadBlockchainData();
  // };

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
      const profilePictureURL = res.data.IpfsHash;
      await this.state.decentragram.methods
        .createAccount(username, biography, profilePictureURL)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          alert("Successfully Created Account");
        });
      // if (transaction && !transaction.hasOwnProperty("transactionHash")) {
      //   this.setState({ connected: "Login Account" });
      //   this.setState({ loading: true });
      //   window.location.reload();
      // }
      // this.setState({ loading: true });
      // await getCreatedUser.wait();
      // this.setState({ loading: false });
      // window.location.reload();
    } catch (error) {
      this.setState({
        error: "Error while creating your account. Please reload your browser.",
      });
    }
  };

  createPost = async (postDescription, postType) => {
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
      const postURL = res.data.IpfsHash;
      await this.state.decentragram.methods
        .createPost(postDescription, postURL, postType)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          alert("Successfully Created Post");
        });
    } catch (error) {
      this.setState({
        error: "Error while creating a post. Please reload your browser.",
      });
    }
  };

  likePost = async (postId) => {
    await this.state.decentragram.methods
      .likePost(postId)
      .send({ from: this.state.userAddress })
      .on("transactionHash", async function() {
        alert("Successfully Liked Post");
      });
  };

  unlikePost = async (postId) => {
    await this.state.decentragram.methods
      .unlikePost(postId)
      .send({ from: this.state.userAddress })
      .on("transactionHash", async function() {
        alert("Successfully Unliked Post");
      });
  };

  dislikePost = async (postId) => {
    await this.state.decentragram.methods
      .dislikePost(postId)
      .send({ from: this.state.userAddress })
      .on("transactionHash", async function() {
        alert("Successfully Disliked Post");
      });
  };

  undislikePost = async (postId) => {
    await this.state.decentragram.methods
      .undislikePost(postId)
      .send({ from: this.state.userAddress })
      .on("transactionHash", async function() {
        alert("Successfully Undisliked Post");
      });
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

  tipPost = (postId, tipAmount) => {
    this.state.decentragram.methods
      .tipPost(postId)
      .send({ from: this.state.userAddress, value: tipAmount })
      .on("transactionHash", async function() {
        alert("Successfully Tipped Post");
      });
  };

  componentDidMount() {
    this.loadWeb3();
    this.loadBlockchainData();
  }

  render() {
    const {
      userAddress,
      totalUser,
      appUsers,
      currentUserPosts,
      likedPostIds,
      dislikedPostIds,
      allAppPosts,
      userAccountDetails,
      userFollowers,
      userFollowings,
      connected,
      loading,
      error,
    } = this.state;

    const {
      loadWeb3,
      loadBlockchainData,
      createAccount,
      createPost,
      likePost,
      unlikePost,
      dislikePost,
      undislikePost,
      tipPost,
      handleLogout,
      captureFile,
    } = this;
    return (
      <MspaceContext.Provider
        value={{
          userAddress,
          totalUser,
          appUsers,
          currentUserPosts,
          likedPostIds,
          dislikedPostIds,
          allAppPosts,
          userAccountDetails,
          userFollowers,
          userFollowings,
          connected,
          loading,
          error,
          loadWeb3,
          loadBlockchainData,
          createAccount,
          createPost,
          likePost,
          unlikePost,
          dislikePost,
          undislikePost,
          tipPost,
          handleLogout,
          captureFile,
        }}
      >
        {this.props.children}
      </MspaceContext.Provider>
    );
  }
}

export default MspaceContext;
