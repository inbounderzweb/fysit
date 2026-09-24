import Image from "next/image";
import Link from "next/link";

import { Marquee } from "@/components/ui/Marquee";
import {
  FOOTER,
  OPENING_HOURS,
  SITE,
} from "@/lib/content";

/**
 * Figma 1:632 — 1920 × 763 on #04102c, lit by two blurred 576px orbs
 * (nodes 1:635 / 1:636), with an outlined department marquee near the foot
 * and the copyright in a notched pill.
 */
export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-footer text-white">
      {/* Figma 1:635 / 1:636 — corner glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[288px] -top-[288px] size-[576px] rounded-full bg-teal/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[288px] top-[475px] size-[576px] rounded-full bg-[#e0583f]/25 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[1300px] px-5 pt-[70px] sm:px-8 lg:pt-[120px]">
        <div className="grid gap-[50px] lg:grid-cols-[361fr_207fr_207fr_414fr]">
          {/* Clinic card */}
          <div className="rounded-[10px] bg-white p-[30px] backdrop-blur-sm">
            <Image
              src="/icons/logo.svg"
              alt={`${SITE.name} — Wellness Simplified`}
              width={220}
              height={66}
              className="h-[52px] w-auto"
            />
            <p className="mt-[21px] text-[16px] leading-[24px] text-black">
              {FOOTER.blurb}
            </p>
            <dl className="mt-[22px] text-[16px]">
              {OPENING_HOURS.map((hour, index) => (
                <div
                  key={hour.label}
                  className={`flex items-center justify-between py-[8px] ${
                    index < OPENING_HOURS.length - 1
                      ? "border-b border-black/30"
                      : ""
                  }`}
                >
                  <dt className="leading-[26px] text-black">{hour.label}</dt>
                  <dd className="font-medium leading-[26px] text-black">{hour.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {FOOTER.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[24px] leading-[34px] tracking-[-0.48px]">
                {column.title}
              </h2>
              <ul className="mt-[20px] flex list-none flex-col gap-[19px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[16px] leading-[22px] text-white/70 transition-colors hover:text-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-[24px] leading-[34px] tracking-[-0.48px]">
              {FOOTER.newsletter.title}
            </h2>
            <p className="mt-[21px] text-[16px] leading-[24px] text-white/70">
              {FOOTER.newsletter.body}
            </p>
            <form className="relative mt-[42px]" action="#">
              <label className="sr-only" htmlFor="newsletter-email">
                {FOOTER.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder={FOOTER.newsletter.placeholder}
                className="h-[50px] w-full rounded-[5px] border border-white/[0.14] bg-white/[0.06] pl-[21px] pr-[54px] text-[16px] text-white placeholder:text-white/50 focus:border-teal focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-[8px] top-[8px] grid size-[35px] place-items-center rounded-[4px] bg-teal transition-colors hover:bg-teal-dark"
              >
                <Image
                  src="/icons/newsletter-send.svg"
                  alt=""
                  width={18}
                  height={18}
                  unoptimized
                />
              </button>
            </form>
          </div>
        </div>

        {/* Contact row — Figma 1:687 … 1:704 */}
        <ul className="mt-[60px] grid list-none gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {FOOTER.contacts.map((contact) => (
            <li key={contact.id} className="flex items-center gap-[10px]">
              <span className="grid size-[50px] shrink-0 place-items-center rounded-full bg-teal text-white">
                <Image
                  src={contact.icon}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                />
              </span>
              <div>
                <p className="text-[14px] leading-[14px] text-white/60">
                  {contact.label}
                </p>
                {"href" in contact && contact.href ? (
                  <a
                    href={contact.href}
                    className="text-[16px] leading-[22px] transition-colors hover:text-teal"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-[16px] leading-[22px]">{contact.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Outlined department marquee — Figma 1:70 */}
      <div className="relative mt-[60px]" aria-hidden>
        <Marquee speed={47}>
          {FOOTER.marquee.map((word) => (
            <span key={word} className="flex shrink-0 items-center">
              <span
                className="whitespace-nowrap text-[clamp(2.5rem,4.7vw,5.625rem)] leading-[1.1] uppercase"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
              >
                {word}
              </span>
              <Image
                src="/icons/marquee-star.svg"
                alt=""
                width={50}
                height={50}
                className="mx-[42px] size-[clamp(24px,2.6vw,50px)] shrink-0  invert"
                unoptimized
              />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Copyright pill — Figma 1:713 */}
      <div className="relative flex justify-center pb-0">
        <p className="rounded-t-[16px] bg-white/[0.06] px-[60px] py-[21px] text-center text-[16px] leading-[22px] text-white/70">
          {FOOTER.copyright}
        </p>
      </div>
    </footer>
  );
}
