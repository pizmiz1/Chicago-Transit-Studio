import { useEffect, useState } from "react";
import type { Station } from "../types/Station";

const endpoint = "https://data.cityofchicago.org/resource/8pix-ypme.json";

export const useStations = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Station[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const params = new URLSearchParams({
          $select: "map_id,red,blue,g,brn,p,y,pnk,o",
        });

        const response = await fetch(`${endpoint}?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("CTA Stations request failed");
        }

        const data = (await response.json()) as Station[];
        if (controller.signal.aborted) {
          return;
        }

        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load CTA station data.");
      } finally {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  return { loading, data, error };
};
