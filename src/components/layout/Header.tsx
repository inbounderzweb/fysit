"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_ITEMS, SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The live build pins the header once the hero scrolls past: it becomes
 * `position: fixed`, 84px tall, on #07112f. Over the hero it stays
 * transparent at the Figma height of 94.25px.
 */
function useStuck(threshold = 200) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return stuck;
}

/**
 * Figma 1:719 — the header sits over the hero as a transparent overlay
 * (94.25px tall, logo inset 47px, menu square 70px from the right edge).
 *
 * The 1920 frame spaces logo → nav → contact cluster with gaps of 294px and
 * 202px, so the two spacers below carry those numbers as flex-grow ratios.
 * That holds the exact composition at 1920 and scales it proportionally.
 *
 * Once stuck, the header switches from the hero's dark overlay to a frosted
 * glass panel (white, blurred, translucent) — so every element that was
 * white-on-dark for the overlay state flips to navy-on-glass here.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const stuck = useStuck();
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn(
          "inset-x-0 top-0 z-50 transition-[height,background-color,box-shadow] duration-300",
          stuck
            ? "fixed h-[84px] border-b border-black/[0.06] bg-white/70 shadow-[0_10px_35px_rgba(15,30,76,0.1)] backdrop-blur-xl"
            : "absolute h-[94.25px]",
        )}
      >
        <div className="mx-auto flex h-full items-center pl-5 pr-5 lg:pl-[47px] lg:pr-[70px]">
          <Link href="/" className="shrink-0" aria-label={`${SITE.name} — home`}>
            <Image
              src="/icons/logo.svg"
              alt={`${SITE.name} — Wellness Simplified`}
              width={172}
              height={52}
              priority
              className="h-[42px] w-auto lg:h-[52px]"
            />
          </Link>

          <div className="hidden flex-[294] xl:block" aria-hidden />

          <nav
            aria-label="Primary"
            className={cn(
              "hidden h-[54.25px] items-center gap-1 rounded-[8px] border px-[5px] backdrop-blur-[7.5px] xl:flex",
              stuck
                ? "border-black/[0.06] bg-black/[0.03]"
                : "border-white/[0.06] bg-white/[0.05]",
            )}
          >
            {NAV_ITEMS.map((item) => {
              // Hash links (#services, #contact, …) point at sections on
              // the home page and never match a route of their own; only an
              // absolute path (/, /blog, /about) can be "current".
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/") &&
                    (pathname === item.href || pathname.startsWith(`${item.href}/`));
              // Navy on light once stuck, whether active or not; white on
              // the dark hero overlay otherwise (active keeps its white pill).
              const isDark = isActive || stuck;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-[38.25px] items-center gap-1 rounded-[5px] px-[15px]",
                    "text-[14px] font-medium uppercase leading-[14px] transition-colors duration-200",
                    isActive
                      ? "bg-white text-navy"
                      : stuck
                        ? "text-navy hover:bg-black/5"
                        : "text-white hover:bg-white/10",
                  )}
                >
                  {item.label}
                  {item.hasDropdown ? (
                    <Image
                      src={
                        isDark
                          ? "/icons/chevron-down-active.svg"
                          : "/icons/chevron-down.svg"
                      }
                      alt=""
                      width={14}
                      height={14}
                      /* Figma renders this glyph flipped (node 1:743) */
                      className="shrink-0 -scale-y-100"
                      unoptimized
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-[202] xl:block" aria-hidden />
          <div className="flex-1 xl:hidden" aria-hidden />

          {/* Emergency contact */}
          <div className="hidden items-center gap-[15px] lg:flex">
            <Image
              src="/icons/emergency-call.svg"
              alt=""
              width={35}
              height={35}
              /* The source SVG is white-filled; brightness-0 turns it navy
                 on the glass header without needing a second asset. */
              className={cn("shrink-0", stuck && "brightness-0")}
              unoptimized
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[12px] leading-[12px]",
                  stuck ? "text-navy/70" : "text-white/80",
                )}
              >
                {SITE.phoneLabel}
              </span>
              <a
                href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                className={cn(
                  "text-[18px] leading-[21.6px] transition-opacity hover:opacity-80",
                  stuck ? "text-navy" : "text-white",
                )}
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          <Link
            href="#appointment"
            className="group ml-5 hidden h-[53px] items-center gap-3 rounded-[8px] bg-teal pl-5 pr-1 transition-colors duration-300 hover:bg-teal-dark md:inline-flex"
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
                className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                unoptimized
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className={cn(
              "xl:hidden ml-5 grid size-[50px] shrink-0 place-items-center rounded-[5px] border shadow-[0_10px_35px_0_rgba(0,0,0,0.1)] backdrop-blur-[5px] transition-colors duration-200",
              stuck
                ? "border-black/[0.06] hover:bg-black/5"
                : "border-white/[0.06] hover:bg-white/10",
            )}
          >
            <Image
              src="/icons/menu.svg"
              alt=""
              width={26}
              height={26}
              className={cn(stuck && "brightness-0")}
              unoptimized
            />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
