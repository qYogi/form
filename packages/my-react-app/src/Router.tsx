import { Route, Routes } from "react-router-dom";
import { OnboardingScreen } from "./onboarding";
import { BrowserRouter } from "react-router-dom";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Form" element={<OnboardingScreen />} />
        <Route path="*" element={<NotFound />} />;
      </Routes>
    </BrowserRouter>
  );
}
