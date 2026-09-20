import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad" | "neutral" | "info";

const toneClasses: Record<Tone, string> = {
  good: "bg-forest-soft text-forest",
  warn: "bg-amber-soft text-amber",
  bad: "bg-brick-soft text-brick-dark",
  neutral: "bg-paper text-ink-muted",
  info: "bg-steel-soft text-steel",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
