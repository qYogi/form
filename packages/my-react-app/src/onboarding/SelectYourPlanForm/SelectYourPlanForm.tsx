import { useEffect, useState } from "react";
import { PlanCard } from "./PlanCard";
import { PlanButton } from "./PlanButton.tsx";
import planStyles from "./plan.module.css";
import { IconTypes } from "./Icon";
import { usePlan } from "../FormContext.tsx";
import { API, Auth } from "aws-amplify";

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export interface PlanType {
  planId: string;
  planName: "Arcade" | "Advanced" | "Pro";
  planPriceYearly: number;
  planPriceMonthly: number;
  planIcon: IconTypes;
  isYearly: boolean;
}

export const SelectYourPlanForm = ({
  goToNextStep,
  goToPreviousStep,
}: Props) => {
  const { isYearly } = usePlan(); // Destructure the object returned by usePlan
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [selected, setSelected] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserId(user.attributes.sub);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.planId);
    }
  }, [selectedPlan]);

  function getPlans() {
    API.get("form", "/planObject", {})
      .then((response) => {
        // Process the response to match the required plan format
        const fetchedPlans = response.map((plan: PlanType) => ({
          planId: plan.planId,
          planName: plan.planName,
          planPriceYearly: plan.planPriceYearly,
          planPriceMonthly: plan.planPriceMonthly,
          planIcon: plan.planIcon as keyof typeof IconTypes,
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
    setSelectedPlan({
      planId: plan.planId,
      isYearly,
      planName: plan.planName,
      planIcon: plan.planIcon,
      planPriceYearly: plan.planPriceYearly,
      planPriceMonthly: plan.planPriceMonthly,
    });
    setSelectedPlanId(plan.planId);
    setSelected(false);
  };

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlan((prevPlan) =>
        prevPlan
          ? {
              ...prevPlan,
              isYearly,
            }
          : null,
      );
    }
  }, [isYearly]);

  const handleSubmit = async () => {
    setSelected(true);
    try {
      const currentSubscriptionItems = await API.get(
        "form",
        `/getSubscription/${userId}`,
        {},
      );

      const data = {
        ...currentSubscriptionItems,
        planId: selectedPlanId,
      };

      const response = await API.put("form", `/updateSubscription/${userId}`, {
        body: data,
      });
      console.log("Update successful:", response);
      goToNextStep();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
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
              key={plan.planId}
              handleSelectedPlan={handleSelectedPlan}
              isSelected={selectedPlanId === plan.planId}
            />
          ))}
        </div>
        <PlanButton />
      </div>
      <div className={planStyles.buttons}>
        <button className={planStyles.back} onClick={goToPreviousStep}>
          Go Back
        </button>
        <button
          className={planStyles.next}
          onClick={handleSubmit}
          disabled={selected}
          style={{ opacity: selected ? 0.5 : 1 }}
        >
          {selected ? "Next Step" : "Next Step"} {/* Change button text */}
        </button>
      </div>
    </div>
  );
};
