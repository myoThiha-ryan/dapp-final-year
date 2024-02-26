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
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Avatar, Box, Button, Divider, Stack } from "@mui/material";

class Post extends Component {
  render() {
    return (
      <Card sx={{ maxWidth: 400, mb: "10px" }} key={this.props.key}>
        <CardHeader
          avatar={
            <Box>
              <Avatar
                sx={{ width: 30, height: 30 }}
                src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.props.post.profilePictureHash}`}
              />
            </Box>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={this.props.post.username}
          subheader="September 14, 2016"
        />
        <CardMedia
          component="img"
          height="100%"
          image={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${this.props.post.imgHash}`}
        />
        <Box>
          <CardContent>
            <Stack direction={"row"} gap={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={"bold"}
                component={"a"}
                href="/profile"
              >
                {this.props.post.username} -
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {this.props.post.content}
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
                  this.props.post.tipAmount.toString(),
                  "Ether"
                )}{" "}
                ETH
              </small>
            </Box>
            <Box>
              <button
                className="btn btn-link btn-sm float-right pt-0"
                name={this.props.post.id}
                onClick={(event) => {
                  let tipAmount = window.web3.utils.toWei("0.1", "Ether");
                  console.log(event.target.name, tipAmount);
                  this.props.tipImageOwner(event.target.name, tipAmount);
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
              <IconButton aria-label="like post">
                <ThumbUpOffAltIcon />
              </IconButton>
              <IconButton aria-label="like post">
                <ChatBubbleOutlineOutlinedIcon />
              </IconButton>
              <IconButton aria-label="dislike post">
                <ThumbDownOffAltIcon />
              </IconButton>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Typography variant="body2" color="text.secondary">
                Likes: {parseInt(this.props.post.likes)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dislikes: {parseInt(this.props.post.likes)}
              </Typography>
            </Stack>
          </CardActions>
        </Box>
      </Card>
    );
  }
}

export default Post;
