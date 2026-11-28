import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Ridership } from "../types/ridership";
import type { Station } from "../types/station";
import type { LineAlert } from "../types/lineAlert";
import { serviceIdsList } from "../types/lines";

type LoadStatus = "initial" | "background" | "complete" | "error";

interface Data {
  ridership: Ridership[];
  ridershipLoadStatus: LoadStatus;
  ridershipError: string | undefined;
  stations: Station[];
  stationsLoading: boolean;
  stationsError: string | undefined;
  lineAlerts: LineAlert[];
  lineAlertsLoading: boolean;
  lineAlertsError: string | undefined;
}

interface LineAlertResponse {
  CTAAlerts?: {
    ErrorCode: string;
    Alert?: LineAlert | LineAlert[];
  };
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<Data | null>(null);

const ridershipEndpoint = "https://data.cityofchicago.org/resource/5neh-572f.json";
const stationsEndpoint = "https://data.cityofchicago.org/resource/8pix-ypme.json";
const lineAlertsEndpoint = "/api/cta/alerts?activeonly=true";
const ridershipPageSize = 5000;
const ridershipMaxRows = 50000;
const lineAlertsPollInterval = 60000;

const fetchRidershipPage = async (offset: number, signal: AbortSignal): Promise<Ridership[]> => {
  const params = new URLSearchParams({
    $limit: String(ridershipPageSize),
    $offset: String(offset),
    $order: "date DESC, station_id ASC",
  });

  const response = await fetch(`${ridershipEndpoint}?${params}`, { signal: signal, cache: "no-cache" });
  if (!response.ok) {
    throw new Error("CTA Ridership request failed");
  }

  const data = (await response.json()) as Ridership[];

  return data;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [ridership, setRidership] = useState<Ridership[]>([]);
  const [ridershipLoadStatus, setRidershipLoadStatus] = useState<LoadStatus>("initial");
  const [ridershipError, setRidershipError] = useState<string>();

  const [stations, setStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [stationsError, setStationsError] = useState<string>();

  const [lineAlerts, setLineAlerts] = useState<LineAlert[]>([]);
  const [lineAlertsLoading, setLineAlertsLoading] = useState(true);
  const [lineAlertsError, setLineAlertsError] = useState<string>();

  // Ridership
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const firstPage = await fetchRidershipPage(0, controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        setRidership(firstPage);
        if (firstPage.length < ridershipPageSize) {
          setRidershipLoadStatus("complete");
          return;
        }

        setRidershipLoadStatus("background");

        for (let offset = ridershipPageSize; offset < ridershipMaxRows; offset = offset + ridershipPageSize) {
          const page = await fetchRidershipPage(offset, controller.signal);
          if (controller.signal.aborted) {
            return;
          }

          setRidership((curr) => [...curr, ...page]);
          if (page.length < ridershipPageSize) {
            break;
          }
        }

        setRidershipLoadStatus("complete");
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setRidershipError(err instanceof Error ? err.message : "Could not load CTA ridership data.");
        setRidershipLoadStatus("error");
      }
    };

    load();

    return () => controller.abort();
  }, []);

  // Stations
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const params = new URLSearchParams({
          $select: "map_id,station_name,red,blue,g,brn,p,y,pnk,o",
        });

        const response = await fetch(`${stationsEndpoint}?${params}`, {
          signal: controller.signal,
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error("CTA Stations request failed");
        }

        const data = (await response.json()) as Station[];
        if (controller.signal.aborted) {
          return;
        }

        const uniqueData = [...new Map(data.map((curr) => [curr.map_id, curr])).values()];

        setStations(uniqueData);
      } catch (err) {
        setStationsError(err instanceof Error ? err.message : "Could not load CTA station data.");
      } finally {
        if (controller.signal.aborted) {
          return;
        }

        setStationsLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  // Line Alerts
  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: number;

    const load = async () => {
      try {
        const response = await fetch(lineAlertsEndpoint, { signal: controller.signal, cache: "no-cache" });
        if (!response.ok) {
          throw new Error("CTA Line Alerts request failed");
        }

        const data = (await response.json()) as LineAlertResponse;
        const result = data.CTAAlerts;
        if (!result) {
          throw new Error("Unexpected CTA alerts response");
        }

        if (controller.signal.aborted) {
          return;
        }

        if (result.ErrorCode === "50") {
          setLineAlerts([]);
        } else if (result.ErrorCode !== "0") {
          throw new Error(`CTA alerts request failed: ${result.ErrorCode}`);
        } else {
          const alerts = result.Alert ? (Array.isArray(result.Alert) ? result.Alert : [result.Alert]) : [];

          const lineData: LineAlert[] = alerts.flatMap((alert) => {
            const services = alert.ImpactedService?.Service;
            const allServices = services ? (Array.isArray(services) ? services : [services]) : [];

            const trainServices = allServices
              .filter((service) => service.ServiceType === "R" && serviceIdsList.includes(service.ServiceId))
              .map(({ ServiceType, ServiceId }) => ({
                ServiceType: ServiceType,
                ServiceId: ServiceId,
              }));

            return trainServices.length
              ? [
                  {
                    AlertId: alert.AlertId,
                    Headline: alert.Headline,
                    ShortDescription: alert.ShortDescription,
                    Impact: alert.Impact,
                    EventStart: alert.EventStart,
                    EventEnd: alert.EventEnd,
                    ImpactedService: { Service: trainServices },
                  },
                ]
              : [];
          });

          lineData.sort((a, b) => Date.parse(b.EventStart) - Date.parse(a.EventStart));

          setLineAlerts(lineData);
        }
      } catch (err) {
        setLineAlertsError(err instanceof Error ? err.message : "Could not load CTA line alert data.");
      } finally {
        if (controller.signal.aborted) {
          return;
        }

        setLineAlertsLoading(false);
        timeoutId = setTimeout(() => load(), lineAlertsPollInterval);
      }
    };

    load();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const value: Data = {
    ridership: ridership,
    ridershipLoadStatus: ridershipLoadStatus,
    ridershipError: ridershipError,
    stations: stations,
    stationsLoading: stationsLoading,
    stationsError: stationsError,
    lineAlerts: lineAlerts,
    lineAlertsLoading: lineAlertsLoading,
    lineAlertsError: lineAlertsError,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }

  return context;
};
