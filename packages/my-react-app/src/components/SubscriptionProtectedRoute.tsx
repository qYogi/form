import { Navigate, useLocation } from "react-router-dom";
import { useActiveSubscriptionContext } from "./HasSubscriptionActivatedContext.tsx";
import React from "react";

export const SubscriptionProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { hasSubscriptionActivated, loading } = useActiveSubscriptionContext();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (hasSubscriptionActivated === "false" && location.pathname === "/form") {
    return children;
  } else if (
    hasSubscriptionActivated === "true" &&
    location.pathname === "/form"
  ) {
    return <Navigate to={"/dashboard"} replace />;
  } else if (hasSubscriptionActivated === "false") {
    return <Navigate to={"/form"} replace />;
  }

  return children;
};
