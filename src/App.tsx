import "./styles/global.scss";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { DataProvider } from "./store/DataContext";

const App = () => {
  return (
    <DataProvider>
      <main>
        <Dashboard />
      </main>
    </DataProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
