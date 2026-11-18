import styles from "./Card.module.scss";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Card = ({ children, style, selected, onClick }: CardProps) => {
  if (selected !== undefined && onClick !== undefined) {
    return (
      <button type="button" className={`${styles.btn} ${selected ? styles.selected : ""}`} style={style} aria-pressed={selected} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};
