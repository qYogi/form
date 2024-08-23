import styles from "./payment.module.css";

import { usePlan } from "../FormContext.tsx";

interface Props {
  changePlan: () => void;
}

export const ReviewPayment = ({ changePlan }: Props) => {
  const { isYearly, addOns, selectedPlan } = usePlan();
  if (!selectedPlan) {
    return <p>No plan Selected</p>;
  }

  const addOnsTotalPrice = Object.values(addOns).reduce(
    (total, addOn) => total + addOn.price,
    0,
  );

  const totalPrice = selectedPlan.planPrice + addOnsTotalPrice;

  return (
    <div className={styles.group}>
      <div className={styles.paymentContainer}>
        <div className={styles.planName}>
          <div className={styles.name}>
            <h5>
              {selectedPlan.planName} ({isYearly ? "Yearly" : "Monthly"})
            </h5>
            <button onClick={changePlan}>Change</button>
          </div>
          <h3>
            ${selectedPlan.planPrice}/{isYearly ? "yr" : "mo"}
          </h3>
        </div>
        <hr />
        <div className={styles.addOns}>
          <div>
            {Object.keys(addOns).map((id) => (
              <p key={id}>{addOns[id].title}</p>
            ))}
          </div>
          <div className={styles.addOnsPrice}>
            {Object.keys(addOns).map((id) => (
              <p key={id}>
                ${addOns[id].price}/{isYearly ? "yr" : "mo"}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.totalPrice}>
        <p>Total ({isYearly ? "per year" : "per month"})</p>
        <h2>
          ${totalPrice}/{isYearly ? "Yearly" : "Monthly"}
        </h2>
      </div>
    </div>
  );
};
