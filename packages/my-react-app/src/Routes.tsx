import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { OnboardingScreen } from "./onboarding";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import { Profile } from "./containers/Profile.tsx";
import Signup from "./containers/Signup.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import { TicTacToe } from "./containers/Games/Tic-Tac-Toe/TicTacToe.tsx";
import { SubscriptionProtectedRoute } from "./components/SubscriptionProtectedRoute";

export default function Pages() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
        path="/form"
        element={
          <AuthenticatedRoute>
            <SubscriptionProtectedRoute>
              <OnboardingScreen />
            </SubscriptionProtectedRoute>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <SubscriptionProtectedRoute>
              <Profile />
            </SubscriptionProtectedRoute>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/TicTacToe"
        element={
          <AuthenticatedRoute>
            <SubscriptionProtectedRoute>
              <TicTacToe />
            </SubscriptionProtectedRoute>
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
