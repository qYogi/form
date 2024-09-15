import buttonStyle from "./plan.module.css";
import planStyles from "./plan.module.css";
import { usePlan } from "../FormContext.tsx";

export const PlanButton = () => {
  const { isYearly, handleToggle } = usePlan(); // Destructure the object returned by usePlan

  return (
    <div className={planStyles.toggleContainer}>
      <div className={planStyles.plans}>
        <p>Monthly</p>
        <label className={buttonStyle.switch}>
          <input type="checkbox" checked={isYearly} onChange={handleToggle} />
          <span className={`${buttonStyle.slider} ${buttonStyle.round}`}></span>
        </label>
        <p>Yearly</p>
      </div>
    </div>
  );
};
