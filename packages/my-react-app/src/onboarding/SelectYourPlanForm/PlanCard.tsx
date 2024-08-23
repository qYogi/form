import cardStyle from "./planCard.module.css";
import { Icon, IconTypes } from "./Icon";
import React from "react";

interface PlanCardProps {
  plan: {
    planName: string;
    planPrice: number;
    planIcon: IconTypes;
    isYearly: boolean;
    id: string;
  };
  handleSelectedPlan: (plan: any) => void;
  isSelected: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  handleSelectedPlan,
  isSelected = false,
}) => {
  const eventHandler = () => {
    handleSelectedPlan(plan);
  };

  return (
    <div
      className={`${cardStyle.cardsContainer} ${isSelected ? cardStyle.selected : ""}`}
      onClick={eventHandler}
    >
      <div className={cardStyle.icon}>
        <Icon iconType={plan.planIcon} />
      </div>
      <div className={cardStyle.planInfo}>
        <h3>{plan.planName}</h3>
        <p>
          ${plan.planPrice}/{plan.isYearly ? "yr" : "mo"}
        </p>

        {plan.isYearly ? <h5>2 months free</h5> : null}
      </div>
    </div>
  );
};
