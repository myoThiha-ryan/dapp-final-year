import Web3 from "web3";
import Decentragram from "../abis/Decentragram.json";

export const loadWeb3 = async () => {
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

export const loadBlockchainData = async () => {
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
    const user = await decentragram.methods.getUser(this.state.account).call();
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

export const connectWallet = async () => {
  await this.loadWeb3();
  await this.loadBlockchainData();
};

export const convertTime = (time) => {
  const newTime = new Date(time * 1000);
  const realTime =
    newTime.getHours() +
    ":" +
    newTime.getMinutes() +
    ":" +
    newTime.getSeconds() +
    " Date:" +
    newTime.getDate() +
    "/" +
    (newTime.getMonth() + 1) +
    "/" +
    newTime.getFullYear();

  return realTime;
};
