import type {
  BlogPost,
  CaseStudy,
  Doctor,
  HeroBanner,
  HeroSlide,
  MarqueeWord,
  NavItem,
  OpeningHour,
  PhysioService,
  Service,
  Testimonial,
} from "./types";

/**
 * Layout follows the Figma frame "1920w light"; the copy is carried over from
 * the clinic's previous site (thefysit.com) wherever it has an equivalent.
 * The logo artwork reads "The Fysit", while some body copy refers to
 * "TheFysit" — both are preserved as written.
 */
export const SITE = {
  name: "The Fysit",
  tagline: "Your Partner in Wellness",
  description:
    "The Fysit is a leading physiotherapy clinic in Bangalore, dedicated to offering cutting-edge treatments designed to improve your health, mobility, and overall well-being.",
  url: "https://thefysit.com",
  phone: "+91 7892 604 549",
  phoneLabel: "Call Us:",
  email: "thefysit@gmail.com",
  enquiryPhone: "+91 7892 604 549",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
  { label: "Services", href: "#services", hasDropdown: false },
  { label: "Case Studies", href: "#case-studies", hasDropdown: false },
  { label: "Blogs", href: "/blog", hasDropdown: false },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------
   Hero — Figma 1:3. Four stacked groups make up a two-slide slider; the
   hidden duplicates differ only by background image and CTA label.
------------------------------------------------------------------------- */
export const HERO_BANNER: HeroBanner = {
  video: "/videos/hero-banner.webm",
  heading: "Professional Physiotherapy at Your Doorstep",
  cta: { label: "Book an Appointment", href: "#appointment" },
  stats: [
    { value: 68, suffix: "+", label: "Google Reviews" },
    { value: 3, suffix: "", label: "Locations in Bangalore" },
  ],
};

const HERO_CARD_BODY =
  "Our team of experienced physiotherapists delivers personalized care, including convenient home physiotherapy and comprehensive corporate ergonomics programs.";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "trusted-specialists",
    image: "/images/hero-slide-1.jpg",
    imageAlt:
      "Smiling doctor in a white coat holding a tablet in a bright clinic",
    eyebrowBadge: "TheFysit",
    eyebrowText: "Trusted Specialists",
    headingLines: ["Professional", "Physiotherapy", "at Your Doorstep"],
    cardBody: HERO_CARD_BODY,
    cta: { label: "Meet Our Team", href: "#team" },
  },
  {
    id: "schedule-a-checkup",
    image: "/images/hero-slide-2.jpg",
    imageAlt: "Medical team consulting together in a modern clinic",
    eyebrowBadge: "TheFysit",
    eyebrowText: "Trusted Specialists",
    headingLines: ["Comprehensive", "Clinical", "Physiotherapy"],
    cardBody: HERO_CARD_BODY,
    cta: { label: "Book an Appointment", href: "#appointment" },
  },
];

/* -------------------------------------------------------------------------
   About — Figma 1:104 … 1:133
------------------------------------------------------------------------- */
export const ABOUT = {
  eyebrow: "About TheFysit",
  heading: { lead: "Meet The Fysit", accent: "Your Partner in Wellness" },
  image: "/images/about-us2.jpg",
  imageAlt: "Team of five doctors and nurses standing together",
  statValue: "25+",
  statImage: "/images/stat-fill.jpg",
  statHeading: "Leading the Way in Physiotherapy",
  body: "At The Fysit, we are committed to helping you achieve optimal physical and mental well-being. We prioritize a holistic approach to ensure lasting improvements in your overall health and quality of life.",
  cta: { label: "Discover More", href: "#services" },
} as const;

