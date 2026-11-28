import type { Ridership } from "../types/ridership";

export const sumRidesByStation = (ridership: Ridership[]): Map<string, number> => {
  const ridesByStationId = new Map<string, number>();

  for (const ride of ridership) {
    const currRides = Number(ride.rides);
    const currStationRideTotal = ridesByStationId.get(ride.station_id) ?? 0;

    ridesByStationId.set(ride.station_id, currStationRideTotal + currRides);
  }

  return ridesByStationId;
};

export const averageRidesByStation = (ridership: Ridership[]): Map<string, number> => {
  const ridesByStationId = new Map<string, number>();
  const countByStationId = new Map<string, number>();

  for (const ride of ridership) {
    const currRides = Number(ride.rides);
    const currRideTotal = ridesByStationId.get(ride.station_id) ?? 0;
    const currCountTotal = countByStationId.get(ride.station_id) ?? 0;

    ridesByStationId.set(ride.station_id, currRideTotal + currRides);
    countByStationId.set(ride.station_id, currCountTotal + 1);
  }

  for (const [station_id, totalRides] of ridesByStationId) {
    const rowCount = countByStationId.get(station_id) ?? 1;
    ridesByStationId.set(station_id, Math.round(totalRides / rowCount));
  }

  return ridesByStationId;
};
