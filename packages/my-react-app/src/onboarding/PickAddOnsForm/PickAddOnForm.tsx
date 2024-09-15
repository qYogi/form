import { AddOnsFrom } from "./AddOnsForm.tsx";
import style from "./addOns.module.css";
import { useState, useEffect } from "react";
//import { usePlan } from "../FormContext.tsx";
import { API } from "aws-amplify";

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export interface AddOnType {
  addOnId: string;
  addOnTitle: string;
  addOnDescription: string;
  addOnMonthlyPrice: number;
  addOnYearlyPrice: number;
}

interface SubscriptionType {
  planId: string;
  subscriptionType: string;
  addOnIds: string[];
  isActive: boolean;
  startedDate: string;
  //set plan as object
  plan: {
    planId: string;
    planName: string;
    planPrice: number;
    planPriceYearly: number;
    planPriceMonthly: number;
    planIcon: string;
  };
  addOns: AddOnType[];
}

export const PickAddOnForm = ({ goToNextStep, goToPreviousStep }: Props) => {
  const [addOns, setAddOns] = useState<AddOnType[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionType[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]); // Manage selected add-ons
  const [loading, setLoading] = useState<boolean>(false);

  // console.log(checkedAddOns);

  function getAddOns() {
    API.get("form", "/addOnsObject", {})
      .then((response) => {
        const fetchedAddOns = response.map((addOn: AddOnType) => ({
          addOnId: addOn.addOnId,
          addOnTitle: addOn.addOnTitle,
          addOnDescription: addOn.addOnDescription,
          addOnMonthlyPrice: addOn.addOnMonthlyPrice,
          addOnYearlyPrice: addOn.addOnYearlyPrice,
        }));
        setAddOns(fetchedAddOns);
      })
      .catch((error) => {
        console.error("Error fetching add-ons:", error);
      });
  }

  function getSubscription() {
    API.get("form", "/getSubscription", {})
      .then((response) => {
        const subscription: SubscriptionType = {
          planId: response.planId,
          subscriptionType: response.subscriptionType,
          addOnIds: JSON.parse(response.addOnIds || "[]"),
          isActive: response.isActive,
          startedDate: response.startedDate,
          plan: response.plan,
          addOns: response.addOns || [],
        };
        setSubscription([subscription]);
        console.log("Subscription:", subscription);
      })
      .catch((error) => {
        console.error("Error fetching subscription:", error);
      });
  }

  useEffect(() => {
    getAddOns();
    getSubscription();
  }, []);

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(
      (prev) =>
        prev.includes(addOnId)
          ? prev.filter((id) => id !== addOnId) //remove add on if already selected
          : [...prev, addOnId], //add on if not
    );
  };

  const handleSubmit = async () => {
    const subscriptionData = subscription[0]; // Adjust if subscription is not an array

    if (!subscriptionData) return;

    setLoading(true);

    const updatedSubscription = {
      planId: subscriptionData.planId,
      subscriptionType: subscriptionData.subscriptionType,
      addOnIds: JSON.stringify(selectedAddOns),
      isActive: subscriptionData.isActive,
      startedDate: subscriptionData.startedDate,
      plan: subscriptionData.plan,
      addOns: subscriptionData.addOns,
    };

    try {
      await API.put("form", "/updateSubscription", {
        body: updatedSubscription,
      });
      goToNextStep();
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedAddOns);

  return (
    <div className={style.formContainer}>
      <div className={style.smallContainer}>
        <div className={style.header}>
          <h1>Pick add-ons</h1>
          <p>Add-ons help enhance your gaming experience</p>
        </div>
        {addOns.map((addOn) => (
          <AddOnsFrom
            key={addOn.addOnId}
            addOn={addOn}
            id={addOn.addOnId}
            isChecked={selectedAddOns.includes(addOn.addOnId)}
            onToggle={handleAddOnToggle}
          />
        ))}
      </div>
      <div className={style.buttons}>
        <button className={style.back} onClick={goToPreviousStep}>
          Go Back
        </button>
        <button
          disabled={loading}
          className={style.next}
          type="submit"
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
};
