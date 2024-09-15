import style from "./steps.module.css";
import React from "react";
import UseWindowWidth from "./UseWindowWidth.tsx";
interface StepsProps {
  step: number;
  text: string;
  currentStep: number;
}

export const Steps: React.FC<StepsProps> = ({ step, text, currentStep }) => {
  const width = UseWindowWidth();

  return (
    <div className={style.step}>
      <span
        className={`${style.stepNumber} ${currentStep === step - 1 ? style.active : ""}`}
      >
        {step}
      </span>
      {width > 768 && ( // Conditionally render step content based on screen width
        <div className={style.stepContent}>
          <p>Step {step}</p>
          <h4>{text}</h4>
        </div>
      )}
    </div>
  );
};
