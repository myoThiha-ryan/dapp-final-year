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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

class Rightbar extends Component {
  render() {
    const { appUsers } = this.props;
    return (
      <Box p={2} flex={2} sx={{ display: { xs: "none", sm: "block" } }}>
        <Box sx={{ position: "fixed", width: "500px" }}>
          <Paper sx={{ mb: 10, padding: 2 }} elevation={3}>
            <Typography variant="body1">Suggested For You</Typography>
            <Stack flexDirection={"column"} gap={3} sx={{ padding: "5px" }}>
              {appUsers.map((user, index) => (
                <Stack
                  key={index}
                  direction={"row"}
                  gap={2}
                  alignItems={"center"}
                >
                  <Avatar
                    alt={user.username}
                    src={`https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/${user.profilePictureURL}`}
                  />
                  <Typography variant="body1">{user.username}</Typography>
                  <Button>Follow</Button>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }
}

export default Rightbar;
