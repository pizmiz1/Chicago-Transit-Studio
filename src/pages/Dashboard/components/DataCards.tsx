import styles from "./DataCards.module.scss";
import { Card } from "../../../components/Card";
import { useState } from "react";
import { AlertsCardPopover } from "./AlertsCardPopover";
import { useData } from "../../../store/DataContext";

export const DataCards = () => {
  const { lineAlerts } = useData();

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | undefined>();

  return (
    <div className={styles.container}>
      <Card style={{ flex: 1 }}>
        <div className={styles.cardContainer}>
          <p className={styles.headerText}>Total Filtered Ridership:</p>
          <p className={styles.dataText}>5,250,130</p>
        </div>
      </Card>
      <Card
        style={{ flex: 1 }}
        selected={selectedCardIndex === 1}
        onClick={() => {
          setSelectedCardIndex((prev) => (prev === 1 ? undefined : 1));
        }}
      >
        <div className={styles.cardContainer}>
          <p className={styles.headerText}>Active Service Alerts:</p>
          <p className={styles.dataText}>{lineAlerts.length} Alerts</p>
        </div>
      </Card>
      <Card
        style={{ flex: 1 }}
        selected={selectedCardIndex === 2}
        onClick={() => {
          setSelectedCardIndex((prev) => (prev === 2 ? undefined : 2));
        }}
      >
        <div className={styles.cardContainer}>
          <p className={styles.headerText}>Peak Station:</p>
          <p className={styles.dataText}>Clark/Lake</p>
        </div>
      </Card>

      <AlertsCardPopover isVisible={selectedCardIndex === 1} />
    </div>
  );
};