/* -------------------------------------------------------------------------
   About page (/about) — laid out after the reference theme's About Us page.
   Copy is ours wherever the home page already says it; the mission line and
   section headings follow the reference's wording.
------------------------------------------------------------------------- */
export const ABOUT_PAGE = {
  banner: { title: "About Us", image: "/images/banner-about.jpg" },
  mission:
    "Beyond simply addressing symptoms, we focus on your overall well-being through expert physiotherapy care and innovative wellness solutions.",
  intro: {
    label: "Who are we?",
    years: Number.parseInt(ABOUT.statValue, 10),
    yearsLabel: "Years of Physiotherapy Care",
    avatars: ["/images/doctor-01.jpg", "/images/doctor-04.jpg", "/images/doctor-06.jpg"],
    trusted: ABOUT.statHeading,
    body: "The Fysit is a leading physiotherapy clinic in Bangalore, dedicated to offering cutting-edge treatments designed to improve your health, mobility, and overall well-being. With a focus on personalised care, our expertise lies in individual health needs and workplace wellness, creating a balanced path to better health.",
    link: { label: "Let’s create something extraordinary!", href: "/contact" },
    image: ABOUT.image,
    imageAlt: ABOUT.imageAlt,
  },
  departments: {
    eyebrow: "Our Department",
    lead: "Comprehensive Physiotherapy Services for",
    accent: "Your Health",
    linkLabel: "Explore Service",
  },
  team: {
    eyebrow: "Doctor of Physiotherapy",
    lead: "Medical Health Solutions Led by",
    accent: "Experienced Doctor",
    stat: "250+",
    statLabel: "Doctor of Healthcare",
    cta: { label: "Explore More", href: "/#team" },
  },
} as const;

export const OPENING_HOURS_TITLE = "Opening Hours:";

export const OPENING_HOURS: OpeningHour[] = [
  { label: "Mon - Fri", value: "9:00am - 9:00pm" },
  { label: "Saturday", value: "10:00am - 1:00pm" },
  { label: "Sunday", value: "Closed" },
];

/* -------------------------------------------------------------------------
   Marquees — Figma 1:139 (200px uppercase) and 1:252
------------------------------------------------------------------------- */
const DEPARTMENTS = [
  "Clinical Physiotherapy",
  "Doorstep Physiotherapy",
  "Corporate Wellness",
  "Orthopaedic",
  "Neuro Physiotherapy",
  "Sports Physiotherapy",
  "Paediatric",
  "Ergonomics Training",
  "Group Fitness",
  "Mental Wellness",
];

/** Words alternate solid navy / teal→navy gradient (Figma 1:140 vs 1:143). */
export const MARQUEE_PRIMARY: MarqueeWord[] = DEPARTMENTS.map((text, i) => ({
  text,
  variant: i % 2 === 0 ? "solid" : "gradient",
}));

export const MARQUEE_EMERGENCY: MarqueeWord[] = [
  "Doorstep Physiotherapy",
  "Corporate Wellness Programs",
  "Home Office Ergonomics",
  "Virtual Fitness Classes",
].map((text, i) => ({ text, variant: i % 2 === 0 ? "solid" : "gradient" }));

/* -------------------------------------------------------------------------
   Services — Figma 1:144 … 1:231
------------------------------------------------------------------------- */
export const SERVICES_HEADING = {
  eyebrow: "Our Department",
  lead: "Comprehensive Physiotherapy Services for",
  accent: "Your Health",
} as const;

