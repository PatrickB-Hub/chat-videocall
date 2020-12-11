import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./index.css";

import { SocketContext, socket } from "./context/Socket";
import Chat from "./pages/Chat";

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route path="/chat" component={Chat} />
          <Redirect exact from="/" to="/chat" />
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
