import React, { Component } from "react";
import Identicon from "identicon.js";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button } from "@mui/material";
import Post from "./Post";
import { MspaceConsumer } from "../context/mspaceContext";

class Feed extends Component {
  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const {
            likePost,
            likedPostIds,
            unlikePost,
            dislikePost,
            dislikedPostIds,
            undislikePost,
            tipPost,
          } = props;
          return (
            <Box p={2} flex={4}>
              {this.props.feedPosts.map((post, key) => {
                return (
                  <Post
                    post={post}
                    likePost={likePost}
                    likedPostIds={likedPostIds}
                    unlikePost={unlikePost}
                    dislikePost={dislikePost}
                    dislikedPostIds={dislikedPostIds}
                    undislikePost={undislikePost}
                    tipPost={tipPost}
                    key={key}
                  ></Post>
                );
              })}
            </Box>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Feed;
