import styles from "./DataCards.module.scss";
import { Card } from "../../../components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertsCardPopover } from "./AlertsCardPopover";
import { useData } from "../../../store/DataContext";
import type { Station } from "../../../types/Station";
import type { Line } from "../../../types/Lines";

interface DataCardsProps {
  selectedStation: Station | undefined;
  selectedLines: Line[] | undefined;
  setSelectedStation: (newStation: Station | undefined) => void;
  setSelectedLines: (newLines: Line[] | undefined) => void;
}

export const DataCards = ({ selectedStation, selectedLines, setSelectedStation, setSelectedLines }: DataCardsProps) => {
  const { lineAlerts, ridership, stations } = useData();

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | undefined>();
  const [selectedAlertIndex, setSelectedAlertIndex] = useState<number | undefined>();

  const peakStation = useMemo(() => {
    const ridesByStationId = new Map<string, number>();

    for (const ride of ridership) {
      const currRides = Number(ride.rides);
      const currStationRideTotal = ridesByStationId.get(ride.station_id) ?? 0;
      ridesByStationId.set(ride.station_id, currStationRideTotal + currRides);
    }

    let topStationId: string | undefined;
    let maxRides = 0;

    for (const [stationId, rides] of ridesByStationId) {
      if (rides > maxRides) {
        topStationId = stationId;
        maxRides = rides;
      }
    }

    return stations.find((curr) => curr.map_id === topStationId);
  }, [ridership, stations]);

  const rides = useMemo(() => {
    let rides = 0;
    let ridershipToCheck = ridership;

    if (selectedStation) {
      ridershipToCheck = ridershipToCheck.filter((curr) => curr.station_id === selectedStation.map_id);
    }

    for (const ride of ridershipToCheck) {
      const currRides = Number(ride.rides);
      rides = rides + currRides;
    }

    return rides;
  }, [ridership, selectedStation]);

  const totalStateClear = useCallback(() => {
    setSelectedCardIndex(undefined);
    setSelectedLines(undefined);
    setSelectedStation(undefined);
    setSelectedAlertIndex(undefined);
  }, []);

  const dataCardClick = (index: number) => {
    // Alerts
    if (index === 1) {
      const alreadySelected = selectedCardIndex === 1;

      if (alreadySelected) {
        totalStateClear();
      } else {
        setSelectedCardIndex(1);
        setSelectedStation(undefined);
      }
    }
    // Peak Station
    else {
      const alreadySelected = selectedCardIndex === 2;

      if (alreadySelected) {
        setSelectedCardIndex(undefined);
        setSelectedStation(undefined);
      } else {
        setSelectedCardIndex(2);
        setSelectedLines(undefined);
        setSelectedAlertIndex(undefined);
        setSelectedStation(peakStation);
      }
    }
  };

  useEffect(() => {
    if (selectedCardIndex === undefined) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        totalStateClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCardIndex]);

  return (
    <div className={styles.container}>
      <Card style={{ flex: 1 }}>
        <div className={styles.cardContainer}>
          <p className={styles.headerText}>Total Filtered Ridership:</p>
          <p className={styles.dataText}>{rides?.toLocaleString("en-US")}</p>
        </div>
      </Card>
      <Card
        style={{ flex: 1 }}
        selected={selectedCardIndex === 1}
        onClick={() => {
          dataCardClick(1);
        }}
        onPointerDown={(event) => event.stopPropagation()}
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
          dataCardClick(2);
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className={styles.cardContainer}>
          <p className={styles.headerText}>Peak Station:</p>
          <p className={styles.dataText}>{peakStation?.station_name ?? "Loading..."}</p>
        </div>
      </Card>

      <AlertsCardPopover
        isVisible={selectedCardIndex === 1}
        selectedAlertIndex={selectedAlertIndex}
        setSelectedAlertIndex={setSelectedAlertIndex}
        setSelectedLines={setSelectedLines}
        setSelectedStation={setSelectedStation}
        onDismiss={totalStateClear}
      />
    </div>
  );
};
