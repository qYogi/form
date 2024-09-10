import { useEffect, useState } from "react";
import { PlanCard } from "./PlanCard";
import { PlanButton } from "./PlanButton.tsx";
import planStyles from "./plan.module.css";
import { IconTypes } from "./Icon";
import { usePlan } from "../FormContext.tsx";
import { API } from "aws-amplify";

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export interface PlanType {
  planId: string;
  planName: string;
  planPriceYearly: number;
  planPriceMonthly: number;
  planIcon: string;
}

export const SelectYourPlanForm = ({
  goToNextStep,
  goToPreviousStep,
}: Props) => {
  const { isYearly, selectedPlan, setSelectedPlan } = usePlan(); // Destructure the object returned by usePlan
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [plans, setPlans] = useState<PlanType[]>([]); // State for storing the plans

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.id);
    }
  }, [selectedPlan]);

  function getPlans() {
    API.get("form", "/planObject", {})
      .then((response) => {
        // Process the response to match the required plan format
        const fetchedPlans = response.map((plan: PlanType) => ({
          id: plan.planId,
          planName: plan.planName,
          planPriceYearly: plan.planPriceYearly,
          planPriceMonthly: plan.planPriceMonthly,
          planIcon: IconTypes[plan.planIcon as keyof typeof IconTypes],
        }));
        setPlans(fetchedPlans);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error); // Log the error
      });
  }

  useEffect(() => {
    getPlans(); // Fetch plans on component mount
  }, []);

  const handleSelectedPlan = (plan: PlanType) => {
    const price = isYearly ? plan.planPriceYearly : plan.planPriceMonthly;

    setSelectedPlan({
      id: plan.id,
      isYearly: isYearly,
      planName: plan.planName,
      planPrice: price,
      planIcon: plan.planIcon,
      planPriceYearly: plan.planPriceYearly,
      planPriceMonthly: plan.planPriceMonthly,
    });
    setSelectedPlanId(plan.planId);
  };

  const handleSubmit = async () => {
    await API.put("form", "/updateSubscription", {
      body: {
        planId: selectedPlanId,
        subscriptionType: isYearly ? "yearly" : "monthly",
        addOnIds: JSON.stringify([]),
        isActive: "False",
        startedDate: "2022-01-01",
      },
    });

    goToNextStep();
  };

  console.log(selectedPlan);

  return (
    <div className={planStyles.container}>
      <div className={planStyles.planContainer}>
        <div className={planStyles.header}>
          <h1></h1>
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
          <button className={planStyles.next} onClick={handleSubmit}>
            Next Step
          </button>
        ) : null}
      </div>
    </div>
  );
};
