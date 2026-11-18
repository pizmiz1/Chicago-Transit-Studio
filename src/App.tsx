import "./styles/global.scss";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./pages/Dashboard/Dashboard";

const App = () => {
  return (
    <main>
      <Dashboard />
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
