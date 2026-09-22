import { cn } from "@/lib/utils";

/**
 * The curve that folds a protruding panel back into the surface behind it.
 *
 * The design builds this from a 60px box carrying `inset -34px -34px 0 0 #fff`
 * (Figma 1:96 / 1:97, and the live `.banner-swiper-buttons::before`). Most of
 * that box is hidden behind the rotated tab; what actually paints is a 20px
 * fillet tangent to both surfaces, which is what this draws. Measured off the
 * live build: 13.8px wide one pixel out from the join, 8px at four, 4.8px at
 * seven.
 *
 * `corner` names the corner the bite is taken from; the white fills the rest.
 */
type Corner = "tl" | "tr" | "bl" | "br";

const CENTRE: Record<Corner, string> = {
  tl: "0% 0%",
  tr: "100% 0%",
  bl: "0% 100%",
  br: "100% 100%",
};

type EdgeNotchProps = {
  corner: Corner;
  /** Fillet radius; the design uses 20. */
  radius?: number;
  className?: string;
};

export function EdgeNotch({ corner, radius = 20, className }: EdgeNotchProps) {
  const size = radius;

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none block", className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle ${radius}px at ${CENTRE[corner]}, transparent 0 ${
          radius - 0.4
        }px, #fff ${radius - 0.2}px)`,
      }}
    />
  );
}
