import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import config from "./config.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ActiveSubscriptionProvider } from "./components/HasSubscriptionActivatedContext.tsx";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "form",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ActiveSubscriptionProvider>
        <App />
      </ActiveSubscriptionProvider>
    </Router>
  </React.StrictMode>,
);
