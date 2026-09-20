import { cn } from "@/lib/utils";
import Card from "./Card";

export default function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
