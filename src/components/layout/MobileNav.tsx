"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { NAV_ITEMS, SITE } from "@/lib/content";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The Figma file ships desktop only, so this drawer is an extension of the
 * design's own language: the hero's ink ground, the glass borders from the
 * nav pill, and the same uppercase 14px items.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/70 backdrop-blur-sm"
          />

          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-[min(360px,88vw)] flex-col gap-8 overflow-y-auto bg-ink px-7 py-8"
          >
            <div className="flex items-center justify-between">
              <Image
                src="/icons/logo.svg"
                alt={`${SITE.name} — Wellness Simplified`}
                width={172}
                height={52}
                className="h-[42px] w-auto"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-[5px] border border-white/[0.06] text-2xl leading-none text-white transition-colors hover:bg-white/10"
              >
                <span aria-hidden>×</span>
              </button>
            </div>

            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between border-b border-white/10 py-4 text-[14px] font-medium uppercase text-white transition-colors hover:text-teal"
                    >
                      {item.label}
                      {item.hasDropdown ? (
                        <Image
                          src="/icons/chevron-down.svg"
                          alt=""
                          width={14}
                          height={14}
                          className="-scale-y-100"
                          unoptimized
                        />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-5">
              <div className="flex items-center gap-[15px]">
                <Image
                  src="/icons/emergency-call.svg"
                  alt=""
                  width={35}
                  height={35}
                  unoptimized
                />
                <div className="flex flex-col">
                  <span className="text-[12px] leading-[12px] text-white/80">
                    {SITE.phoneLabel}
                  </span>
                  <a
                    href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                    className="text-[18px] leading-[21.6px] text-white"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <Link
                href="#appointment"
                onClick={onClose}
                className="group inline-flex h-[53px] items-center justify-between gap-3 rounded-[8px] bg-teal pl-5 pr-1"
              >
                <span className="text-[16px] font-medium leading-[26px] text-white">
                  Appointment
                </span>
                <span className="grid size-[45px] shrink-0 place-items-center rounded-[5px] bg-white">
                  <Image
                    src="/icons/arrow-up-right.svg"
                    alt=""
                    width={23}
                    height={22}
                    unoptimized
                  />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
