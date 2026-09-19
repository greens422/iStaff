export type Role = "coordinator" | "staff";

export type Profile = { id: string; role: Role; name: string };

export type AskDetails = {
  indoorOutdoor: string;
  transportationComp: string;
  whatToBring: string;
  contactInfo: string;
};

export type EventRow = {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  staffNeeded: number;
  staffType: string;
  requiredCertifications: string[];
  askDetails: AskDetails;
  createdBy: string;
};

export type ApplicationStatus = "interested" | "approved" | "rejected";

export type Application = {
  id: string;
  eventId: string;
  staffId: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type Database = {
  profiles: Profile[];
  events: EventRow[];
  applications: Application[];
};
