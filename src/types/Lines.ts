export type Line = "G" | "B" | "R" | "Br" | "Pu" | "P" | "O" | "Y";

export type ServiceIds = "Red" | "Blue" | "Brn" | "G" | "Org" | "Pink" | "P" | "Y";

export const serviceIdsList: ServiceIds[] = ["Red", "Blue", "Brn", "G", "Org", "Pink", "P", "Y"];

export const serviceIdsToLinesMap: Record<ServiceIds, Line> = {
  Red: "R",
  Blue: "B",
  Brn: "Br",
  G: "G",
  Org: "O",
  Pink: "P",
  P: "Pu",
  Y: "Y",
};
