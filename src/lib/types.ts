export type NavItem = {
  label: string;
  href: string;
  /** Figma renders a caret on every item except "Contact" (nodes 1:743–1:761). */
  hasDropdown?: boolean;
};

/** The video banner at the top of the home page. */
export type HeroBanner = {
  video: string;
  heading: string;
  cta: { label: string; href: string };
  /** The oversized word set across the banner's middle. */
  word: string;
  stats: { value: number; suffix: string; label: string }[];
  body: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  eyebrowBadge: string;
  eyebrowText: string;
  headingLines: string[];
  cardBody: string;
  cta: { label: string; href: string };
};

export type OpeningHour = {
  label: string;
  value: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Photo revealed behind the card on hover (live build's `service-img-wrap`). */
  hoverImage: string;
  href: string;
};

/** A single slide in the "Physiotherapy Services" carousel. */
export type PhysioService = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type Doctor = {
  id: string;
  name: string;
  role: string;
  image: string;
  href: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
};

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  href: string;
};

export type MarqueeWord = {
  text: string;
  /** Solid navy, or the teal → navy gradient fill (Figma node 1:143). */
  variant: "solid" | "gradient";
};
