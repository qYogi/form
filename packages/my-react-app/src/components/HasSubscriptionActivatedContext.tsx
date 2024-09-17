import React, { createContext, useContext, useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";

export interface ActiveSubscitpionContextType {
  hasSubscriptionActivated: string;
  loading: boolean;
  refetchsubscriptionStatus: () => Promise<void>;
}

const ActiveSubscriptionContext = createContext<
  ActiveSubscitpionContextType | undefined
>(undefined);

export const useActiveSubscriptionContext = () => {
  const context = useContext(ActiveSubscriptionContext);
  if (!context) {
    throw new Error(
      "useActiveSubscriptionContext must be used within a ActiveSubscriptionProvider",
    );
  }
  return context;
};

export const ActiveSubscriptionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hasSubscriptionActivated, setHasSubscriptionActivated] =
    useState<string>("false");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubscriptionStatus = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.attributes.sub;
      const response = await API.get("form", `/getSubscription/${userId}`, {});

      if (response.isActive === "true") {
        setHasSubscriptionActivated("true");
      } else {
        setHasSubscriptionActivated("false");
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  return (
    <ActiveSubscriptionContext.Provider
      value={{
        hasSubscriptionActivated,
        loading,
        refetchsubscriptionStatus: fetchSubscriptionStatus,
      }}
    >
      {children}
    </ActiveSubscriptionContext.Provider>
  );
};
