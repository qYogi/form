import myStyles from "./panel.module.css";
import { Steps } from "./Steps";
import React from "react";

interface PanelProps {
  currentStep: number;
}

export const Panel: React.FC<PanelProps> = ({ currentStep }) => {
  return (
    <div className={`panel ${myStyles.panel}`}>
      <ol className={myStyles.stepList}>
        <li>
          <Steps step={1} text="YOUR INFO" currentStep={currentStep} />
        </li>
        <li>
          <Steps step={2} text="SELECT PLAN" currentStep={currentStep} />
        </li>
        <li>
          <Steps step={3} text="ADD-ONS" currentStep={currentStep} />
        </li>
        <li>
          <Steps step={4} text="SUMMARY" currentStep={currentStep} />
        </li>
      </ol>
    </div>
  );
};
