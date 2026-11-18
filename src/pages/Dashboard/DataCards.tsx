import styles from "./DataCards.module.scss";
import { Card } from "../../components/Card";
import { useState } from "react";

const headers = ["Total Filtered Ridership:", "Active Service Alerts:", "Peak Station:"];
// Will be replaced with real data
const mockData = ["5,250,130", "4 Delays", "Clark/Lake"];

export const DataCards = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | undefined>();

  return (
    <div className={styles.container}>
      {headers.map((curr, index) => {
        return (
          <Card
            style={{ flex: 1 }}
            selected={index === selectedCardIndex}
            onClick={() => {
              setSelectedCardIndex(index);
            }}
          >
            <div className={styles.cardContainer}>
              <p className={styles.headerText}>{curr}</p>
              <p className={styles.dataText}>{mockData[index]}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
