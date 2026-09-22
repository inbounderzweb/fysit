import { cn } from "@/lib/utils";

/**
 * Figma section headings (1:104, 1:144, 1:371, 1:444, 1:581) are 60px
 * Mona Sans Regular in navy with a trailing clause set in Playfair Display
 * Italic, teal. Line breaks come from the heading frame's width, so callers
 * pass the Figma frame width through `className` (e.g. `max-w-[491px]`).
 */
type SectionHeadingProps = {
  lead: string;
  accent: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
};

export function SectionHeading({
  lead,
  accent,
  as: Tag = "h2",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <Tag id={id} className={cn("fluid-heading font-normal text-navy", className)}>
      {lead} <span className="heading-accent">{accent}</span>
    </Tag>
  );
}
