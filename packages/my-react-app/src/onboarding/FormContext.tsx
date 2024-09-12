// YearlyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// type YearlyContextType = [boolean, () => void];
// const YearlyContext = createContext<YearlyContextType | undefined>(undefined);
// type PlanName = "Arcade" | "Advanced" | "Pro";

// interface User {
//   name: string;
//   email: string;
//   phone: string;
// }

// export interface Plan {
//   id: string;
//   isYearly: boolean;
//   planName: PlanName;
//   planPrice: number;
//   planIcon: string;
// }

interface PlanContextType {
  isYearly: boolean;
  handleToggle: () => void;
  name: string;
  email: string;
  phone: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
};

export const PlanProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isYearly, setIsYearly] = useState(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleToggle = () => {
    setIsYearly((prev) => !prev);
  };

  return (
    <PlanContext.Provider
      value={{
        isYearly,
        handleToggle,
        name,
        email,
        phone,
        setName,
        setEmail,
        setPhone,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};
