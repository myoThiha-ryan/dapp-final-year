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

class Feed extends Component {
  render() {
    return (
      <Box p={2} flex={4}>
        {this.props.feedPosts.map((post, key) => {
          return (
            <Post
              post={post}
              key={key}
              tipImageOwner={this.props.tipImageOwner}
            ></Post>
          );
        })}
      </Box>
    );
  }
}

export default Feed;
