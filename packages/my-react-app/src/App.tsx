import "./App.css";
import "./index.css";
import Routes from "./Routes.tsx";
import { AppContext, AppContextType } from "./lib/contextLib";
import { useState } from "react";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <AppContext.Provider
      value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
    >
      <Routes />
    </AppContext.Provider>
  );
}

export default App;
