import React, { Component } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { MspaceConsumer } from "../context/mspaceContext";

export class Friends extends Component {
  render() {
    return (
      <MspaceConsumer>
        {(props) => {
          const { userFollowings, appUsers, userAddress, followUser } = props;
          let filteredSuggestedUsers;
          if (userFollowings.length === 0) {
            filteredSuggestedUsers = appUsers;
          } else {
            filteredSuggestedUsers = appUsers.filter((el) => {
              return !userFollowings.find((element) => {
                return element.owner === el.owner;
              });
            });
          }
          return (
            <Box p={2} flex={6} sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body1">Suggested For You</Typography>
              <Stack flexDirection={"row"} gap={3} sx={{ padding: "5px" }}>
                {filteredSuggestedUsers.map(
                  (user, index) =>
                    user.owner !== userAddress && (
                      <Stack key={index} gap={1} alignItems={"center"}>
                        <Avatar
                          alt={user.username}
                          src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${user.profilePictureURL}`}
                          sx={{ width: "130px", height: "130px" }}
                        />
                        <Typography variant="body1">{user.username}</Typography>
                        <Button
                          onClick={() => {
                            followUser(user.owner);
                          }}
                        >
                          Follow
                        </Button>
                      </Stack>
                    )
                )}
              </Stack>
            </Box>
          );
        }}
      </MspaceConsumer>
    );
  }
}

export default Friends;
