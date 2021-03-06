import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { SocketContext, socket } from "./context/Socket";
import Chat from "./pages/Chat";
import Videocall from "./pages/Videocall";

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route path="/chat" component={Chat} />
          <Route path="/room" component={Videocall} />
          <Redirect exact from="/" to="/chat" />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
