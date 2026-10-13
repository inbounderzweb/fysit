import { Reveal } from "@/components/animations/Reveal";
import { BandHeading } from "@/components/ui/BandHeading";
import { Marquee } from "@/components/ui/Marquee";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { TESTIMONIALS, TESTIMONIALS_HEADING } from "@/lib/content";
import type { Testimonial } from "@/lib/types";
import { listActiveTestimonials } from "@/services/testimonial.service";
import { asPopulatedMedia } from "@/types/media";

/**
 * A marquee lap has to be wider than the widest screen or the loop shows a
 * gap, so short lists are repeated up to this many cards per row (6 × 440px
 * clears a 1920px viewport).
 */
const MIN_CARDS_PER_ROW = 6;

/**
 * Published testimonials from the admin panel, in their admin order. Falls
 * back to the built-in set when none are published yet, or when the database
 * can't be reached, so the section never renders empty.
 */
async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items = await listActiveTestimonials(20);
    if (items.length === 0) return TESTIMONIALS;

    return items.map((item) => ({
      id: item._id.toString(),
      name: item.authorName,
      role: [item.authorRole, item.company].filter(Boolean).join(", "),
      quote: item.quote,
      avatar: asPopulatedMedia(item.image)?.secureUrl,
      rating: item.rating ?? undefined,
    }));
  } catch (error) {
    console.error("Testimonials: falling back to built-in content", error);
    return TESTIMONIALS;
  }
}

function fillRow(items: Testimonial[]) {
  const row = [...items];
  while (row.length < MIN_CARDS_PER_ROW) row.push(...items);
  return row;
}

/**
 * Figma 1:444 … 1:580 — two 1700px-wide masked rows of 400px cards. The
 * mask fades both ends; the rows travel in opposite directions.
 */
type TestimonialsProps = {
  /** Passed to the band heading — the About page uses the reference's larger setting. */
  headingSize?: "default" | "large";
};

export async function Testimonials({ headingSize = "default" }: TestimonialsProps) {
  const testimonials = await getTestimonials();

  // Both rows carry the full set so neither track shows a gap; the second is
  // rotated by half so the two rows never sit in step.
  const half = Math.floor(testimonials.length / 2);
  const firstRow = fillRow(testimonials);
  const secondRow = fillRow([...testimonials.slice(half), ...testimonials.slice(0, half)]);

  const fade = {
    maskImage:
      "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
  } as const;

  return (
    <section id="testimonials" className="bg-white pb-[64px] pt-[70px] lg:pb-[120px] lg:pt-[130px]">
      <Reveal className="px-5">
        <BandHeading
          size={headingSize}
          lead={TESTIMONIALS_HEADING.lead}
          accent={TESTIMONIALS_HEADING.accent}
        />
      </Reveal>

      <div className="mt-[40px] flex flex-col gap-[30px]" style={fade}>
        <Marquee speed={40} className="py-[20px]">
          {firstRow.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="mr-[40px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Marquee>

        <Marquee speed={40} reverse className="py-[20px]">
          {secondRow.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="mr-[40px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
