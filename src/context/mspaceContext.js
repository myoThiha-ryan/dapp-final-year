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
      totalBalance: 0,
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
      success: "",
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
    // Load balance
    const weiBalance = await window.web3.eth.getBalance(account);
    const ethBalance = window.web3.utils.fromWei(weiBalance);

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
      //Sort Posts According To Likes and Tip Amount
      _parsedAllPosts.sort(
        (a, b) => b.tipAmount - a.tipAmount || b.likes - a.likes
      );
      //GET TOTAL Number Of USER
      const getUserCount = await decentragram.methods.getUserCount().call();

      if (account) {
        //GET CURRENT USER POST
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

        //Get All Current User LikedPosts
        const getAllLikedPostIds = await decentragram.methods
          .getLikedPostIDs(account)
          .call();
        const _getAllLikedPostIds = getAllLikedPostIds.map((id) =>
          id.toNumber()
        );

        //Get All Current User DisLikedPosts
        const getAllDislikedPostIds = await decentragram.methods
          .getDislikedPostIDs(account)
          .call();
        const _getAllDislikedPostIds = getAllDislikedPostIds.map((id) =>
          id.toNumber()
        );
        //GET CURRENT USER DETAILS
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

        //GET CURRENT USER FOLLOWERS
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

        //GET CURRENT USER FOLLOWING
        const getFollowing = await decentragram.methods
          .getFollowing(account)
          .call();
        const followings = await Promise.all(
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
          connected: isAccountCreated,
          appUsers: _parsedAppUsers,
          allAppPosts: _parsedAllPosts,
          totalUser: getUserCount.toNumber(),
          totalBalance: ethBalance,
          currentUserPosts: _parsedCurrentUserPosts,
          likedPostIds: _getAllLikedPostIds,
          dislikedPostIds: _getAllDislikedPostIds,
          userAccountDetails: _parsedData,
          userFollowers: followers,
          userFollowings: followings,
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
      name: this.state.file.name,
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
      const componentObject = this;
      await this.state.decentragram.methods
        .createAccount(username, biography, profilePictureURL)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Created Account" });
        });
    } catch (error) {
      alert("Error while creating your account. Please reload your browser.");
    }
  };

  editProfile = async (address, username, biography) => {
    if (!this.state.file) {
      const profilePictureURL = "";
      await this.state.decentragram.methods
        .editProfile(address, username, biography, profilePictureURL)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          alert("Successfully Edited Profile");
        });
    } else {
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
      const componentObject = this;
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
          .editProfile(address, username, biography, profilePictureURL)
          .send({ from: this.state.userAddress })
          .on("transactionHash", async function() {
            componentObject.setState({
              success: "Successfully Edited Profile",
            });
          });
      } catch (error) {
        alert("Error while editing your profile. Please reload your browser.");
      }
    }
  };

  createPost = async (postDescription, postType) => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    const pinataMetadata = JSON.stringify({
      name: this.state.file.name,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    const componentObject = this;
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
          componentObject.setState({ success: "Successfully Created Post" });
        });
    } catch (error) {
      alert("Error while creating a post. Please reload your browser.");
    }
  };

  likePost = async (postId) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .likePost(postId)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Liked Post" });
        });
    } catch (error) {
      alert("Error while liking a post. Please reload your browser.");
    }
  };

  unlikePost = async (postId) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .unlikePost(postId)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Unliked Post" });
        });
    } catch (error) {
      alert(
        "Error while removing like from the post. Please reload your browser."
      );
    }
  };

  dislikePost = async (postId) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .dislikePost(postId)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Disliked Post" });
        });
    } catch (error) {
      alert(
        "Error while giving dislike to the post. Please reload your browser."
      );
    }
  };

  undislikePost = async (postId) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .undislikePost(postId)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Undisliked Post" });
        });
    } catch (error) {
      alert(
        "Error while removing dislike from the post. Please reload your browser."
      );
    }
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
    if (tipAmount > this.state.totalBalance) {
      alert("Current Amount Is Not Enough To Tip!");
      return;
    }
    const componentObject = this;
    try {
      this.state.decentragram.methods
        .tipPost(postId)
        .send({ from: this.state.userAddress, value: tipAmount })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Tipped Post" });
        });
    } catch (error) {
      alert("Error while tipping the post. Please reload your browser.");
    }
  };

  followUser = async (address) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .follow(address)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Followed" });
        });
    } catch (error) {
      alert("Error while following the user. Please reload your browser.");
    }
  };

  unFollowUser = async (address) => {
    const componentObject = this;
    try {
      await this.state.decentragram.methods
        .unfollow(address)
        .send({ from: this.state.userAddress })
        .on("transactionHash", async function() {
          componentObject.setState({ success: "Successfully Unfollowed" });
        });
    } catch (error) {
      alert("Error while unfollowing the user. Please reload your browser.");
    }
  };

  componentDidMount() {
    this.loadWeb3();
    this.loadBlockchainData();
  }

  render() {
    const {
      decentragram,
      userAddress,
      totalUser,
      totalBalance,
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
      success,
    } = this.state;

    const {
      loadWeb3,
      loadBlockchainData,
      createAccount,
      editProfile,
      createPost,
      likePost,
      unlikePost,
      dislikePost,
      undislikePost,
      tipPost,
      handleLogout,
      captureFile,
      followUser,
      unFollowUser,
    } = this;
    return (
      <MspaceContext.Provider
        value={{
          decentragram,
          userAddress,
          totalUser,
          totalBalance,
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
          success,
          loadWeb3,
          loadBlockchainData,
          createAccount,
          editProfile,
          createPost,
          likePost,
          unlikePost,
          dislikePost,
          undislikePost,
          tipPost,
          handleLogout,
          captureFile,
          followUser,
          unFollowUser,
        }}
      >
        {this.props.children}
      </MspaceContext.Provider>
    );
  }
}

export default MspaceContext;
