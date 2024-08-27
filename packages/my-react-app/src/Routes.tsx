import { Route, Routes } from "react-router-dom";
import { OnboardingScreen } from "./onboarding";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import { Profile } from "./containers/Profile.tsx";
import Signup from "./containers/Signup.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
export default function Pages() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="signup"
        element={
          <UnauthenticatedRoute>
            <Signup />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/Form"
        element={
          <AuthenticatedRoute>
            <OnboardingScreen />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
