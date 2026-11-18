export interface Ridership {
  station_id: string;
  stationname: string;
  date: string;
  daytype: "W" | "A" | "U";
  rides: string;
}
