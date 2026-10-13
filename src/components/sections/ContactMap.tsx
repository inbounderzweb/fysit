import { Reveal } from "@/components/animations/Reveal";

/**
 * The reference's Google Maps embed: 400px tall, boxed to 1320px on wide
 * screens and edge to edge below that, with 120px of white under it.
 */
export function ContactMap({ address }: { address: string }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=10&output=embed&iwloc=near`;

  return (
    <section className="bg-white pb-[120px]">
      <Reveal className="mx-auto w-full max-w-[1320px]">
        <iframe
          src={src}
          title={`Map showing ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[400px] w-full border-0"
        />
      </Reveal>
    </section>
  );
}
