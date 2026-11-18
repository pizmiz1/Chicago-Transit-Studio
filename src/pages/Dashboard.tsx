import { useLineAlerts } from "../hooks/useLineAlerts";
import { useRidership } from "../hooks/useRidership";
import { useStations } from "../hooks/useStations";

const Dashboard = () => {
  const ridership = useRidership();
  const stations = useStations();
  const lineAlerts = useLineAlerts();

  return (
    <div>
      <h1 style={{ fontSize: "4rem" }}>{ridership.loadStatus}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(stations.loading)}</h1>
      <h1 style={{ fontSize: "4rem" }}>{String(lineAlerts.loading)}</h1>
    </div>
  );
};

export default Dashboard;
