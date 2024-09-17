import { CheckIcon } from "./CheckIcon.tsx";
import styles from "./thanks.module.css";
import planStyles from "../SelectYourPlanForm/plan.module.css";
import { useActiveSubscriptionContext } from "../../components/HasSubscriptionActivatedContext.tsx";

interface Props {
  goToProfile?: () => void;
}

export const ThanksComponent = ({ goToProfile }: Props) => {
  const { refetchsubscriptionStatus } = useActiveSubscriptionContext();
  const handlerGoToDashboard = async () => {
    await refetchsubscriptionStatus();
    goToProfile && goToProfile();
  };

  return (
    <>
      <div className={styles.elementsContainer}>
        <CheckIcon />
        <h1>Thank you!</h1>
        <p>
          Thanks for confirming your subscription! We hope you have fun using
          our platform. If you ever need support, please feel free to email us
          at support@loremgaming.com.
        </p>
      </div>
      <button className={planStyles.next} onClick={handlerGoToDashboard}>
        Dashboard
      </button>
    </>
  );
};
