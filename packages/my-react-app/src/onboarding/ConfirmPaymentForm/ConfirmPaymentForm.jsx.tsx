import styles from "./payment.module.css";
import { ReviewPayment } from "./ReviewPayment.tsx";
import style from "../PickAddOnsForm/addOns.module.css";
import { API, Auth } from "aws-amplify";
import { useEffect, useState } from "react";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserId(user.attributes.sub);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleChangePlan = () => {
    changePlan();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const currentSubscriptionItems = await API.get(
        "form",
        `/getSubscription/${userId}`,
        {},
      );

      const data = {
        ...currentSubscriptionItems,
        isActive: "true",
        startedDate: new Date().toISOString(),
      };

      const response = await API.put("form", `/updateSubscription/${userId}`, {
        body: data,
      });

      console.log("Update succsefull:", response);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
    lastStep();
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
        <button
          className={styles.confirm}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};
