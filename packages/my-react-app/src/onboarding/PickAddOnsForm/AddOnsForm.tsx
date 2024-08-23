import style from "./addOns.module.css";
import React from "react";
import { usePlan } from "../FormContext.tsx";

interface Props {
  price: number;
  title: string;
  description: string;
  id: string;
  checkedBoxInfo: (id: string, isChecked: boolean) => void;
}

export const AddOnsFrom: React.FC<Props> = ({
  price,
  title,
  description,
  checkedBoxInfo,
  id,
}) => {
  const { isYearly, checkedAddOns, setCheckedAddOns } = usePlan();
  const isChecked = checkedAddOns[id] || false;

  const handleCheckBox = () => {
    const newCheckedAddOns = { ...checkedAddOns, [id]: !isChecked };
    setCheckedAddOns(newCheckedAddOns);
    checkedBoxInfo(id, !isChecked);
  };

  return (
    <div className={`${style.checkbox} ${isChecked ? style.checked : ""}`}>
      <input
        className={style.checkboxInput}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckBox}
      />
      <label>
        <div className={style.text}>
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
        <div className={style.price}>
          <p>
            +${price}/{isYearly ? "yr" : "mo"}
          </p>
        </div>
      </label>
    </div>
  );
};
