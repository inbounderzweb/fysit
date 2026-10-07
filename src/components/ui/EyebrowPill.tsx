import { cn } from "@/lib/utils";

/**
 * Figma "Heading 6" (1:107, 1:148, 1:375, 1:595): a white neumorphic pill —
 * inset 3px shadows in #ccdbe8 and white — with an 8px navy dot.
 *
 * `tone="dark"` is the reference theme's version for navy bands: no fill, a
 * teal inset glow on the top-left against a black one bottom-right, and the
 * dot and label in white.
 */
type EyebrowPillProps = {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export function EyebrowPill({ children, tone = "light", className }: EyebrowPillProps) {
  const dark = tone === "dark";

  return (
    <span
      className={cn(
        "inline-flex h-[31.78px] items-center gap-[5px] rounded-full pl-3 pr-3",
        dark
          ? "shadow-[inset_3px_3px_6px_0px_var(--color-teal),inset_-3px_-3px_6px_1px_rgba(0,0,0,0.5)]"
          : "bg-white shadow-[inset_3px_3px_6px_0px_#ccdbe8,inset_-3px_-3px_6px_1px_rgba(255,255,255,0.5)]",
        className,
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", dark ? "bg-white" : "bg-navy")} aria-hidden />
      <span
        className={cn(
          "text-[16px] font-medium leading-[23.2px] tracking-[-0.48px]",
          dark ? "text-white" : "text-navy",
        )}
      >
        {children}
      </span>
    </span>
  );
}
