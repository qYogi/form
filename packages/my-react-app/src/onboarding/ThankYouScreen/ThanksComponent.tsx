import { CheckIcon } from "./CheckIcon.tsx";
import styles from "./thanks.module.css";

export const ThanksComponent = () => (
  <div className={styles.elementsContainer}>
    <CheckIcon />
    <h1>Thank you!</h1>
    <p>
      Thanks for confirming your subscription! We hope you have fun using our
      platform. If you ever need support, please feel free to email us at
      support@loremgaming.com.
    </p>
  </div>
);
