import { Search } from "lucide-react";
import styles from "./Header.module.scss";
import { useData } from "../../../store/DataContext";
import { Popover } from "../../../components/Popover";
import { useMemo, useState } from "react";
import { averageRidesByStation } from "../../../helpers/dataHelper";
import type { Station } from "../../../types/station";

interface HeaderProps {
  searchPopoverVisible: boolean;
  setSearchPopoverVisible: (newVisible: boolean) => void;
}

export const Header = ({ searchPopoverVisible, setSearchPopoverVisible }: HeaderProps) => {
  const { ridership, stations, ridershipLoadStatus } = useData();

  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const ridesByStationId = useMemo(() => {
    return averageRidesByStation(ridership);
  }, [ridership]);

  let filteredStations: Station[] = [];

  if (query.length > 0) {
    filteredStations = stations
      .filter((station) => station.station_name.toLowerCase().includes(query))
      .sort((stationA, stationB) => {
        const ridesA = ridesByStationId.get(stationA.map_id) ?? 0;
        const ridesB = ridesByStationId.get(stationB.map_id) ?? 0;

        return ridesB - ridesA;
      });
  }

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
              if (event.target.value.trim().length > 0) {
                setSearchPopoverVisible(true);
              } else {
                setSearchPopoverVisible(false);
              }
            }}
            onFocus={() => {
              if (!searchPopoverVisible && search.trim().length > 0) {
                setSearchPopoverVisible(true);
              }
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

      <Popover
        isVisible={searchPopoverVisible}
        onDismiss={() => {
          setSearchPopoverVisible(false);
        }}
        style={{ top: "90%", left: "35.25%" }}
      >
        <div className={styles.searchPopoverSection}>
          <p className={styles.searchPopoverSectionHeaderText}>Stations</p>
          {filteredStations.slice(0, 5).map((station) => {
            return (
              <p key={station.map_id}>
                {station.station_name}: {(ridesByStationId.get(station.map_id) ?? 0).toLocaleString("en-US")} avg rides
              </p>
            );
          })}
          {filteredStations.length > 5 && (
            <div className={styles.stationResultsBanner}>
              <p className={styles.stationResultsText}>Showing top 5 of {filteredStations.length} — type more to refine</p>
            </div>
          )}
        </div>
        <div className={styles.searchPopoverSection}>
          <p className={styles.searchPopoverSectionHeaderText}>Active Alerts</p>
        </div>
      </Popover>
    </div>
  );
};
