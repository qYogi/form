import style from "./addOns.module.css";
import React from "react";
import { usePlan } from "../FormContext.tsx";
import { AddOnType } from "./PickAddOnForm.tsx";

interface Props {
  addOn: AddOnType;
  id: string;
  onToggle: (id: string) => void;
  isChecked: boolean;
}

export const AddOnsFrom: React.FC<Props> = ({
  addOn: {
    addOnTitle: title,
    addOnDescription: description,
    addOnMonthlyPrice: monthlyPrice,
    addOnYearlyPrice: yearlyPrice,
  },
  id,
  onToggle,
  isChecked,
}) => {
  const { isYearly } = usePlan();

  return (
    <div className={`${style.checkbox} ${isChecked ? style.checked : ""}`}>
      <input
        className={style.checkboxInput}
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(id)}
      />
      <label>
        <div className={style.text}>
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
        <div className={style.price}>
          <p>+{isYearly ? `$${yearlyPrice}/yr` : `$${monthlyPrice}/mo`}</p>
        </div>
      </label>
    </div>
  );
};
