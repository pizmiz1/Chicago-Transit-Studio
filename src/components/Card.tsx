import styles from "./Card.module.scss";
import type { CSSProperties, MouseEventHandler, PointerEventHandler, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
}

export const Card = ({ children, style, selected, onClick, disabled, onPointerDown }: CardProps) => {
  if (selected !== undefined && onClick !== undefined) {
    return (
      <button
        type="button"
        className={`${styles.btn} ${selected ? styles.selected : ""} ${disabled ? styles.disabled : ""}`}
        style={style}
        aria-pressed={selected}
        onClick={onClick}
        disabled={disabled}
        onPointerDown={onPointerDown}
      >
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
