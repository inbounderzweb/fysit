import { cn } from "@/lib/utils";

/**
 * Figma "Heading 6" (1:107, 1:148, 1:375, 1:595): a white neumorphic pill —
 * inset 3px shadows in #ccdbe8 and white — with an 8px navy dot.
 */
type EyebrowPillProps = {
  children: React.ReactNode;
  className?: string;
};

export function EyebrowPill({ children, className }: EyebrowPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[31.78px] items-center gap-[5px] rounded-full bg-white pl-3 pr-3",
        "shadow-[inset_3px_3px_6px_0px_#ccdbe8,inset_-3px_-3px_6px_1px_rgba(255,255,255,0.5)]",
        className,
      )}
    >
      <span className="size-2 shrink-0 rounded-full bg-navy" aria-hidden />
      <span className="text-[16px] font-medium leading-[23.2px] tracking-[-0.48px] text-navy">
        {children}
      </span>
    </span>
  );
}
