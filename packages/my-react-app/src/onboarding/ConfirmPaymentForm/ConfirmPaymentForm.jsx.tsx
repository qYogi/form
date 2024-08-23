import styles from "./payment.module.css";
import { ReviewPayment } from "./ReviewPayment.tsx";
import style from "../PickAddOnsForm/addOns.module.css";

interface Props {
  goToPreviousStep: () => void;
  changePlan: () => void;
  lastStep: () => void;
}

export const ConfirmPaymentForm = ({
  goToPreviousStep,
  changePlan,
  lastStep,
}: Props) => {
  const handleChangePlan = () => {
    changePlan();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Finishing up</h1>
          <p>Double-check everything looks OK before confirming.</p>
        </div>
        <ReviewPayment changePlan={handleChangePlan} />
      </div>
      <div className={style.buttons}>
        <button className={styles.back} onClick={goToPreviousStep}>
          Go Back
        </button>
        <button className={styles.confirm} onClick={lastStep}>
          Confirm
        </button>
      </div>
    </div>
  );
};
