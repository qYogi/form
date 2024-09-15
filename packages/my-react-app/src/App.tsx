import "./App.css";
import "./index.css";
import Routes from "./Routes.tsx";
import { AppContext, AppContextType } from "./lib/contextLib";
import { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";

import { PlanProvider } from "./onboarding/FormContext.tsx";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();

    API.post("form", "/seedDb", {})
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    console.log("Hello");
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <PlanProvider>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
        >
          <Routes />
        </AppContext.Provider>
      </PlanProvider>
    )
  );
}

export default App;
