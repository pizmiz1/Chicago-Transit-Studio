import { Search } from "lucide-react";
import styles from "./Header.module.scss";
import { useData } from "../../../store/DataContext";

interface HeaderProps {
  search: string;
  setSearch: (newSearch: string) => void;
}

export const Header = ({ search, setSearch }: HeaderProps) => {
  const { ridership, ridershipLoadStatus } = useData();

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img className={styles.logoImg} src="/favicon.svg" alt="Chicago Transit Studio" />
        <h1 className={styles.logoText}>Chicago Transit Studio</h1>
      </div>

      <div className={styles.searchContainer}>
        <label className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} aria-hidden="true" />
          <input
            className={styles.searchInput}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            type="search"
            aria-label="Search stations, lines, or alerts"
            placeholder="Search stations, lines, or alerts..."
          />
        </label>
      </div>

      <div className={styles.statusContainer}>
        <div className={styles.statusBox}>
          <div
            className={`${styles.statusDot} ${ridershipLoadStatus === "complete" ? styles.liveDot : ridershipLoadStatus === "error" ? styles.errorDot : styles.loadingDot}`}
          />
          <p className={styles.statusText}>
            {ridershipLoadStatus === "complete"
              ? `Live • ${ridership.length.toLocaleString()} Rows`
              : ridershipLoadStatus === "error"
                ? "Error"
                : "Syncing..."}
          </p>
        </div>
      </div>
    </div>
  );
};
