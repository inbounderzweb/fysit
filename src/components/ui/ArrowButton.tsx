import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The single button pattern used across the design (Figma 1:49, 1:768, 1:133):
 * a 53px teal bar, 20px of leading padding, then a 45px white square holding
 * the navy arrow, inset 4px from the right edge.
 */
type ArrowButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function ArrowButton({ href, label, className }: ArrowButtonProps) {
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
