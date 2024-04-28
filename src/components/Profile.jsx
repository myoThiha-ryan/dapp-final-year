import {
  Avatar,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Stack,
  Divider,
  Typography,
  Modal,
  Button,
  styled,
  Card,
  CardHeader,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { Component } from "react";
import { MspaceConsumer } from "../context/mspaceContext";
import { convertDate } from "../utils/apiFeature";
import withRouter from "./withRouter";
import { convertTime } from "../utils/apiFeature";

const ModalContainer = styled("div")(({ theme }) => ({
  width: "450px",
  height: "450px",
  padding: "20px",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
}));

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFollowersModal: false,
      openFollowingModal: false,
      openPostModal: false,
      profilePictureURL: "",
      username: "",
      timeCreated: "",
      postURL: "",
      postDescription: "",
      tipAmount: "",
      likes: "",
      dislikes: "",
    };
  }

  handleOpenFollowerModal = () => {
    this.setState({ openFollowersModal: true });
    this.setState({ openFollowingModal: false });
  };

  handleCloseFollowerModal = () => {
    this.setState({ openFollowersModal: false });
  };

  handleOpenFollowingModal = () => {
    this.setState({ openFollowingModal: true });
    this.setState({ openFollowersModal: false });
  };

  handleCloseFollowingModal = () => {
    this.setState({ openFollowingModal: false });
  };

  handleOpenPostModal = (post) => {
    this.setState({
      openPostModal: true,
      profilePictureURL: post.profilePictureURL,
      username: post.username,
      timeCreated: convertTime(post.timeCreated),
      postURL: post.postURL,
      postDescription: post.postDescription,
      tipAmount: post.tipAmount,
      likes: post.likes,
      dislikes: post.dislikes,
    });
  };
  handleClosePostModal = () => {
    this.setState({ openPostModal: false });
  };

  render() {
    return (
      <MspaceConsumer>
        {(contextProps) => {
          const {
            appUsers,
            allAppPosts,
            userFollowers,
            userFollowings,
            userAccountDetails,
            unFollowUser,
          } = contextProps;
          const isProfileCurrentUser =
            userAccountDetails.username ===
            decodeURI(this.props.params.username);
          const userProfileDetails = appUsers.find((user) => {
            return user.username === decodeURI(this.props.params.username);
          });
          const userProfilePosts = allAppPosts.filter((post) => {
            return post.username === decodeURI(this.props.params.username);
          });
          console.log("Following ", userFollowings);
          return (
            <>
              <Stack
                p={2}
                direction={"column"}
                flex={6}
                divider={
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ mt: "10px" }}
                  />
                }
              >
                <Stack direction={"row"} spacing={10}>
                  <Box>
                    <Avatar
                      sx={{ width: 100, height: 100 }}
                      src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${userProfileDetails.profilePictureURL}`}
                    />
                  </Box>
                  <Stack spacing={1}>
                    <Typography>{userProfileDetails.username}</Typography>
                    <Stack direction={"row"} spacing={2}>
                      <Typography>
                        {userProfileDetails.postCount} posts
                      </Typography>
                      {isProfileCurrentUser ? (
                        <div onClick={this.handleOpenFollowerModal}>
                          <Typography sx={{ cursor: "pointer" }}>
                            {userProfileDetails.followerCount} followers
                          </Typography>
                        </div>
                      ) : (
                        <Typography>
                          {userProfileDetails.followerCount} followers
                        </Typography>
                      )}
                      {isProfileCurrentUser ? (
                        <div onClick={this.handleOpenFollowingModal}>
                          <Typography sx={{ cursor: "pointer" }}>
                            {userProfileDetails.followingCount} followings
                          </Typography>
                        </div>
                      ) : (
                        <Typography>
                          {userProfileDetails.followingCount} followings
                        </Typography>
                      )}
                    </Stack>
                    <Typography>
                      Biography - {userProfileDetails.biography}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack>
                  <ListSubheader
                    component="div"
                    sx={{ textAlign: "center", mt: "5px", mb: "5px" }}
                  >
                    <Typography variant="h6">Posts</Typography>
                  </ListSubheader>
                  <ImageList cols={3}>
                    {userProfilePosts.map((post) => (
                      <ImageListItem
                        key={post.postID}
                        onClick={() => {
                          this.handleOpenPostModal(post);
                        }}
                      >
                        <img
                          srcSet={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.postURL}`}
                          src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.postURL}`}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title={post.postDescription}
                          subtitle={convertDate(post.timeCreated)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Stack>
              </Stack>
              <Modal
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                open={this.state.openFollowersModal}
                onClose={this.handleCloseFollowerModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <ModalContainer>
                  <Stack
                    alignItems={"center"}
                    gap={2}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    <Typography variant="h6">Followers</Typography>
                    <Box>
                      {userFollowers.map((follower, index) => {
                        return (
                          <Stack
                            key={index}
                            direction={"row"}
                            gap={3}
                            alignItems={"center"}
                          >
                            <Avatar
                              alt={follower.username}
                              src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${follower.profilePictureURL}`}
                            />
                            <Typography variant="body1">
                              {follower.username}
                            </Typography>
                            <Button>Remove</Button>
                          </Stack>
                        );
                      })}
                    </Box>
                  </Stack>
                </ModalContainer>
              </Modal>
              <Modal
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                open={this.state.openFollowingModal}
                onClose={this.handleCloseFollowingModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <ModalContainer>
                  <Stack
                    alignItems={"center"}
                    gap={2}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    <Typography variant="h6">Followings</Typography>
                    <Box>
                      {userFollowings.map((following, index) => {
                        return following.username ? (
                          <Stack
                            key={index}
                            direction={"row"}
                            gap={3}
                            alignItems={"center"}
                          >
                            <Avatar
                              alt={following.username}
                              src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${following.profilePictureURL}`}
                            />
                            <Typography variant="body1">
                              {following.username}
                            </Typography>
                            <Button
                              onClick={() => {
                                unFollowUser(following.owner);
                              }}
                            >
                              Unfollow
                            </Button>
                          </Stack>
                        ) : (
                          ""
                        );
                      })}
                    </Box>
                  </Stack>
                </ModalContainer>
              </Modal>
              <Modal
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                open={this.state.openPostModal}
                onClose={this.handleClosePostModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Card sx={{ maxWidth: 430, mb: "12px", borderRadius: "0" }}>
                  <CardHeader
                    avatar={
                      <Box>
                        <Avatar
                          sx={{ width: 30, height: 30 }}
                          src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.state.profilePictureURL}`}
                        />
                      </Box>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={this.state.username}
                    subheader={this.state.timeCreated}
                  />
                  <CardMedia
                    component="img"
                    height="100%"
                    image={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.state.postURL}`}
                  />
                  <Box>
                    <CardContent>
                      <Stack direction={"row"} gap={1}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={"bold"}
                          component={"a"}
                          href={`/profile/${this.state.username}`}
                        >
                          {this.state.username} -
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {this.state.postDescription}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <Divider />
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            this.state.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>
                      </Box>
                    </CardActions>
                    <Divider />
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Stack direction={"row"} alignItems={"center"} gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Likes: {parseInt(this.state.likes)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dislikes: {parseInt(this.state.dislikes)}
                        </Typography>
                      </Stack>
                    </CardActions>
                  </Box>
                </Card>
              </Modal>
            </>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default withRouter(Profile);
