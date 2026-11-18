import { useData } from "../../store/DataContext";
import { DataCards } from "./components/DataCards";

export const Dashboard = () => {
  const { ridershipLoadStatus, stationsLoading, lineAlertsLoading } = useData();

  return (
    <div>
      <h1 style={{ fontSize: "4rem" }}>{ridershipLoadStatus}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(stationsLoading)}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(lineAlertsLoading)}</h1>

      <DataCards />
    </div>
  );
};
