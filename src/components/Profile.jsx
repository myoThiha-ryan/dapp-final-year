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
} from "@mui/material";
import React, { Component } from "react";
import { MspaceConsumer } from "../context/mspaceContext";
import { convertDate } from "../utils/apiFeature";
import withRouter from "./withRouter";

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
                      <ImageListItem key={post.postID}>
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
                            <Button>Block</Button>
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
            </>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default withRouter(Profile);
