import { useEffect, useState } from "react";
import type { LineAlert } from "../types/LineAlert";

const lines = ["Red", "Blue", "Brn", "G", "Org", "Pink", "P", "Y"];
const endpoint = "/api/cta/routes";
const pollInterval = 60000;

interface LineAlertResponse {
  CTARoutes?: { RouteInfo?: LineAlert[] };
}

export const useLineAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineAlert[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: number;

    const load = async () => {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("CTA Line Alerts request failed");
        }

        const data = (await response.json()) as LineAlertResponse;
        const routes = data.CTARoutes?.RouteInfo;
        if (!routes) {
          throw new Error("Unexpected CTA response");
        }

        if (controller.signal.aborted) {
          return;
        }

        const lineData = routes
          .filter((route) => lines.includes(route.ServiceId))
          .map((curr) => ({
            Route: curr.Route,
            ServiceId: curr.ServiceId,
            RouteStatus: curr.RouteStatus,
            RouteColorCode: curr.RouteColorCode,
          }));

        setData(lineData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load CTA station data.");
      } finally {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        timeoutId = setTimeout(() => load(), pollInterval);
      }
    };

    load();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return { loading, data, error };
};
