export type Role = "coordinator" | "staff";

export type Profile = { id: string; role: Role; name: string; joinedAt: string };

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

export type Certification = {
  id: string;
  staffId: string;
  name: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: string;
};

export type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
};

export type Database = {
  profiles: Profile[];
  events: EventRow[];
  applications: Application[];
  certifications: Certification[];
  messages: Message[];
};
