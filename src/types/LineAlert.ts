import type { ServiceIds } from "./Lines";

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
