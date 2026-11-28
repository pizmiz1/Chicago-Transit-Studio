import { Bell, ClockAlert, Construction, Info, Split, type LucideIcon } from "lucide-react";
import { LineChip } from "../../../components/LineChip";
import type { LineAlert } from "../../../types/lineAlert";
import { serviceIdsToLinesMap } from "../../../types/lines";
import styles from "./LineAlertDisplay.module.scss";
import { stationNames } from "../../../types/station";

type Status = "Planned Work" | "Major Delay" | "Minor Delay" | "Special Note" | "Other";

const statusIconMap: Record<Status, LucideIcon> = {
  "Planned Work": Construction,
  "Major Delay": Split,
  "Minor Delay": ClockAlert,
  "Special Note": Info,
  Other: Bell,
};

const statusIconColorMap: Record<Status, string> = {
  "Planned Work": "#3B82F6",
  "Major Delay": "#EF4444",
  "Minor Delay": "#F59E0B",
  "Special Note": "#50ca6d",
  Other: "#50ca6d",
};

interface LineAlertDisplayProps {
  lineAlert: LineAlert;
  selected: boolean;
  onClick: (stationName: string) => void;
}

export const LineAlertDisplay = ({ lineAlert, selected, onClick }: LineAlertDisplayProps) => {
  const affectedServiceIds = lineAlert.ImpactedService?.Service?.map((curr) => curr.ServiceId) ?? [];
  const lineColors = affectedServiceIds.map((curr) => serviceIdsToLinesMap[curr]);
  const impact = lineAlert.Impact;
  let status: Status;

  if (impact.includes("Major Delay")) {
    status = "Major Delay";
  } else if (impact.includes("Minor Delay")) {
    status = "Minor Delay";
  } else if (impact.includes("Work") || impact.includes("Elevator")) {
    status = "Planned Work";
  } else if (impact.includes("Special")) {
    status = "Special Note";
  } else {
    status = "Other";
  }

  const Icon = statusIconMap[status];
  const statusColor = statusIconColorMap[status];

  const normalize = (text: string): string =>
    ` ${text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()} `;

  const normalizedHeadline = normalize(lineAlert.Headline);
  const matchedStation = stationNames
    .filter((name) => normalizedHeadline.includes(normalize(name)))
    .sort((a, b) => normalize(b).length - normalize(a).length)[0];

  const stationText = matchedStation ?? "Station Not Specified";

  const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "always",
  });

  const timestamp = new Date(lineAlert.EventStart).getTime();

  if (Number.isNaN(timestamp)) {
    return "Unknown start time";
  }

  const seconds = (timestamp - Date.now()) / 1000;
  const absoluteSeconds = Math.abs(seconds);
  let displayTime: string;

  if (absoluteSeconds < 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds), "second");
  } else if (absoluteSeconds < 60 * 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / 60), "minute");
  } else if (absoluteSeconds < 24 * 60 * 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / 3600), "hour");
  } else if (absoluteSeconds < 7 * 24 * 60 * 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / 86400), "day");
  } else if (absoluteSeconds < 30 * 24 * 60 * 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / 604800), "week");
  } else if (absoluteSeconds < 365 * 24 * 60 * 60) {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / (30 * 86400)), "month");
  } else {
    displayTime = relativeTimeFormatter.format(Math.round(seconds / (365 * 86400)), "year");
  }

  return (
    <button
      type="button"
      className={`${styles.container} ${selected ? styles.selected : ""}`}
      aria-pressed={selected}
      onClick={() => {
        onClick(stationText);
      }}
    >
      <div className={lineColors.length > 2 ? styles.multiChipContainer : styles.chipContainer}>
        {lineColors.map((curr, index) => {
          switch (index) {
            case 0: {
              return (
                <div key={curr} className={styles.chip1}>
                  <LineChip line={curr} />
                </div>
              );
            }
            case 1: {
              return (
                <div key={curr} className={styles.chip2}>
                  <LineChip line={curr} />
                </div>
              );
            }
            case 2: {
              return (
                <div key={curr} className={styles.chip3}>
                  <div className={styles.chip3Chip}>
                    <p className={styles.chip3Text}>+{lineColors.length - 2}</p>
                  </div>
                </div>
              );
            }
          }
        })}
      </div>

      <div className={styles.textContainer}>
        <p className={styles.headerText} style={{ color: statusColor }}>
          {status}
        </p>
        <p className={styles.stationText}>{stationText}</p>
        <p className={styles.timeText}>Approx. {displayTime}</p>
      </div>

      <div className={styles.iconContainer}>
        <Icon color={statusColor} size={40} />
      </div>
    </button>
  );
};
