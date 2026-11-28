import type { ServiceIds } from "./lines";

export interface LineAlert {
  AlertId: string;
  Headline: string;
  ShortDescription: string;
  Impact: string;
  EventStart: string;
  EventEnd: string | null;
  ImpactedService?: {
    Service?: ImpactedLine[];
  };
}

export interface ImpactedLine {
  ServiceType: string;
  ServiceId: ServiceIds;
}
