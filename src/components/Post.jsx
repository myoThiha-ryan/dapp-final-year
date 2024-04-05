import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Avatar, Box, Button, Divider, Stack } from "@mui/material";
import { convertTime } from "../utils/apiFeature";
import { MspaceConsumer } from "../context/mspaceContext";
import { ThumbDownAlt } from "@mui/icons-material";
class Post extends Component {
  render() {
    const {
      likePost,
      likedPostIds,
      unlikePost,
      dislikePost,
      dislikedPostIds,
      undislikePost,
      tipPost,
      post,
    } = this.props;

    let isCurrentPostLiked = false;
    let isCurrentPostDisliked = false;
    for (let i = 0; i < likedPostIds.length; i++) {
      if (likedPostIds[i] === post.postID) {
        isCurrentPostLiked = true;
      }
    }

    for (let i = 0; i < dislikedPostIds.length; i++) {
      if (dislikedPostIds[i] === post.postID) {
        isCurrentPostDisliked = true;
      }
    }

    return (
      <Card sx={{ maxWidth: 400, mb: "10px" }}>
        <CardHeader
          avatar={
            <Box>
              <Avatar
                sx={{ width: 30, height: 30 }}
                src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.profilePictureURL}`}
              />
            </Box>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={post.username}
          subheader={convertTime(post.timeCreated)}
        />
        <CardMedia
          component="img"
          height="100%"
          image={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${post.postURL}`}
        />
        <Box>
          <CardContent>
            <Stack direction={"row"} gap={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={"bold"}
                component={"a"}
                href={`/profile/${post.username}`}
              >
                {post.username} -
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.postDescription}
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
                {window.web3.utils.fromWei(post.tipAmount.toString(), "Ether")}{" "}
                ETH
              </small>
            </Box>
            <Box>
              <button
                className="btn btn-link btn-sm float-right pt-0"
                name={post.postID}
                onClick={(event) => {
                  let tipAmount = window.web3.utils.toWei("0.1", "Ether");
                  console.log(event.target.name, tipAmount);
                  tipPost(event.target.name, tipAmount);
                }}
              >
                TIP 0.1 ETH
              </button>
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
            <Stack direction={"row"} alignItems={"center"}>
              {isCurrentPostLiked ? (
                <IconButton
                  aria-label="like post"
                  onClick={() => {
                    unlikePost(post.postID);
                  }}
                  sx={{ color: "#46c4e3" }}
                >
                  <ThumbUpAltIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="like post"
                  onClick={() => {
                    likePost(post.postID);
                  }}
                >
                  <ThumbUpOffAltIcon />
                </IconButton>
              )}
              <IconButton aria-label="like post">
                <ChatBubbleOutlineOutlinedIcon />
              </IconButton>
              {isCurrentPostDisliked ? (
                <IconButton
                  aria-label="like post"
                  onClick={() => {
                    undislikePost(post.postID);
                  }}
                  sx={{ color: "#46c4e3" }}
                >
                  <ThumbDownAltIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="dislike post"
                  onClick={() => {
                    dislikePost(post.postID);
                  }}
                >
                  <ThumbDownOffAltIcon />
                </IconButton>
              )}
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Typography variant="body2" color="text.secondary">
                Likes: {parseInt(post.likes)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dislikes: {parseInt(post.dislikes)}
              </Typography>
            </Stack>
          </CardActions>
        </Box>
      </Card>
    );
  }
}

export default Post;
