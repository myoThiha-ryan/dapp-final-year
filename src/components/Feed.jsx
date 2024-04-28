import React, { Component } from "react";
import { Alert, AlertTitle, Box, Modal, Stack } from "@mui/material";
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
            success,
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
              {success && (
                <Modal
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  open={success ? true : false}
                  onClose={this.handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Alert
                    severity="success"
                    sx={{ width: "400px", height: "100px" }}
                  >
                    <AlertTitle>Success</AlertTitle>
                    {success}
                  </Alert>
                </Modal>
              )}
            </Box>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Feed;
