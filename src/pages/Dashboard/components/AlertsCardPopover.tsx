import styles from "./AlertsCardPopover.module.scss";
import { AnimatePresence, motion } from "motion/react";

interface AlertsCardPopoverProps {
  isVisible: boolean;
}

export const AlertsCardPopover = ({ isVisible }: AlertsCardPopoverProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={styles.container}
        >
          <h1>Test</h1>
          <h1>Test</h1>
          <h1>Test</h1>
          <h1>Test</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
