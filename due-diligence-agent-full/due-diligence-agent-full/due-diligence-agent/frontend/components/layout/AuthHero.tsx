const CHECKS = [
  { name: "Ownership", detail: "Chain of title, liens, and encumbrances" },
  { name: "Zoning", detail: "Current classification and use restrictions" },
  { name: "Flood risk", detail: "FEMA zone and historical flood events" },
  { name: "Permits", detail: "Open, expired, and unpermitted work" },
  { name: "Tax history", detail: "Assessed value and amounts due" },
];

export default function AuthHero() {
  return (
    <div className="relative hidden w-[380px] shrink-0 flex-col justify-between bg-ink px-10 py-12 lg:flex">
      <div>
        <p className="font-[family-name:var(--font-display)] text-2xl font-medium text-paper">
            Real Estate Due Diligence
        </p>
        <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-paper/60">
          One record for everything a property needs to clear before closing.
        </p>
      </div>

      <ul className="flex flex-col gap-5">
        {CHECKS.map((c) => (
          <li key={c.name} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brass" aria-hidden />
            <div>
              <p className="text-sm font-medium text-paper">{c.name}</p>
              <p className="text-xs text-paper/50">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-paper/40">Due diligence, on the record.</p>
    </div>
  );
}
