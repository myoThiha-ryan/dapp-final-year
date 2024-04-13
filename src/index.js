import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./components/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MspaceProvider } from "./context/mspaceContext";
import * as serviceWorker from "./serviceWorker";
import Profile from "./components/Profile";
import Error from "./components/Error";
import Feed from "./components/Feed";
import Rightbar from "./components/Rightbar";
import Friends from "./components/Friends";
import Setting from "./components/Setting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Feed />
            <Rightbar />
          </>
        ),
        errorElement: <Error />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "/friends",
        element: <Friends />,
        errorElement: <Error />,
      },
      {
        path: "/settings",
        element: <Setting />,
        errorElement: <Error />,
      },
    ],
  },
]);

ReactDOM.render(
  <MspaceProvider>
    <RouterProvider router={router} />
  </MspaceProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
