import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The single button pattern used across the design (Figma 1:49, 1:768, 1:133):
 * a 53px bar, 20px of leading padding, then a 45px white square holding the
 * arrow, inset 4px from the right edge.
 *
 * `variant="dark"` is the reference theme's `dark-btn`: a #07112f bar and a
 * level arrow that slides out to the right on hover while its twin follows in
 * from the left. The arrow is the white `arrow-right.svg` used as a mask, so
 * it can be painted navy here.
 */
type ArrowButtonProps = {
  href: string;
  label: string;
  variant?: "teal" | "dark";
  className?: string;
};

const ARROW_MASK = {
  maskImage: "url(/icons/arrow-right.svg)",
  WebkitMaskImage: "url(/icons/arrow-right.svg)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;

export function ArrowButton({ href, label, variant = "teal", className }: ArrowButtonProps) {
  if (variant === "dark") {
    return (
      <Link
        href={href}
        className={cn(
          "group inline-flex h-[53px] items-center gap-3 overflow-hidden rounded-[8px] bg-[#07112f] pl-5 pr-1",
          className,
        )}
      >
        <span className="text-[16px] font-medium leading-[26px] text-white">{label}</span>
        <span className="relative grid size-[45px] shrink-0 place-items-center overflow-hidden rounded-[5px] bg-white">
          <span
            aria-hidden
            className="col-start-1 row-start-1 h-[22px] w-[23px] bg-navy transition-transform duration-300 group-hover:translate-x-[45px]"
            style={ARROW_MASK}
          />
          <span
            aria-hidden
            className="col-start-1 row-start-1 h-[22px] w-[23px] -translate-x-[45px] bg-navy transition-transform duration-300 group-hover:translate-x-0"
            style={ARROW_MASK}
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-[53px] items-center gap-3 rounded-[8px] bg-teal pl-5 pr-1",
        "transition-colors duration-300 hover:bg-teal-dark",
        className,
      )}
    >
      <span className="text-[16px] font-medium leading-[26px] text-white">
        {label}
      </span>
      <span className="grid size-[45px] shrink-0 place-items-center rounded-[5px] bg-white">
        <Image
          src="/icons/arrow-up-right.svg"
          alt=""
          width={23}
          height={22}
          className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          unoptimized
        />
      </span>
    </Link>
  );
}
