import React, { Component } from "react";
import Alert from "@mui/material/Alert";

class Error extends Component {
  render() {
    return (
      <Alert variant="outlined" severity="error">
        Not Found Page
      </Alert>
    );
  }
}

export default Error;
