import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  /**
   * The 1920 frame uses two content insets: 300px (→ 1320 wide, services grid)
   * and 310px (→ 1300 wide, about / team / blog).
   */
  size?: "wide" | "narrow";
  className?: string;
};

export function Container({
  children,
  size = "narrow",
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "wide" ? "max-w-[1320px]" : "max-w-[1300px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
