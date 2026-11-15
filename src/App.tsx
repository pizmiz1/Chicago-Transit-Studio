import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <main>
      <h1>Chicago Transit Studio</h1>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
