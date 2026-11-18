import type { Line } from "../types/Lines";
import styles from "./LineChip.module.scss";

interface LineChipProps {
  line: Line;
}

export const LineChip = ({ line }: LineChipProps) => {
  return (
    <div className={`${styles.container} ${styles[line]}`}>
      <p className={styles.text}>{line}</p>
    </div>
  );
};
