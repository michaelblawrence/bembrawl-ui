import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./mobile/App";
import AppTV from "./host/AppTV";
import * as serviceWorker from "./mobile/serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

function MainApp() {
  const renderTvApp = isHost();
  if (renderTvApp) {
    return <AppTV />;
  } else {
    return <App />;
  }
}

function isHost() {
  const href = document.location.href;
  const trimmed = href.endsWith("/")
    ? href.substring(0, href.length - 1)
    : href;
  return trimmed.endsWith("tv");
}