export const SERVICES: Service[] = [
  {
    id: "orthopedic",
    title: "Orthopedic",
    description:
      "Focuses on the diagnosis, treatment, and rehabilitation of conditions affecting the bones, joints, muscles, and ligaments—helping restore mobility and improve quality of life.",
    icon: "/icons/service-orthopedic.svg",
    hoverImage: "/images/service-bg-01.jpg",
    href: "#services",
  },
  {
    id: "clinical-physiotherapy",
    title: "Clinical Physiotherapy",
    description:
      "With advanced equipment and a team of highly skilled physiotherapists, our clinical physiotherapy services provide expert care for a wide range of conditions.",
    icon: "/icons/service-diagnostics.svg",
    hoverImage: "/images/service-bg-04.jpg",
    href: "#services",
  },
  {
    id: "doorstep-physiotherapy",
    title: "Doorstep Physiotherapy",
    description:
      "Whether you’re recovering from an injury or managing a chronic condition, we bring personalised physiotherapy treatments right to your doorstep.",
    icon: "/icons/service-diabetes.svg",
    hoverImage: "/images/service-bg-05.jpg",
    href: "#services",
  },
  {
    id: "corporate-wellness",
    title: "Corporate Wellness",
    description:
      "Specialised wellness programs designed to help organisations promote employee well-being, with services that support both physical and mental health.",
    icon: "/icons/service-family.svg",
    hoverImage: "/images/service-bg-06.jpg",
    href: "#services",
  },
  {
    id: "home-office-ergonomics",
    title: "Home Office Ergonomics",
    description:
      "Tailored assessments that guide you in adjusting your furniture, screen setup, and posture to ensure comfort and prevent work-related injuries.",
    icon: "/icons/service-neurology.svg",
    hoverImage: "/images/service-bg-08.jpg",
    href: "#services",
  },
  {
    id: "virtual-fitness",
    title: "Virtual Fitness Classes",
    description:
      "Our live and recorded fitness sessions, and wellness webinars, provide you with the resources you need to stay active and informed.",
    icon: "/icons/service-holistic.svg",
    hoverImage: "/images/service-bg-09.jpg",
    href: "#services",
  },
];

/* -------------------------------------------------------------------------
   Physiotherapy Services carousel — a snap-scrolling slider of treatment
   cards on a mint band, separate from the icon-tile `SERVICES` grid above.
   Its accent colour is a one-off sky blue (`--color-sky`), not the site's
   teal — sampled directly from the reference render.
------------------------------------------------------------------------- */
export const PHYSIO_SERVICES_HEADING = {
  eyebrow: "Conditions We Treat",
  lead: "Effective, Hands-On Treatment",
  accent: "Physiotherapy Solutions",
} as const;

export const PHYSIO_SERVICES: PhysioService[] = [
  {
    id: "manual-therapy",
    title: "Orthopaedic Physiotherapy",
    description:
      "Treats and cares for your musculoskeletal system, including muscles, bones, joints, ligaments, and spinal discs.",
    image: "/images/service-slide-manual-therapy.jpg",
    icon: "/icons/physio-departments/manual-therapy.svg",
    href: "#services",
  },
  {
    id: "exercise-therapy",
    title: "Neuro Physiotherapy",
    description:
      "Focused treatments for neurological conditions that affect the brain, spinal cord, and nerves.",
    image: "/images/service-slide-exercise-therapy.jpg",
    icon: "/icons/physio-departments/exercise-therapy.svg",
    href: "#services",
  },
  {
    id: "sports-injury-rehab",
    title: "Sports Physiotherapy",
    description:
      "Prevention and management of injuries resulting from sports and exercise activities.",
    image: "/images/service-slide-sports-injury.jpg",
    icon: "/icons/physio-departments/sports-injury.svg",
    href: "#services",
  },
  {
    id: "knee-pain-arthritis",
    title: "Paediatric Physiotherapy",
    description:
      "Specialised treatments to help children with developmental challenges improve their motor skills and overall development.",
    image: "/images/service-slide-knee-pain.jpg",
    icon: "/icons/physio-departments/knee-pain.svg",
    href: "#services",
  },
  {
    id: "back-neck-pain",
    title: "Back & Neck Pain",
    description:
      "Relief for common issues like lower back pain, sciatica, and neck stiffness.",
    image: "/images/service-slide-back-neck.jpg",
    icon: "/icons/physio-departments/back-neck.svg",
    href: "#services",
  },
  {
    id: "foot-ankle-therapy",
    title: "Foot & Ankle Therapy",
    description:
      "Care for plantar fasciitis, Achilles tendinopathy, ankle sprains, and post-injury recovery.",
    image: "/images/service-slide-foot-ankle.jpg",
    icon: "/icons/physio-departments/foot-ankle.svg",
    href: "#services",
  },
];

