import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <As
      className={cn(
        "rounded-md border border-line bg-surface",
        className
      )}
    >
      {children}
    </As>
  );
}
