import Image from "next/image";

import { Marquee } from "@/components/ui/Marquee";
import { DEPARTMENT_STRIP } from "@/lib/content";

/**
 * Figma 1:232 — a 163px teal band. The live build scrolls the nine
 * departments continuously at 30px uppercase, separated by starbursts.
 */
export function DepartmentStrip() {
  return (
    <section aria-label="Departments" className="bg-teal py-[38px] lg:py-[66px]">
      <Marquee speed={50}>
        {DEPARTMENT_STRIP.map((item) => (
          <span key={item} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap text-[20px] uppercase leading-[30px] tracking-[-0.4px] text-white lg:text-[30px]">
              {item}
            </span>
            <Image
              src="/icons/marquee-star.svg"
              alt=""
              width={30}
              height={30}
              className="mx-[32px] size-[22px] shrink-0 brightness-0 invert lg:mx-[38px] lg:size-[30px]"
              unoptimized
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
