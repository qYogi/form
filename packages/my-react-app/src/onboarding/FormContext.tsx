// YearlyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// type YearlyContextType = [boolean, () => void];
// const YearlyContext = createContext<YearlyContextType | undefined>(undefined);
type PlanName = "Arcade" | "Advanced" | "Pro";

// interface User {
//   name: string;
//   email: string;
//   phone: string;
// }

interface Plan {
  id: string;
  isYearly: boolean;
  planName: PlanName;
  planPrice: number;
  planIcon: string;
}

interface AddOn {
  title: string;
  description: string;
  price: number;
}

interface PlanContextType {
  isYearly: boolean;
  selectedPlan: Plan | null;
  handleToggle: () => void;
  setSelectedPlan: (plan: Plan) => void;
  addOns: {
    [id: string]: AddOn;
  };
  setAddOns: (addOns: { [id: string]: AddOn }) => void;
  checkedAddOns: { [id: string]: boolean };
  setCheckedAddOns: (checkedAddOns: { [id: string]: boolean }) => void;
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

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [addOns, setAddOns] = useState<{
    [id: string]: AddOn;
  }>({});

  const [checkedAddOns, setCheckedAddOns] = useState<{ [id: string]: boolean }>(
    {},
  );

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleToggle = () => {
    setIsYearly((prev) => {
      const newIsYearly = !prev;

      // Update the selected plan with the new pricing model
      if (selectedPlan) {
        const prices = {
          Arcade: newIsYearly ? 90 : 9,
          Advanced: newIsYearly ? 120 : 12,
          Pro: newIsYearly ? 150 : 15,
        };

        const updatedPlan = {
          ...selectedPlan,
          isYearly: newIsYearly,
          planPrice: prices[selectedPlan.planName as keyof typeof prices],
        };

        setSelectedPlan(updatedPlan);
      }

      const updatedAddOns = Object.keys(addOns).reduce(
        (acc, id) => {
          const addOn = addOns[id];
          const yearlyPrices = {
            "1": 10,
            "2": 20,
            "3": 20,
          };
          const monthlyPrices = {
            "1": 1,
            "2": 2,
            "3": 2,
          };

          const newPrice = newIsYearly
            ? yearlyPrices[id as keyof typeof yearlyPrices]
            : monthlyPrices[id as keyof typeof monthlyPrices];

          acc[id] = { ...addOn, price: newPrice };
          return acc;
        },
        {} as { [id: string]: AddOn },
      );

      setAddOns(updatedAddOns);

      return newIsYearly;
    });
  };

  return (
    <PlanContext.Provider
      value={{
        isYearly,
        handleToggle,
        selectedPlan,
        setSelectedPlan,
        addOns,
        setAddOns,
        checkedAddOns,
        setCheckedAddOns,
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
