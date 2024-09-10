import styles from "./payment.module.css";
import { usePlan } from "../FormContext.tsx";
import { API } from "aws-amplify";
import { useEffect } from "react";
import { useState } from "react";

interface Props {
  changePlan: () => void;
}

interface AddOnType {
  addOnTitle: string;
  addOnPrice: string;
}

interface SubscriptionType {
  planName: string;
  planPrice: string;
  addOns: AddOnType[];
  plan: {
    planId: string;
    planName: string;
    planPriceYearly: number;
    planPriceMonthly: number;
    planIcon: string;
  };
}

export const ReviewPayment = ({ changePlan }: Props) => {
  const { isYearly } = usePlan();
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  function getSubscriptions() {
    API.get("form", "/getSubscription", {})
      .then((response) => {
        const subscription: SubscriptionType = {
          addOns: response.addOns || [],
          plan: response.plan,
        };
        setSubscriptions([subscription]);
      })
      .catch((error) => {
        console.error("Error fetching subscriptions:", error);
      });
  }

  useEffect(() => {
    getSubscriptions();
  }, []);

  const subscriptionData = subscriptions[0];

  console.log(subscriptionData);

  return (
    <div className={styles.group}>
      <div className={styles.paymentContainer}>
        <div className={styles.planName}>
          <div className={styles.name}>
            <h5>{subscriptionData.plan.planName}</h5>
            <button onClick={changePlan}>Change</button>
          </div>
          <h3>
            {isYearly
              ? `$${subscriptionData.plan.planPriceYearly}/yr`
              : `$${subscriptionData.plan.planPriceMonthly}/mo`}
          </h3>
        </div>
        <hr />
        <div className={styles.addOns}>
          {subscriptionData.addOns.map((addOn, index) => (
            <div key={index} className={styles.addOn}>
              <p>{addOn.addOnTitle}</p>
              <h3>{addOn.addOnPrice}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.totalPrice}>
        <p>Total ({isYearly ? "per year" : "per month"})</p>
        <h2>total PRICE/{isYearly ? "yr" : "mo"}</h2>
      </div>
    </div>
  );
};
