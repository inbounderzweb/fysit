import { siteConfig } from "@/config/site";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const wordmarkSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        className={iconSize}
        role="img"
        aria-label={`${siteConfig.name} logo`}
      >
        <rect x="1.5" y="1.5" width="37" height="37" rx="10" fill="none" stroke="url(#logo-gradient)" strokeWidth="2.5" />
        <path
          d="M14 29V13.5C14 12 15 11 16.5 11H24.5C26 11 27 12.2 27 13.6C27 15 26 16.2 24.5 16.2H17.5V19.5H23"
          fill="none"
          stroke="url(#logo-gradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14b8a6" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="leading-tight">
        <p className={`font-semibold text-neutral-900 ${wordmarkSize}`}>{siteConfig.name}</p>
        <p className="text-xs font-medium tracking-wide text-teal-600">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
