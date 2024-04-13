import React, { Component } from "react";
import { Box, Stack } from "@mui/material";
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
            allAppPosts,
          } = props;
          return (
            <Box p={2} flex={4}>
              <Stack alignItems={"center"}>
                {allAppPosts.map((post, key) => {
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
              </Stack>
            </Box>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Feed;
