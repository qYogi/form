import { ReactElement, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { API, Auth } from "aws-amplify";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserId(user.attributes.sub);
        console.log(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (isAuthenticated && pathname === "/dashboard") {
        try {
          const response = await API.get(
            "form",
            `/getSubscription/${userId}`,
            {},
          );
          if (response.isActive === "false") {
            setShouldRedirect("/form");
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (isAuthenticated && pathname === "/form") {
        try {
          const response = await API.get(
            "form",
            `/getSubscription/${userId}`,
            {},
          );
          if (response.isActive === "true") {
            setShouldRedirect("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkSubscriptionStatus();
  }, [isAuthenticated, pathname, userId]);

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} />;
  }

  return children;
}
