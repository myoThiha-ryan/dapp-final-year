import { Puff } from "react-loader-spinner";
import React, { Component } from "react";

class Loader extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Puff
        visible={true}
        height="80"
        width="80"
        color="#46c4e3"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  }
}

export default Loader;
