import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLOG_HEADING } from "@/lib/content";
import { formatPostDate, toDateTimeAttr } from "@/lib/utils";
import { listPublishedBlogPosts } from "@/services/blog.service";
import { asPopulatedAuthor, asPopulatedTerm } from "@/types/blog";
import { asPopulatedMedia } from "@/types/media";

/** How many of the newest posts the home page shows. */
const POST_COUNT = 3;

/**
 * The three most recently published posts from Admin → Blog, drawn with the
 * same card as /blog. Returns null when the database can't be reached or
 * nothing is published yet, so the home page never shows placeholder posts
 * that link nowhere.
 */
async function getLatestPosts() {
  try {
    const { items } = await listPublishedBlogPosts({ limit: POST_COUNT });
    return items;
  } catch (error) {
    console.error("Home blog section: could not load posts", error);
    return [];
  }
}

export async function Blog() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

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
          className="mt-[40px] grid list-none grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]"
        >
          {posts.map((post) => {
            const image = asPopulatedMedia(post.featuredImage);
            const author = asPopulatedAuthor(post.author);

            return (
              <StaggerItem as="li" key={post.slug} className="h-full">
                <BlogCard
                  slug={post.slug}
                  title={post.title}
                  image={image ? { src: image.secureUrl, alt: image.altText ?? post.title } : null}
                  date={formatPostDate(post.publishedAt)}
                  dateTime={toDateTimeAttr(post.publishedAt)}
                  author={author?.name ?? null}
                  category={asPopulatedTerm(post.category)}
                />
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
