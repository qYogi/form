import { useEffect, useState } from "react";
import { PlanCard } from "./PlanCard";
import { PlanButton } from "./PlanButton.tsx";
import planStyles from "./plan.module.css";
import { IconTypes } from "./Icon";
import { usePlan } from "../FormContext.tsx";
import { API } from "aws-amplify";

interface Plan {
  id: string;
  planName: string;
  planPriceYearly: number;
  planPriceMonthly: number;
  planIcon: IconTypes;
}

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const SelectYourPlanForm = ({
  goToNextStep,
  goToPreviousStep,
}: Props) => {
  const { isYearly, selectedPlan, setSelectedPlan } = usePlan(); // Destructure the object returned by usePlan
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [plans, setPlans] = useState<Plan[]>([]); // Initialize state to hold plans

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.id);
    }
  }, [selectedPlan]);

  // const prices = {
  //   Arcade: isYearly ? 90 : 9,
  //   Advanced: isYearly ? 120 : 12,
  //   Pro: isYearly ? 150 : 15,
  // };
  //
  // const plans = [
  //   {
  //     id: "1",
  //     planName: "Arcade",
  //     planPrice: prices.Arcade,
  //     planIcon: IconTypes.ArcadeIcon,
  //     isYearly: isYearly,
  //   },
  //   {
  //     id: "2",
  //     planName: "Advanced",
  //     planPrice: prices.Advanced,
  //     planIcon: IconTypes.AdvancedIcon,
  //     isYearly: isYearly,
  //   },
  //   {
  //     id: "3",
  //     planName: "Pro",
  //     planPrice: prices.Pro,
  //     planIcon: IconTypes.ProIcon,
  //     isYearly: isYearly,
  //   },
  // ];

  useEffect(() => {
    // Fetch plans from the backend API
    async function fetchPlans() {
      try {
        const response = await API.get("form", "/form");

        const data = await response.json();

        if (!data) throw new Error("No data returned");

        const transformedPlans = data.map((plan: any) => ({
          planId: plan.planId,
          planName: plan.planName,
          planPriceYearly: plan.planPriceYearly,
          planPriceMonthly: plan.planPriceMonthly,
          planIcon: plan.planIcon,
        }));

        setPlans(transformedPlans);
        console.log("Fetched plans:", transformedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    }

    fetchPlans();
  }, [isYearly]);

  const handleSelectedPlan = (plan: any) => {
    setSelectedPlanId(plan.id);
    setSelectedPlan(plan);
    // Update the context with the selected plan
  };

  console.log(selectedPlan);
  return (
    <div className={planStyles.container}>
      <div className={planStyles.planContainer}>
        <div className={planStyles.header}>
          <h1>{plans.planName}</h1>
          <h1>Select your plan</h1>
          <p>You have the option of monthly or yearly billing</p>
        </div>
        <div className={planStyles.cards}>
          {plans.map((plan) => (
            <PlanCard
              plan={plan}
              key={plan.id}
              handleSelectedPlan={handleSelectedPlan}
              isSelected={selectedPlanId === plan.id}
            />
          ))}
        </div>
        <PlanButton />
      </div>
      <div className={planStyles.buttons}>
        <button className={planStyles.back} onClick={goToPreviousStep}>
          Go Back
        </button>
        {selectedPlanId ? (
          <button className={planStyles.next} onClick={goToNextStep}>
            Next Step
          </button>
        ) : null}
      </div>
    </div>
  );
};