/* -------------------------------------------------------------------------
   Why Choose Us — the dark editorial band (components/sections/DarkBanner).
   Benefits render as numbered rows, so they carry no icons.
------------------------------------------------------------------------- */
export const BANNER = {
  eyebrow: "Why Choose Us",
  heading: { lead: "Leading the Way in", accent: "Physiotherapy" },
  body: "At Fysit, we go beyond traditional physiotherapy and step up our care by offering personalised solutions that meet your specific & diverse needs.",
  cta: { label: "Discover More", href: "#services" },
  image: "/images/case-physio.jpg",
  imageAlt: "Physiotherapist stretching a patient’s leg on a treatment table",
  /** The floating label on the photo — the clinic's Google rating. */
  rating: { value: "4.9", label: "68 Google reviews" },
  /** Set around the rotating badge on the photo. */
  ring: "The Fysit • Physiotherapy • Bangalore • ",
  benefits: [
    {
      id: "comprehensive-care",
      title: "Comprehensive Care",
      description:
        "From chronic pain treatments to integrated workplace wellness strategies, we address all aspects of health and mobility.",
    },
    {
      id: "affordable-excellence",
      title: "Affordable Excellence",
      description:
        "World-class care and innovative solutions that are both budget-friendly and trustworthy.",
    },
    {
      id: "compassion",
      title: "Compassion",
      description: "We prioritise the well-being of every patient and employee.",
    },
  ],
  stats: [
    { id: "expert-doctor", label: "Expert Doctor", value: 82 },
    { id: "patient-satisfaction", label: "Patient Satisfaction", value: 74 },
    { id: "success-case", label: "Success Case", value: 98 },
  ],
} as const;

/** Teal strip — Figma 1:233 */
export const DEPARTMENT_STRIP = [
  "Clinical Physiotherapy",
  "Doorstep Physiotherapy",
  "Corporate Wellness",
  "Orthopaedic",
  "Neuro Physiotherapy",
  "Sports Physiotherapy",
  "Paediatric",
  "Ergonomics Training",
  "Virtual Fitness",
];

/* -------------------------------------------------------------------------
   Team — Figma 1:371 … 1:412
------------------------------------------------------------------------- */
export const TEAM_HEADING = {
  eyebrow: "Medical Professionals",
  lead: "Meet the Health Experts Behind",
  accent: "Your Care",
} as const;

export const DOCTORS: Doctor[] = [
  { id: "aviana-lexa", name: "Dr. Aviana Lexa", role: "Physician", image: "/images/doctor-01.jpg", href: "#team" },
  { id: "eddie-shock", name: "Dr. Eddie Shock", role: "Osteopaths", image: "/images/doctor-04.jpg", href: "#team" },
  { id: "whitney-kyle", name: "Dr. Whitney Kyle", role: "Dentist", image: "/images/doctor-03.jpg", href: "#team" },
  { id: "lawson-bourne", name: "Dr. Lawson Bourne", role: "Surgeon", image: "/images/doctor-07.jpg", href: "#team" },
  { id: "hailey-marie", name: "Dr. Hailey Marie", role: "Cardiologist", image: "/images/doctor-06.jpg", href: "#team" },
  { id: "jayne-adams", name: "Dr. Jayne Adams", role: "Gynecologist", image: "/images/doctor-02.jpg", href: "#team" },
];

/* -------------------------------------------------------------------------
   Appointment — Figma 1:254 … 1:298
------------------------------------------------------------------------- */
export const APPOINTMENT = {
  image: "/images/appointment.jpg",
  imageAlt: "Doctor greeting a patient at the clinic reception",
  map: "/images/map2.jpg",
  mapAlt: "Map showing the clinic location",
  intro:
    "Take the first step towards better health. Fill in your details and we will get back to you the same day.",
  support:
    "Call us, write to us, or simply walk in. Whichever is easiest for you – our team will help you figure out the right next step for your pain or recovery.",
  contacts: [
    {
      id: "assistance",
      label: "Need Assistance?",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      icon: "/icons/contact-mail.svg",
    },
    {
      id: "enquiries",
      label: "Patient & Appointment Enquiries",
      value: SITE.enquiryPhone,
      href: `tel:${SITE.enquiryPhone.replace(/[^\d+]/g, "")}`,
      icon: "/icons/contact-phone.svg",
    },
  ],
  form: {
    title: "Book An Appointment",
    submit: "Book Appointment",
    name: "Your Name",
    email: "Email Address",
    phone: "Phone",
    departments: [
      "Select a Service",
      "Clinical Physiotherapy",
      "Doorstep Physiotherapy",
      "Corporate Wellness Program",
    ],
    doctors: ["Select Doctor", ...DOCTORS.map((d) => d.name)],
    messagePlaceholder: "Type Your Message",
  },
} as const;

