import { AddOnsFrom } from "./AddOnsForm.tsx";
import style from "./addOns.module.css";
import { useState } from "react";
import { usePlan } from "../FormContext.tsx";

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const PickAddOnForm = ({ goToNextStep, goToPreviousStep }: Props) => {
  const [checkedBox, setCheckedBox] = useState<null | string>(null);

  const { isYearly, addOns, setAddOns, checkedAddOns } = usePlan();

  const checkBoxInfo = (id: string, isChecked: boolean) => {
    setCheckedBox(id);
    if (isChecked) {
      const addOnOptions = [
        {
          id: "1",
          title: "Online Service",
          description: "Acces to multiple games",
          price: isYearly ? 10 : 1,
        },
        {
          id: "2",
          title: "Larger storage",
          description: "Extra 1TB of cloud save",
          price: isYearly ? 20 : 2,
        },
        {
          id: "3",
          title: "Customizable Profile",
          description: "Custom theme on your profile",
          price: isYearly ? 20 : 2,
        },
      ];

      const selectAddOn = addOnOptions.find((addOn) => addOn.id === id);

      if (selectAddOn) {
        setAddOns({
          ...addOns,
          [id]: {
            title: selectAddOn.title,
            description: selectAddOn.description,
            price: selectAddOn.price,
          },
        });
      }
    } else {
      const newAddOns = { ...addOns };
      delete newAddOns[id];
      setAddOns(newAddOns);
    }
  };

  console.log(checkedAddOns);

  const addOnOptions = [
    {
      id: "1",
      title: "Online Service",
      description: "Acces to multiple games",
      price: isYearly ? 10 : 1,
    },
    {
      id: "2",
      title: "Larger storage",
      description: "Extra 1TB of cloud save",
      price: isYearly ? 20 : 2,
    },
    {
      id: "3",
      title: "Customizable Profile",
      description: "Custom theme on your profile",
      price: isYearly ? 20 : 2,
    },
  ];

  const checkedBoxId = addOnOptions.find((addOn) => addOn.id === checkedBox);
  console.log(checkedBoxId);

  return (
    <div className={style.formContainer}>
      <div className={style.smallContainer}>
        <div className={style.header}>
          <h1>Pick add-ons</h1>
          <p>Add-ons help enhance your gaming experience</p>
        </div>
        {addOnOptions.map((addOn) => (
          <AddOnsFrom {...addOn} key={addOn.id} checkedBoxInfo={checkBoxInfo} />
        ))}
      </div>
      <div className={style.buttons}>
        <button className={style.back} onClick={goToPreviousStep}>
          Go Back
        </button>
        <button className={style.next} onClick={goToNextStep}>
          Next Step
        </button>
      </div>
    </div>
  );
};
