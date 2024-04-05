import {
  Avatar,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { MspaceConsumer } from "../context/mspaceContext";
import { InfoOutlined } from "@mui/icons-material";
import withRouter from "./withRouter";

// function withParams(Component) {
//   return (props) => <Component {...props} params={useParams()} />;
// }

class Profile extends Component {
  constructor(props) {
    super(props);
  }
  // componentDidMount() {
  //   const { username } = this.props.params;
  //   this.setState({ userName: username });
  // }

  render() {
    return (
      <MspaceConsumer>
        {(contextProps) => {
          const { appUsers, allAppPosts } = contextProps;
          console.log(appUsers);
          const userProfileDetails = appUsers.find((user) => {
            return user.username === decodeURI(this.props.params.username);
          });
          const userProfilePosts = allAppPosts.filter((post) => {
            return post.username === decodeURI(this.props.params.username);
          });
          return (
            <Stack p={2} flex={8} sx={{ backgroundColor: "black" }}>
              <Stack
                direction={"row"}
                spacing={10}
                sx={{ backgroundColor: "white" }}
              >
                <Box>
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${userProfileDetails.profilePictureURL}`}
                  />
                </Box>
                <Stack spacing={1}>
                  <Typography>{userProfileDetails.username}</Typography>
                  <Stack direction={"row"} spacing={2}>
                    <Typography>0 posts</Typography>
                    <Typography>0 followers</Typography>
                    <Typography>0 followings</Typography>
                  </Stack>
                  <Typography>Biography - Be Optimistic</Typography>
                </Stack>
              </Stack>
              <Stack>
                <ImageList>
                  <ImageListItem key="Subheader" cols={2}>
                    <ListSubheader component="div">December</ListSubheader>
                  </ImageListItem>
                  {userProfilePosts.map((post) => (
                    <ImageListItem key={post.postID}>
                      <img
                        srcSet={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.postURL}`}
                        src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.postURL}`}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={post.postDescription}
                        subtitle={post.username}
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${post.postDescription}`}
                          >
                            <InfoOutlined />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Stack>
            </Stack>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default withRouter(Profile);
