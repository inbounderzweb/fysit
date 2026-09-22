import { Reveal } from "@/components/animations/Reveal";
import { BandHeading } from "@/components/ui/BandHeading";
import { Marquee } from "@/components/ui/Marquee";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { TESTIMONIALS, TESTIMONIALS_HEADING } from "@/lib/content";

/**
 * Figma 1:444 … 1:580 — two 1700px-wide masked rows of 400px cards. The
 * mask fades both ends; the rows travel in opposite directions.
 */
export function Testimonials() {
  // Both rows carry the full set so neither track shows a gap; the second is
  // rotated so the two rows never sit in step.
  const firstRow = TESTIMONIALS;
  const secondRow = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

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
          lead={TESTIMONIALS_HEADING.lead}
          accent={TESTIMONIALS_HEADING.accent}
        />
      </Reveal>

      <div className="mt-[40px] flex flex-col gap-[30px]" style={fade}>
        <Marquee speed={40} className="py-[20px]">
          {firstRow.map((testimonial) => (
            <div key={testimonial.id} className="mr-[40px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Marquee>

        <Marquee speed={40} reverse className="py-[20px]">
          {secondRow.map((testimonial) => (
            <div key={testimonial.id} className="mr-[40px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
