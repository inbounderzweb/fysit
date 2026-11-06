"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { SITE } from "@/lib/content";
import type { NavItem } from "@/lib/types";
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
export function Header({ navItems }: { navItems: NavItem[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const stuck = useStuck();
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn(
          "z-50 transition-[height,background-color,box-shadow] duration-300",
          stuck
            ? "fixed inset-x-0 top-0 h-[84px] border-b border-black/[0.06] bg-white/70 shadow-[0_10px_35px_rgba(15,30,76,0.1)] backdrop-blur-xl"
            : "absolute h-[94.25px]",
          /* The home hero is an inset card (components/sections/Hero), so the
             overlay steps in by the same frame (10px, 20px from md) to sit inside it. */
          !stuck && (pathname === "/" ? "inset-x-2.5 top-2.5 md:inset-x-5 md:top-5" : "inset-x-0 top-0"),
        )}
      >
        <div className="mx-auto flex h-full items-center pl-5 pr-5 lg:pl-[47px] lg:pr-[70px]">
          <Link href="/" className="shrink-0" aria-label={`${SITE.name} — home`}>
            <Image
              src="/icons/logo.svg"
              alt={`${SITE.name} — Wellness Simplified`}
              width={156}
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
            {navItems.map((item) => {
              if (item.children?.length) {
                return <NavDropdown key={item.label} item={item} stuck={stuck} pathname={pathname} />;
              }

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

      <MobileNav navItems={navItems} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/**
 * A nav item with sub-links (Locations). Opens on hover, or on click and the
 * keyboard; Escape or moving focus away closes it. The panel is a white card
 * hung under the nav pill, each link carrying a one-line note.
 */
function NavDropdown({ item, stuck, pathname }: { item: NavItem; stuck: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const children = item.children ?? [];
  const isActive = children.some((child) => pathname === child.href);
  const isDark = isActive || stuck;

  // A short grace period lets the pointer cross the gap into the panel.
  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Escape and clicks outside close the panel wherever focus is — Safari
  // doesn't focus a button on click, so a key handler on the wrapper alone
  // would miss it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      rootRef.current?.querySelector("button")?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
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
        <Image
          src={isDark ? "/icons/chevron-down-active.svg" : "/icons/chevron-down.svg"}
          alt=""
          width={14}
          height={14}
          /* Figma renders this glyph flipped (node 1:743); open turns it back. */
          className={cn("shrink-0 transition-transform duration-300", open ? "scale-y-100" : "-scale-y-100")}
          unoptimized
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-10 w-[320px] -translate-x-1/2 pt-[14px] transition-all duration-300",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="list-none rounded-[14px] border border-black/[0.06] bg-white p-[8px] shadow-[0_20px_50px_-12px_rgba(15,30,76,0.25)]">
          {children.map((child) => {
            const current = pathname === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  // Client-side navigation keeps the header mounted, so close here.
                  onClick={() => setOpen(false)}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "group flex items-start gap-[12px] rounded-[10px] px-[14px] py-[12px] transition-colors duration-200",
                    current ? "bg-mint" : "hover:bg-surface",
                  )}
                >
                  <span
                    aria-hidden
                    className="mt-[2px] grid size-[32px] shrink-0 place-items-center rounded-full bg-teal/10 text-teal-dark transition-colors duration-200 group-hover:bg-teal group-hover:text-white"
                  >
                    <svg viewBox="0 0 16 16" className="size-[15px] fill-current">
                      <path d="M8 1a5 5 0 0 0-5 5c0 3.6 4.3 8.3 4.5 8.5a.7.7 0 0 0 1 0C8.7 14.3 13 9.6 13 6a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium leading-[22px] text-navy">{child.label}</span>
                    {child.note && (
                      <span className="block text-[13px] leading-[19px] text-body/80">{child.note}</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
