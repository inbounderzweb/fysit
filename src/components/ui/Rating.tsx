const STAR_PATH =
  "M8 .6l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.1 3.5 14.4l.9-5L.8 5.9l5-.7L8 .6z";

/**
 * Five amber stars with fractional fill — the live build shows 4, 4.5 and 5
 * star scores, so partial stars are clipped rather than rounded.
 */
export function Rating({ value }: { value: number }) {
  const id = `star-clip-${String(value).replace(".", "-")}`;

  return (
    <div
      className="flex gap-[2px]"
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));

        return (
          <svg
            key={index}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden
            focusable="false"
          >
            <defs>
              <clipPath id={`${id}-${index}`}>
                <rect x="0" y="0" width={16 * fill} height="16" />
              </clipPath>
            </defs>
            <path d={STAR_PATH} fill="none" stroke="#f5a623" strokeWidth="1" />
            {fill > 0 ? (
              <path
                d={STAR_PATH}
                fill="#f5a623"
                clipPath={`url(#${id}-${index})`}
              />
            ) : null}
          </svg>
        );
      })}
    </div>
  );
}