/* -------------------------------------------------------------------------
   Case studies — Figma 1:413 … 1:443
------------------------------------------------------------------------- */
export const CASE_STUDIES_HEADING = {
  lead: "Clinical Insights",
  accent: "Case Studies",
} as const;

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "chiropractic-treatment",
    title: "Chiropractic Treatment",
    category: "Chiropractic",
    image: "/images/case-chiropractic.jpg",
    href: "#case-studies",
  },
  {
    id: "joint-injuries",
    title: "Care for Joint Injuries",
    category: "Orthopedic",
    image: "/images/case-joint-injuries.jpg",
    href: "#case-studies",
  },
  {
    id: "back-pain-management",
    title: "Back Pain Management",
    category: "Spine Care",
    image: "/images/case-back-pain.jpg",
    href: "#case-studies",
  },
  {
    id: "therapy-facility",
    title: "Physical Therapy Facility",
    category: "Physiotherapy",
    image: "/images/case-therapy-facility.jpg",
    href: "#case-studies",
  },
  {
    id: "womens-health-physio",
    title: "Women’s Health Physio",
    category: "Pelvic Health",
    image: "/images/case-womens-health.jpg",
    href: "#case-studies",
  },
];

/** Full-bleed photographic band — Figma 1:299 */
export const FEATURE_BAND = {
  image: "/images/feature-band.jpg",
  imageAlt: "Nurse in conversation with a patient during a consultation",
  icon: "/icons/feature-doctor.svg",
  headline: "Over 20 Years of Medical Excellence and 15,000+ Successful Treatments",
  stat: "99.9%",
} as const;

/* -------------------------------------------------------------------------
   Testimonials — Figma 1:444 … 1:580. Two rows scrolling opposite ways.
   Fallback only (the admin's published testimonials win): the two real
   patient reviews from the previous site.
------------------------------------------------------------------------- */
export const TESTIMONIALS_HEADING = {
  lead: "Feedback from",
  accent: "Our Patient",
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "akshata-terdal",
    name: "Akshata Terdal",
    role: "Neck Pain",
    avatar: "/images/doctor-01.jpg",
    rating: 5,
    quote:
      "I visited Fysit for neck pain treatment. Dr. Veena had been very friendly and caring throughout the treatment process. She helped me recover from my neck pain and it’s been close to 6 months I haven’t faced any issues so far.",
  },
  {
    id: "google-review",
    name: "Google Review",
    role: "Pain Relief",
    avatar: "/images/doctor-07.jpg",
    rating: 5,
    quote:
      "Dr Veena was good in diagnosing the pain and ideal therapy was given. The commitment and professionalism was extremely appreciative. The facilities and equipment’s are in place. Great place to relieve your pain problems.",
  },
];

/* -------------------------------------------------------------------------
   Blog — Figma 1:581 … 1:631
------------------------------------------------------------------------- */
export const BLOG_HEADING = {
  eyebrow: "From Our Experts",
  lead: "Latest Health Insights",
  accent: "Your Wellness Journey",
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "orthopedic-doctor-guide",
    title: "What Does an Orthopedic Doctor Treat? A Complete Guide to Bone, Joint, and Muscle Health",
    date: "October 15, 2026",
    category: "Blogs",
    image: "/images/blog-orthopedic.jpg",
    href: "/blog",
  },
  {
    id: "physiotherapy-in-2026",
    title: "Why Physiotherapy Is Essential in 2026: Benefits, Treatments & Recovery Solutions",
    date: "May 20, 2026",
    category: "Blogs",
    image: "/images/blog-physio-2026.jpg",
    href: "/blog",
  },
  {
    id: "neck-pain",
    title: "Why Your Neck Pain Isn’t Going Away (And How Physiotherapy Fixes It)",
    date: "April 17, 2026",
    category: "Blogs",
    image: "/images/blog-neck-pain.jpg",
    href: "/blog",
  },
];

