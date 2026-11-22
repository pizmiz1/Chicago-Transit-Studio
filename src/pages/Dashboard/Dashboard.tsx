import { useState } from "react";
import { useData } from "../../store/DataContext";
import { DataCards } from "./components/DataCards";
import type { Line } from "../../types/Lines";
import type { Station } from "../../types/Station";

export const Dashboard = () => {
  const { ridershipLoadStatus, stationsLoading, lineAlertsLoading } = useData();

  const [selectedStation, setSelectedStation] = useState<Station | undefined>();
  const [selectedLines, setSelectedLines] = useState<Line[] | undefined>();

  return (
    <div>
      <h1 style={{ fontSize: "4rem" }}>{ridershipLoadStatus}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(stationsLoading)}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(lineAlertsLoading)}</h1>

      <DataCards
        selectedStation={selectedStation}
        selectedLines={selectedLines}
        setSelectedStation={setSelectedStation}
        setSelectedLines={setSelectedLines}
      />
    </div>
  );
};
