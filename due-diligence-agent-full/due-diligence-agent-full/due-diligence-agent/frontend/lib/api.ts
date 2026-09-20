// Central API client. Every backend call in the app goes through here so the
// base URL, auth header, and error shape stay consistent in one place.
//
// See section 4 of the frontend spec for the endpoint list this mirrors.
// Every endpoint below now has a matching controller on the backend (see
// README-FRONTEND.md for a couple of endpoints where the backend's actual
// behavior differs slightly from the spec's wording).

import type {
  AddressValidationResponse,
  AdminSummary,
  AuditLogEntry,
  AuthUser,
  CompleteReport,
  DueDiligenceReport,
  LoginRequest,
  MarketTrend,
  NotificationItem,
  Page,
  Property,
  RegisterRequest,
  TimelineEntry,
  Utility,
  UtilityRequest,
  ValueHistoryPoint,
  ComparableListing,
  ReportRequest,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const TOKEN_KEY = "dda_token";
export const USER_KEY = "dda_user";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Could not reach the server. Please try again.");
  }

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (body && (body.error || body.message)) ||
      (typeof body === "string" ? body : null) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return body as T;
}

async function download(path: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new ApiError(res.status, `Download failed (${res.status})`);
  }
  return res.blob();
}

function qs(params: object): string {
  const usp = new URLSearchParams();
  Object.entries(params as Record<string, string | number | boolean | undefined>).forEach(
    ([k, v]) => {
      if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
    }
  );
  const s = usp.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authApi = {
  register: (data: RegisterRequest) =>
    request<{
      id: number;
      fullName: string;
      email: string;
      role: string;
      createdAt: string;
    }>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: LoginRequest) =>
    request<{
      token: string;
      message: string;
      id: number;
      fullName: string;
      email: string;
      role: AuthUser["role"];
    }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------
export interface BrowsePropertiesParams {
  page?: number;
  size?: number;
  sort?: string;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
}

export const propertiesApi = {
  // The backend now returns Spring's standard Page<> JSON shape
  // ({content, totalElements, totalPages, number, size, ...}) for
  // GET /api/properties. We still handle the plain-array shape too so
  // this keeps working against any older/mocked backend.
  browse: async (params: BrowsePropertiesParams = {}): Promise<Page<Property>> => {
    const result = await request<Property[] | Page<Property>>(
      `/api/properties${qs(params)}`
    );
    if (Array.isArray(result)) {
      const size = params.size ?? result.length ?? 10;
      return {
        content: result,
        totalElements: result.length,
        totalPages: 1,
        number: 0,
        size,
      };
    }
    return result;
  },

  search: (address: string) =>
    request<Property[]>(`/api/properties/search${qs({ address })}`),

  getById: (id: number | string) => request<Property>(`/api/properties/${id}`),

  validateAddress: (address: string) =>
    request<AddressValidationResponse>("/api/properties/validate_address", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),

  getDueDiligence: (id: number | string) =>
    request<DueDiligenceReport>(`/api/properties/${id}/due-diligence`),

  getTimeline: (id: number | string) =>
    request<TimelineEntry[]>(`/api/properties/${id}/history`),

  runRiskAssessment: (id: number | string) =>
    request<CompleteReport>(`/api/properties/${id}/risk-assessment`, {
      method: "POST",
    }),

  // Utilities (manual data, full CRUD already implemented on the backend)
  getUtilities: (id: number | string) =>
    request<Utility[]>(`/api/properties/${id}/utilities`),
  addUtility: (id: number | string, data: UtilityRequest) =>
    request<Utility>(`/api/properties/${id}/utilities`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUtility: (
    id: number | string,
    utilityId: number | string,
    data: UtilityRequest
  ) =>
    request<Utility>(`/api/properties/${id}/utilities/${utilityId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUtility: (id: number | string, utilityId: number | string) =>
    request<void>(`/api/properties/${id}/utilities/${utilityId}`, {
      method: "DELETE",
    }),

  // Comparables, market trends, and value history are derived by the
  // backend from properties/tax records already in the database (there's
  // no external comps feed integrated) — see PropertyAnalyticsService.
  getComparables: (id: number | string) =>
    request<ComparableListing[]>(`/api/properties/${id}/comparables`),
  getMarketTrends: (id: number | string) =>
    request<MarketTrend[]>(`/api/properties/${id}/comparables/trends`),
  getValueHistory: (id: number | string) =>
    request<ValueHistoryPoint[]>(`/api/properties/${id}/value-history`),
};

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reportsApi = {
  request: (propertyId: number | string) =>
    request<ReportRequest>(`/api/properties/${propertyId}/report-requests`, {
      method: "POST",
    }),

  getById: (id: number | string) => request<CompleteReport>(`/api/reports/${id}`),

  listByUser: (user?: string) =>
    request<CompleteReport[]>(`/api/reports${qs({ user })}`),

  // Hand-generated by the backend (no PDF/Excel library dependency was
  // reachable in that build environment) — see ReportDocumentService.
  downloadPdfUrl: (id: number | string) => `${API_BASE_URL}/api/reports/${id}/pdf`,
  downloadExcelUrl: (id: number | string) =>
    `${API_BASE_URL}/api/reports/${id}/excel`,
  downloadPdf: (id: number | string) => download(`/api/reports/${id}/pdf`),
  downloadExcel: (id: number | string) => download(`/api/reports/${id}/excel`),
};

export const reportRequestsApi = {
  listMine: () => request<ReportRequest[]>("/api/report-requests/my"),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationsApi = {
  listByUser: (user?: string) =>
    request<NotificationItem[]>(`/api/notifications${qs({ user })}`),
};

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export const profileApi = {
  get: () => request<AuthUser>("/api/users/profile"),
  update: (data: Partial<Pick<AuthUser, "fullName" | "email">>) =>
    request<AuthUser>("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<void>("/api/users/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const adminApi = {
  getSummary: () => request<AdminSummary>("/api/admin/dashboard/summary"),
  getAuditLogs: (params: {
    user?: string;
    actionType?: string;
    from?: string;
    to?: string;
  }) => request<AuditLogEntry[]>(`/api/admin/audit-logs${qs(params)}`),
  getReportRequests: () => request<ReportRequest[]>("/api/admin/report-requests"),
  approveReportRequest: (requestId: number) =>
    request<ReportRequest>(`/api/admin/report-requests/${requestId}/approve`, { method: "POST" }),
  rejectReportRequest: (requestId: number) =>
    request<ReportRequest>(`/api/admin/report-requests/${requestId}/reject`, { method: "POST" }),
};

export { API_BASE_URL };
