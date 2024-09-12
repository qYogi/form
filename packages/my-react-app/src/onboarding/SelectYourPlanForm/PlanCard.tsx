import cardStyle from "./planCard.module.css";
import { Icon } from "./Icon";
import React from "react";
import { PlanType } from "./SelectYourPlanForm.tsx";
import { usePlan } from "../FormContext.tsx";

interface PlanCardProps {
  plan: PlanType;
  handleSelectedPlan: (plan: PlanType) => void;
  isSelected: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  handleSelectedPlan,
  isSelected = false,
}) => {
  const { isYearly } = usePlan();
  return (
    <div
      className={`${cardStyle.cardsContainer} ${isSelected ? cardStyle.selected : ""}`}
      onClick={() => handleSelectedPlan(plan)}
    >
      <div className={cardStyle.icon}>
        <Icon iconType={plan.planIcon} />
      </div>
      <div className={cardStyle.planInfo}>
        <h3>{plan.planName}</h3>
        <p>
          {isYearly
            ? `$${plan.planPriceYearly}/yr`
            : `$${plan.planPriceMonthly}/mo`}
        </p>

        {isYearly ? <h5>2 months free</h5> : null}
      </div>
    </div>
  );
};
