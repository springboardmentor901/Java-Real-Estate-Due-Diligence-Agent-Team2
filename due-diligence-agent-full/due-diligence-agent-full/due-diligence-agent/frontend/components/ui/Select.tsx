import { cn } from "@/lib/utils";

export default function Select({
  label,
  className,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass-soft",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
