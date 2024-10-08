import React, { useState } from "react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { SelectYourPlanForm } from "./SelectYourPlanForm";
import { Layout } from "./Layout";
import { PickAddOnForm } from "./PickAddOnsForm";
import { ConfirmPaymentForm } from "./ConfirmPaymentForm";
import { Panel } from "./Panel";
import { PlanProvider } from "./FormContext.tsx";
import { ThankYouScreen } from "./ThankYouScreen/ThankYouScreen.tsx";
import UseWindowWidth from "./Panel/UseWindowWidth.tsx";
import { useNavigate } from "react-router-dom";

export function OnboardingScreen() {
  const windowWidth = UseWindowWidth();
  const dynamicStyle: React.CSSProperties =
    windowWidth < 768
      ? { marginTop: "27rem", position: "absolute" }
      : { marginRight: "6.5rem", display: "flex", alignSelf: "center" };

  const [selectedFormIndexState, setSelectedFormIndex] = useState(0);
  const nav = useNavigate();

  const forms = [
    PersonalInfoForm,
    SelectYourPlanForm,
    PickAddOnForm,
    ConfirmPaymentForm,
    ThankYouScreen,
  ];

  const CurrentForm = forms[selectedFormIndexState];

  function goToNextStep() {
    setSelectedFormIndex((prev) => (prev + 1) % forms.length);
  }

  function goToPreviousStep() {
    setSelectedFormIndex((prev) => (prev - 1) % forms.length);
  }

  const changePlan = () => {
    setSelectedFormIndex(1);
  };

  const lastStep = () => {
    setSelectedFormIndex(4);
  };

  const goToProfile = () => {
    nav("/dashboard");
  };

  return (
    <PlanProvider>
      <Layout>
        <Panel currentStep={selectedFormIndexState} />
        <div style={dynamicStyle}>
          <CurrentForm
            goToPreviousStep={goToPreviousStep}
            goToNextStep={goToNextStep}
            changePlan={changePlan}
            lastStep={lastStep}
            {...(selectedFormIndexState === 4 && { goToProfile })}
          />
        </div>
      </Layout>
    </PlanProvider>
  );
}