export const BLOG_AUTHOR = "admin";

/* -------------------------------------------------------------------------
   Contact page — mednix.themeht.com/contact. The clinic address, email and
   phone here are defaults: the page prefers the values saved under
   Admin → Settings when they're set.
------------------------------------------------------------------------- */
export const CONTACT_PAGE = {
  banner: { title: "Contact", image: "/images/banner-about.jpg" },
  emergency: {
    title: "Contact Info",
    // Rendered with the number in bold, as the reference sets it.
    lead: "Call us, write to us, or simply walk in. Reach our team on",
    number: SITE.phone,
    tail: "and we’ll help you figure out the right next step for your pain or recovery.",
  },
  contacts: {
    clinic: { label: "Visit Our Clinic", icon: "/icons/contact/clinic.svg" },
    email: { label: "General Inquiries", icon: "/icons/contact/mail.svg" },
    phone: { label: "Appointment Scheduling", icon: "/icons/contact/phone.svg" },
  },
  defaults: {
    address: "171, 4th Main Road, Sadanandanagar, Bangalore",
    email: SITE.email,
    phone: SITE.phone,
  },
  hoursTitle: "Opening Hours",
  socials: [
    { label: "Facebook", href: "#", icon: "/icons/contact/facebook.svg" },
    { label: "X", href: "#", icon: "/icons/contact/x.svg" },
    { label: "LinkedIn", href: "#", icon: "/icons/contact/linkedin.svg" },
    { label: "WhatsApp", href: "#", icon: "/icons/contact/whatsapp.svg" },
  ],
  form: {
    eyebrow: "Contact Us",
    title: "Book an Appointment",
    body: "Fill in your details and we will get back to you the same day.",
    name: "Your Name",
    email: "Email Address",
    phone: "Phone",
    department: "I’m looking for",
    doctor: "Select Doctor",
    date: "Preferred Date",
    message: "Type Your Message",
    submit: "Book Appointment",
    success: "Thank you for your message. It has been sent — we’ll get back to you the same day.",
  },
} as const;

/* -------------------------------------------------------------------------
   Footer — Figma 1:632 … 1:718
------------------------------------------------------------------------- */
export const FOOTER = {
  blurb:
    "The Fysit is a leading physiotherapy clinic in Bangalore, dedicated to improving your health, mobility, and overall well-being.",
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Our Doctors", href: "#team" },
        { label: "Contact", href: "#contact" },
        { label: "Blog Classic", href: "#blog" },
      ],
    },
    {
      title: "Our Services",
      links: [
        { label: "Clinical Physiotherapy", href: "#services" },
        { label: "Doorstep Physiotherapy", href: "#services" },
        { label: "Corporate Wellness", href: "#services" },
        { label: "Virtual Fitness Class", href: "#services" },
      ],
    },
  ],
  newsletter: {
    title: "Newsletter",
    body: "Join the Community and Receive Our Monthly Newsletter Straight to Your Inbox.",
    placeholder: "Your Email Address",
  },
  contacts: [
    {
      id: "clinic",
      label: "Visit Our Clinic",
      value: "171, 4th Main Road, Sadanandanagar, Bangalore",
      icon: "/icons/footer-location.svg",
    },
    {
      id: "inquiries",
      label: "General Inquiries",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      icon: "/icons/footer-mail.svg",
    },
    {
      id: "emergency",
      label: "Call Us",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}`,
      icon: "/icons/footer-phone.svg",
    },
  ],
  marquee: DEPARTMENTS,
  copyright: "© 2026 thefysit . All rights reserved.",
} as const;
