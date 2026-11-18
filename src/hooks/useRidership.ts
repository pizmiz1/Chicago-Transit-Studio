import { useEffect, useState } from "react";
import type { Ridership } from "../types/Ridership";

type LoadStatus = "initial" | "background" | "complete" | "error";

const endpoint = "https://data.cityofchicago.org/resource/5neh-572f.json";
const pageSize = 5000;
const maxRows = 50000;

const fetchPage = async (offset: number, signal: AbortSignal): Promise<Ridership[]> => {
  const params = new URLSearchParams({
    $limit: String(pageSize),
    $offset: String(offset),
    $order: "date DESC, station_id ASC",
  });

  const response = await fetch(`${endpoint}?${params}`, { signal: signal, cache: "no-cache" });
  if (!response.ok) {
    throw new Error("CTA Ridership request failed");
  }

  const data = (await response.json()) as Ridership[];

  return data;
};

export const useRidership = () => {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("initial");
  const [data, setData] = useState<Ridership[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const firstPage = await fetchPage(0, controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        setData(firstPage);
        if (firstPage.length < pageSize) {
          setLoadStatus("complete");
          return;
        }

        setLoadStatus("background");

        for (let offset = pageSize; offset < maxRows; offset = offset + pageSize) {
          const page = await fetchPage(offset, controller.signal);
          if (controller.signal.aborted) {
            return;
          }

          setData((curr) => [...curr, ...page]);
          if (page.length < pageSize) {
            break;
          }
        }

        setLoadStatus("complete");
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Could not load CTA ridership data.");
        setLoadStatus("error");
      }
    };

    load();

    return () => controller.abort();
  }, []);

  return { loadStatus, data, error };
};
