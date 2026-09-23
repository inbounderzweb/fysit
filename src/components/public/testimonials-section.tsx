import Image from "next/image";
import { listActiveTestimonials } from "@/services/testimonial.service";
import { asPopulatedMedia } from "@/types/media";

export async function TestimonialsSection() {
  const testimonials = await listActiveTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-neutral-900">What Our Patients Say</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => {
          const image = asPopulatedMedia(testimonial.image);
          return (
            <figure
              key={testimonial._id.toString()}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-5"
            >
              {testimonial.rating && (
                <div aria-label={`${testimonial.rating} out of 5 stars`} className="text-amber-500">
                  {"★".repeat(testimonial.rating)}
                  <span className="text-neutral-300">{"★".repeat(5 - testimonial.rating)}</span>
                </div>
              )}
              <blockquote className="text-sm text-neutral-700">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                {image && (
                  <Image
                    src={image.secureUrl}
                    alt={image.altText ?? testimonial.authorName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-900">{testimonial.authorName}</p>
                  {(testimonial.authorRole || testimonial.company) && (
                    <p className="text-xs text-neutral-500">
                      {[testimonial.authorRole, testimonial.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
