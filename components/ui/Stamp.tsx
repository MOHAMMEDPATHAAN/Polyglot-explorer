import { cn } from "@/lib/utils";

export function Stamp({
  children,
  size = 64,
  className,
  color = "var(--accent)",
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={cn("stamp font-display font-semibold leading-none", className)}
      style={{ width: size, height: size, color }}
    >
      {children}
    </div>
  );
}
