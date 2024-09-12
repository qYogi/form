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
  addOnMonthlyPrice: string;
  addOnYearlyPrice: string;
}

interface SubscriptionType {
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

  const subscriptionData = subscriptions.length > 0 ? subscriptions[0] : null;

  console.log(subscriptionData);

  const addOnsTotalPrice =
    subscriptionData?.addOns.reduce(
      (total, addOn) =>
        total +
        (isYearly
          ? parseInt(addOn.addOnYearlyPrice)
          : parseInt(addOn.addOnMonthlyPrice)),
      0,
    ) || 0;

  const totalPrice =
    subscriptionData && subscriptionData.plan
      ? (isYearly
          ? subscriptionData?.plan?.planPriceYearly
          : subscriptionData?.plan?.planPriceMonthly) + addOnsTotalPrice
      : 0;

  return (
    <div className={styles.group}>
      <div className={styles.paymentContainer}>
        <div className={styles.planName}>
          <div className={styles.name}>
            <h5>{subscriptionData?.plan?.planName || "Loading"}</h5>
            <button onClick={changePlan}>Change</button>
          </div>
          <h3>
            {isYearly
              ? `$${subscriptionData?.plan?.planPriceYearly}/yr`
              : `$${subscriptionData?.plan?.planPriceMonthly}/mo` || "Loading"}
          </h3>
        </div>
        <hr />
        <div className={styles.addOns}>
          <div>
            {subscriptionData?.addOns.map((addOn) => (
              <p key={addOn.addOnTitle}>{addOn.addOnTitle}</p>
            ))}
          </div>
          <div className={styles.addOnsPrice}>
            {subscriptionData?.addOns.map((addOn) => (
              <p key={addOn.addOnTitle}>
                ${isYearly ? addOn.addOnYearlyPrice : addOn.addOnMonthlyPrice}/
                {isYearly ? "yr" : "mo"}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.totalPrice}>
        <p>Total ({isYearly ? "per year" : "per month"})</p>
        <h2>${totalPrice}</h2>
      </div>
    </div>
  );
};
