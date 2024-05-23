import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import WebVitals from "./services/WebVitalsService";
import AuthenticationWrapper from "./views/AuthenticationWrapper";
import { App } from "./views/App";

ReactDOM.render(
  <React.StrictMode>
    <div id="container">
      <BrowserRouter>
        <AuthenticationWrapper>
          <App />
        </AuthenticationWrapper>
      </BrowserRouter>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

WebVitals();
