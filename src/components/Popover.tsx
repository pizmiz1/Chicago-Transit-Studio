import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./Popover.module.scss";
import { AnimatePresence, motion } from "motion/react";

interface PopoverProps {
  children: ReactNode;
  isVisible: boolean;
  onDismiss: () => void;
  style?: CSSProperties;
  arrow?: boolean;
}

export const Popover = ({ children, isVisible, onDismiss, style, arrow }: PopoverProps) => {
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
          className={`${styles.container} ${arrow ? styles.arrow : ""}`}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
