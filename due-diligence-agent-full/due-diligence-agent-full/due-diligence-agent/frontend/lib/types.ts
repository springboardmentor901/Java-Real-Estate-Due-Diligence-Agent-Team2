// Shared TypeScript types mirroring the backend DTOs
// (src/main/java/com/realestate/duediligenceagent/dto/*.java and entity/*.java)

export type Role =
  | "BUYER"
  | "REAL_ESTATE_AGENT"
  | "LEGAL_REVIEWER"
  | "FINANCIAL_INSTITUTION"
  | "ADMINISTRATOR";

export type ReportStatus = "REQUESTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export type ReportRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "GENERATED";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  price: number | null;
  propertyType: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

export interface AddressValidationResponse {
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

// Generic wrapper the backend uses so one failed due-diligence source
// doesn't take down the whole aggregated response.
export interface ReportSection<T> {
  data: T | null;
  status: "SUCCESS" | "FAILED";
  errorMessage: string | null;
}

export interface OwnershipRecord {
  id: number;
  propertyId: number;
  ownerName: string;
  secondOwnerName: string | null;
  ownershipType: string | null;
  mailingAddress: string | null;
  saleDate: string | null;
  saleAmount: number | null;
}

export interface TaxHistoryRecord {
  id: number;
  propertyId: number;
  taxYear: number;
  assessedValue: number | null;
  taxAmount: number | null;
  marketValue: number | null;
}

export interface ZoningInfo {
  id: number;
  propertyId: number;
  zoningCode: string | null;
  zoningDescription: string | null;
  landUse: string | null;
  parcelId: string | null;
}

export interface FloodZoneInfo {
  id: number;
  propertyId: number;
  floodZone: string | null;
  floodZoneSubtype: string | null;
  firmPanel: string | null;
  firmPanelEffectiveDate: string | null;
  inSpecialFloodHazardArea: boolean | null;
  elevationMeters: number | null;
  elevationFeet: number | null;
  checkedAt: string | null;
}

export interface Permit {
  id: number;
  propertyId: number;
  permitNumber: string | null;
  permitType: string | null;
  description: string | null;
  status: string | null;
  estimatedCost: number | null;
  issueDate: string | null;
  expirationDate: string | null;
  contractorName: string | null;
}

export interface EnvironmentalRecord {
  id: number;
  propertyId: number;
  facilityName: string | null;
  registryId: string | null;
  programName: string | null;
  interestType: string | null;
  siteStatus: string | null;
  summaryRisk: string | null;
}

export interface Utility {
  id: number;
  propertyId: number;
  utilityType: string;
  providerName: string | null;
  serviceStatus: string | null;
  accountNumber: string | null;
  monthlyAverageCost: number | null;
  source: string | null;
  updatedAt: string | null;
}

export interface UtilityRequest {
  utilityType: string;
  providerName: string;
  serviceStatus: string;
  accountNumber: string;
  monthlyAverageCost: number | null;
  source: string;
}

export interface DueDiligenceReport {
  propertyId: number;
  generatedAt: string;
  ownership: ReportSection<OwnershipRecord[]>;
  taxHistory: ReportSection<TaxHistoryRecord[]>;
  zoning: ReportSection<ZoningInfo>;
  floodZone: ReportSection<FloodZoneInfo>;
  permits: ReportSection<Permit[]>;
  environmentalRecords: ReportSection<EnvironmentalRecord[]>;
  utilityInformation: ReportSection<Utility[]>;
}

export interface TimelineEntry {
  date: string;
  label: string;
  description: string;
}

export interface RiskAssessmentItem {
  category: string;
  indicator: string;
  score: number;
  notes: string | null;
}

export interface CompleteReport {
  reportId: number;
  propertyId: number;
  requestedBy: string;
  status: ReportStatus;
  riskScore: number | null;
  executiveSummary: string | null;
  propertyTimeline: TimelineEntry[];
  assessments: RiskAssessmentItem[];
  createdAt: string;
}

export interface ReportRequest {
  requestId: number;
  propertyId: number;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  requesterName: string;
  requesterEmail: string;
  requestedAt: string;
  requestStatus: ReportRequestStatus;
  reportStatus: ReportStatus | null;
  reportId: number | null;
  riskScore: number | null;
}

// --- The following shapes are not backed by a live endpoint yet.
// They match what the frontend spec calls for so the UI is ready
// to light up as soon as the backend adds them. See README-FRONTEND.md.

export interface ComparableListing {
  id: number;
  address: string;
  price: number;
  distanceMiles: number;
  bedrooms: number;
  bathrooms: number;
  soldDate: string | null;
}

export interface MarketTrend {
  period: string;
  medianPrice: number;
}

export interface ValueHistoryPoint {
  date: string;
  value: number;
}

export interface NotificationItem {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
  reportId?: number;
}

export interface AdminSummary {
  totalUsers: number;
  totalPropertiesSearched: number;
  totalReportsGenerated: number;
  reportsLast7Days: number;
}

export interface AuditLogEntry {
  id: number;
  user: string;
  actionType: string;
  description: string;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
