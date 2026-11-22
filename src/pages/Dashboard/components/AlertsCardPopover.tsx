import { useData } from "../../../store/DataContext";
import styles from "./AlertsCardPopover.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { LineAlertDisplay } from "./LineAlertDisplay";
import { serviceIdsToLinesMap, type Line } from "../../../types/Lines";
import type { Station } from "../../../types/Station";
import { useEffect, useRef } from "react";

interface AlertsCardPopoverProps {
  isVisible: boolean;
  selectedAlertIndex: number | undefined;
  setSelectedAlertIndex: (newSelectedIndex: number | undefined) => void;
  setSelectedLines: (newLines: Line[] | undefined) => void;
  setSelectedStation: (newStation: Station | undefined) => void;
  onDismiss: () => void;
}

export const AlertsCardPopover = ({
  isVisible,
  selectedAlertIndex,
  setSelectedAlertIndex,
  setSelectedLines,
  setSelectedStation,
  onDismiss,
}: AlertsCardPopoverProps) => {
  const { lineAlerts, stations } = useData();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) {
        onDismiss();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={styles.container}
        >
          {lineAlerts.map((curr, index) => {
            return (
              <LineAlertDisplay
                key={curr.AlertId}
                lineAlert={curr}
                selected={selectedAlertIndex === index}
                onClick={(stationName: string) => {
                  const isSelected = selectedAlertIndex === index;

                  if (isSelected) {
                    setSelectedAlertIndex(undefined);
                    setSelectedLines(undefined);
                    setSelectedStation(undefined);
                  } else {
                    setSelectedAlertIndex(index);
                    setSelectedLines(curr.ImpactedService?.Service?.map(({ ServiceId }) => serviceIdsToLinesMap[ServiceId]));
                    setSelectedStation(stations.find(({ station_name }) => station_name === stationName));
                  }
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
