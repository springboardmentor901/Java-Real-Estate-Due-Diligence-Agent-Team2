import { cn } from "@/lib/utils";

export default function Input({
  label,
  error,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass-soft",
          error && "border-brick focus:border-brick focus:ring-brick-soft",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-brick">{error}</p>}
    </div>
  );
}
