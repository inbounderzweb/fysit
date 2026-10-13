import { Reveal } from "@/components/animations/Reveal";
import { CONTACT_PAGE, OPENING_HOURS } from "@/lib/content";

function mask(url: string) {
  return {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  } as const;
}

export type ContactInfo = {
  address: string;
  email: string;
  phone: string;
};

/**
 * The reference Contact page's left column: an emergency notice, three
 * contact rows on 40px teal discs, the opening hours ruled off in #dcdcdc,
 * and four social discs whose teal fill grows out from the centre on hover.
 * Each block fades up on its own as it scrolls in, as the theme's
 * `gsap-animated` widgets do.
 */
export function ContactDetails({ info }: { info: ContactInfo }) {
  const { emergency, contacts, hoursTitle, socials } = CONTACT_PAGE;

  const rows: { label: string; icon: string; value: string; href?: string }[] = [
    { ...contacts.clinic, value: info.address },
    { ...contacts.email, value: info.email, href: `mailto:${info.email}` },
    { ...contacts.phone, value: info.phone, href: `tel:${info.phone.replace(/[^\d+]/g, "")}` },
  ];

  return (
    <div className="flex flex-col">
      <Reveal>
        <h3 className="text-[34px] font-normal leading-[44px] tracking-[-1.36px] text-navy">
          {emergency.title}
        </h3>
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-[20px] text-[16px] leading-[25.6px] text-body">
          {emergency.lead} <strong className="font-bold">{emergency.number}</strong> {emergency.tail}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="mt-[40px] flex list-none flex-col gap-[30px]">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-[10px]">
              <span className="grid size-[40px] shrink-0 place-items-center rounded-full bg-teal">
                <span aria-hidden className="size-[20px] bg-white" style={mask(row.icon)} />
              </span>
              <div className="min-w-0">
                <span className="mb-[8px] block text-[16px] font-medium leading-[16px] text-body">
                  {row.label}
                </span>
                {row.href ? (
                  <a
                    href={row.href}
                    className="break-words text-[16px] font-medium leading-[24px] text-navy transition-colors duration-300 hover:text-teal"
                  >
                    {row.value}
                  </a>
                ) : (
                  <p className="text-[16px] font-medium leading-[24px] text-navy">{row.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.05}>
        <h5 className="mt-[40px] text-[24px] font-normal leading-[34px] tracking-[-0.48px] text-navy">
          {hoursTitle}
        </h5>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="mt-[20px] flex flex-col gap-[10px]">
          {OPENING_HOURS.map((hour, index) => (
            <div
              key={hour.label}
              className={`flex justify-between text-[14px] leading-[26px] text-body ${
                index < OPENING_HOURS.length - 1 ? "border-b border-[#dcdcdc] pb-[10px]" : ""
              }`}
            >
              <dt className="font-medium">{hour.label}</dt>
              <dd className="font-semibold">{hour.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.15}>
        <ul className="mt-[20px] flex list-none gap-[12px]">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                className="group relative grid size-[40px] place-items-center overflow-hidden rounded-full bg-[#f1f7f3] text-navy transition-colors duration-300 hover:text-white focus-visible:text-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 scale-0 rounded-full bg-teal transition-transform duration-600 group-hover:scale-100 group-focus-visible:scale-100"
                />
                <span aria-hidden className="relative size-[14px] bg-current" style={mask(social.icon)} />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
