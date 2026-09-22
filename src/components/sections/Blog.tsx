import Image from "next/image";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLOG_AUTHOR, BLOG_HEADING, BLOG_POSTS } from "@/lib/content";

/**
 * Figma 1:581 … 1:631 — three 417px cards. The date sits in a pill notched
 * into the foot of each image (nodes 1:601–1:604).
 */
export function Blog() {
  return (
    <section id="blog" className="bg-white pb-[64px] pt-[60px] lg:pb-[120px] lg:pt-[105px]">
      <Container>
        <Reveal className="flex flex-col items-center text-center">
          <EyebrowPill>{BLOG_HEADING.eyebrow}</EyebrowPill>
          <SectionHeading
            lead={BLOG_HEADING.lead}
            accent={BLOG_HEADING.accent}
            className="mt-[10px] max-w-[845px] text-center"
          />
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-[40px] grid list-none grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {BLOG_POSTS.map((post) => (
            <StaggerItem as="li" key={post.id} className="h-full">
              <article className="group flex h-full flex-col rounded-[10px] border border-line bg-white p-px">
                <div className="relative overflow-hidden rounded-[9px]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={415}
                    height={356}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 415px"
                    className="aspect-[415/356] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <p className="absolute bottom-0 left-[50px] rounded-t-[8px] bg-white px-[24px] py-[9px] text-[14px] leading-[19px] text-navy">
                    <time dateTime={post.date}>{post.date}</time>
                  </p>
                </div>

                <div className="flex flex-1 flex-col px-[35px] pb-[30px] pt-[29px]">
                  <h3 className="text-[28px] leading-[39px] tracking-[-1.12px] text-navy">
                    <Link
                      href={post.href}
                      className="transition-colors hover:text-teal"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <div className="mt-auto flex items-center gap-[19px] pt-[28px] text-[14px] leading-[17px] text-body">
                    <span>{BLOG_AUTHOR}</span>
                    <span className="rounded-[6px] bg-mint px-[17px] py-[8px] text-navy">
                      {post.category}
                    </span>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
