export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function roleLabel(role: string): string {
  switch (role) {
    case "BUYER":
      return "Buyer";
    case "REAL_ESTATE_AGENT":
      return "Real Estate Agent";
    case "LEGAL_REVIEWER":
      return "Legal Reviewer";
    case "FINANCIAL_INSTITUTION":
      return "Financial Institution";
    case "ADMINISTRATOR":
      return "Administrator";
    default:
      return role;
  }
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function scoreTone(score: number | null | undefined): "good" | "warn" | "bad" | "neutral" {
  if (score === null || score === undefined) return "neutral";
  if (score < 34) return "good";
  if (score < 67) return "warn";
  return "bad";
}
