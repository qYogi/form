import { ThanksComponent } from "./ThanksComponent.tsx";
import styles from "./thanks.module.css";

interface Props {
  goToProfile?: () => void;
}

export const ThankYouScreen = ({ goToProfile }: Props) => (
  <div className={styles.container}>
    <ThanksComponent goToProfile={goToProfile} />
  </div>
);
