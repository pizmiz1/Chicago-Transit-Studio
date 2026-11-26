import styles from "./Dashboard.module.scss";
import { useState } from "react";
import { DataCards } from "./DataCards/DataCards";
import type { Line } from "../../types/Lines";
import type { Station } from "../../types/Station";
import { Header } from "./Header/Header";

export const Dashboard = () => {
  const [selectedStation, setSelectedStation] = useState<Station | undefined>();
  const [selectedLines, setSelectedLines] = useState<Line[] | undefined>();
  const [search, setSearch] = useState("");
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);

  return (
    <div className={styles.container}>
      <Header search={search} setSearch={setSearch} searchPopoverVisible={searchPopoverVisible} setSearchPopoverVisible={setSearchPopoverVisible} />

      <DataCards
        selectedStation={selectedStation}
        selectedLines={selectedLines}
        setSelectedStation={setSelectedStation}
        setSelectedLines={setSelectedLines}
        searchPopoverVisible={searchPopoverVisible}
      />
    </div>
  );
};
