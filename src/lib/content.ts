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
  { label: "Services", href: "/services", hasDropdown: false },
  {
    label: "Locations",
    href: "/physiotherapy-center-in-sadanandanagar",
    hasDropdown: true,
    // Fallback list — the live dropdown is built from Admin → Locations (lib/locations-public.ts).
    children: [
      { label: "Sadanandanagar", href: "/physiotherapy-center-in-sadanandanagar", note: "171, 4th Main Road" },
      { label: "Kasturi Nagar", href: "/physiotherapy-center-in-kasturi-nagar", note: "No. 143, 4th Cross, near SBI Bank" },
    ],
  },
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

/* -------------------------------------------------------------------------
   Services pages (/services, /services/[slug]) — the services themselves
   come from Admin → Services; this is the fixed copy around them.
------------------------------------------------------------------------- */
export const SERVICES_PAGE = {
  banner: { title: "Our Services", image: "/images/banner-care.jpg" },
  intro: {
    eyebrow: "What We Offer",
    lead: "Comprehensive Physiotherapy Services for",
    accent: "Your Health",
    body: "From in-clinic treatment to physiotherapy at your doorstep and wellness programmes for your workplace, every plan is built around your body, your pace and your goals.",
  },
  empty: {
    title: "Our services are on their way",
    body: "We’re putting the finishing touches to this page. In the meantime, call us or book an appointment and we’ll find the right care for you.",
  },
  detail: {
    benefitsEyebrow: "Why It Helps",
    benefitsTitle: { lead: "Key", accent: "Benefits" },
    processEyebrow: "How It Works",
    processTitle: { lead: "Your Treatment", accent: "Journey" },
    faqEyebrow: "Questions",
    faqTitle: { lead: "Frequently Asked", accent: "Questions" },
    sidebarTitle: "All Services",
    help: {
      title: "Not sure which service you need?",
      body: "Talk to our physiotherapists — we’ll help you find the right next step for your pain or recovery.",
      cta: { label: "Book an Appointment", href: "/contact" },
    },
    related: { eyebrow: "Explore More", lead: "Other Services", accent: "We Offer" },
  },
} as const;

/* -------------------------------------------------------------------------
   Locations — the two clinic pages, at the same addresses they had on the
   previous site (thefysit.com) so existing links and rankings carry over.
   Copy is carried over from those pages. These are the built-in fallback;
   the live pages come from Admin → Locations once any are published.
------------------------------------------------------------------------- */
const LOCATION_SERVICES: LocationService[] = [
  {
    title: "Clinical Physiotherapy",
    description: "Hands-on, in-clinic sessions using advanced equipment. Built around your condition, not a generic routine.",
    href: "/services/clinical-physiotherapy",
  },
  {
    title: "Doorstep Physiotherapy",
    description: "Our physiotherapists come to your home. Ideal for post-surgery patients, older adults, and anyone with limited mobility.",
    href: "/services/doorstep-physiotherapy",
  },
  {
    title: "Orthopedic Physiotherapy",
    description: "Focused care for back pain, knee pain, shoulder pain, joint injuries, and post-fracture recovery.",
  },
  {
    title: "Neurophysiotherapy",
    description: "Rehabilitation for stroke recovery, Parkinson’s disease, spinal cord injury, and traumatic brain injury.",
  },
  {
    title: "Sports Physiotherapy",
    description: "From ligament sprains and muscle tears to overuse injuries and performance rehab — for athletes and active people at every level.",
  },
  {
    title: "Pediatric Physiotherapy",
    description: "Specialised treatment for children with motor skill delays, developmental challenges, and musculoskeletal conditions.",
  },
  {
    title: "Dry Needling",
    description: "Targeted muscle therapy to relieve pain, reduce tension, and improve mobility.",
  },
  {
    title: "Dry Cupping",
    description: "Suction therapy that boosts blood flow, eases muscle tension, and supports recovery.",
  },
  {
    title: "Kinesio Tapping",
    description: "A flexible taping technique that supports muscles, reduces pain, and improves movement.",
  },
];

/** The old pages listed some conditions twice under different names; each appears once here. */
const LOCATION_CONDITIONS = [
  "Back pain",
  "Neck pain",
  "Knee pain",
  "Shoulder pain",
  "Frozen shoulder",
  "Sciatica",
  "Spondylitis",
  "Arthritis",
  "Disc bulge",
  "Joint pain",
  "Foot pain",
  "Muscle stiffness",
  "Tennis elbow",
  "ACL injuries",
  "Sports injuries",
  "Post-surgery rehabilitation",
  "Posture correction",
  "Stroke recovery",
  "Parkinson’s disease",
  "Spinal cord injury",
  "Multiple sclerosis",
  "Bell’s palsy",
  "Cerebral palsy",
  "Head injury",
  "Strength & conditioning",
  "Cranio-sacral release",
  "Long wave diathermy",
];

const LOCATION_STATS = [
  { value: "4.9", label: "Google rating" },
  { value: "500+", label: "Happy patients" },
  { value: "10+", label: "Years of experience" },
];

export const LOCATIONS_COPY = {
  servicesEyebrow: "What We Offer",
  conditionsEyebrow: "Conditions We Treat",
  conditionsTreatment:
    "Every condition is different, and your treatment will be too — drawing on manual therapy, electrotherapy, TENS, therapeutic ultrasound, dry needling and personalised exercise therapy, depending on what your body needs.",
  conditionsCta: "Not sure if physiotherapy is right for your condition? Call us — we’ll give you an honest answer.",
  whyEyebrow: "Why Choose Us",
  corporateEyebrow: "Corporate Wellness",
  faqEyebrow: "Questions",
  visitTitle: "Visit Our Clinic",
  homeVisits: {
    title: "Home physiotherapy available",
    body: "Can’t visit the clinic? We bring expert care to your doorstep.",
  },
  directions: "Get directions",
  cta: {
    title: { lead: "Ready to Start Your", accent: "Recovery Journey?" },
    body: "Don’t let pain hold you back any longer. Book your appointment today and take the first step towards a pain-free life.",
    button: { label: "Book Your Appointment", href: "/contact" },
  },
} as const;

export type LocationService = { title: string; description: string; href?: string };

/**
 * A clinic page. The built-in LOCATIONS below are the fallback; once any are
 * published under Admin → Locations, those are used instead (lib/locations-public.ts).
 */
export type Location = {
  id?: string;
  slug: string;
  /** Short name for breadcrumbs and the other-clinic link. */
  name: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: { lead: string; accent: string };
  intro: string;
  address: { street: string; area: string; city: string; full: string };
  phone: string;
  approach: { title: { lead: string; accent: string }; paragraphs: string[]; image: string };
  services: { lead: string; accent: string; intro: string };
  conditionsTitle: { lead: string; accent: string };
  why: { title: { lead: string; accent: string }; points: { title: string; body: string }[] };
  corporate: { title: string; paragraphs: string[] };
  faqTitle: { lead: string; accent: string };
  faqs: { question: string; answer: string }[];
  stats: { value: string; label: string }[];
  serviceItems: LocationService[];
  conditions: string[];
  /** Optional photo overrides; the page has defaults for each. */
  images?: { banner?: string; team?: string; corporate?: string };
};

export const LOCATIONS: Location[] = [
  {
    slug: "physiotherapy-center-in-sadanandanagar",
    name: "Sadanandanagar",
    title: "Physiotherapy Center in Sadanandanagar",
    metaTitle: "Physiotherapy Center in Sadanandanagar, Bangalore",
    metaDescription:
      "Physiotherapy at 171, 4th Main Road, Sadanandanagar, Bangalore: clinic and home visits for back, knee and neck pain, sports injuries and stroke recovery.",
    eyebrow: "Expert Physiotherapy in Sadanandanagar",
    heading: { lead: "Physiotherapy Center in", accent: "Sadanandanagar, Bangalore" },
    intro:
      "Pain has a way of sneaking up on you. One day it’s a little stiffness in the morning; the next, you’re adjusting how you sit, how you sleep, and what you can do without wincing. At The Fysit’s physiotherapy center in Sadanandanagar, we help you stop adjusting and start recovering.",
    address: {
      street: "171, 4th Main Road",
      area: "Sadanandanagar",
      city: "Bangalore",
      full: "171, 4th Main Road, Sadanandanagar, Bangalore",
    },
    phone: SITE.phone,
    approach: {
      title: { lead: "Stop Managing the Pain.", accent: "Start Treating It." },
      paragraphs: [
        "Most people wait too long. They stretch, rest, take a painkiller, and hope it goes away. Sometimes it does. Often it does not.",
        "At The Fysit Sadanandanagar, our physiotherapists look at the full picture — not just where it hurts, but why. Your posture, your daily routine, your medical history: all of it matters. From there, your treatment plan is built around your specific situation. Nobody else’s.",
        "We also offer doorstep physiotherapy in Sadanandanagar for patients who cannot make it to the clinic. You get the same quality of care at home.",
      ],
      image: "/images/case-physio.jpg",
    },
    services: {
      lead: "Physiotherapy Services at Our",
      accent: "Sadanandanagar Clinic",
      intro:
        "We treat a wide range of conditions at our Sadanandanagar clinic, from injuries that happened last week to pain you have carried for years.",
    },
    conditionsTitle: { lead: "Conditions We Treat in", accent: "Sadanandanagar" },
    why: {
      title: { lead: "Why Patients in Sadanandanagar", accent: "Choose The Fysit" },
      points: [
        {
          title: "Treatment built around you",
          body: "Every patient gets a plan built from scratch. We look at your condition, your lifestyle, and what you actually want to get back to doing.",
        },
        {
          title: "Experienced, certified physiotherapists",
          body: "Our Sadanandanagar team has treated orthopedic, neurological, sports and pediatric patients — and they take the time to show it.",
        },
        {
          title: "Clinic visits and home visits",
          body: "Come in to our 4th Main Road clinic or book a home visit. Either way, the standard of care stays the same.",
        },
        {
          title: "Affordable care, no surprises",
          body: "You’ll know what to expect before treatment starts. No hidden costs, no vague timelines, no sessions you don’t need.",
        },
      ],
    },
    corporate: {
      title: "Corporate Wellness for Sadanandanagar’s Working Professionals",
      paragraphs: [
        "Desk jobs are taking a toll. Tight hips, stiff necks, lower back pain that starts at 2 PM and doesn’t quit — we see it constantly at our Sadanandanagar clinic.",
        "We work on-site with your team, covering ergonomics assessments, workstation corrections, group fitness sessions and mental wellness support. The result: fewer sick days, less discomfort, and a team that feels better at work.",
      ],
    },
    stats: LOCATION_STATS,
    serviceItems: LOCATION_SERVICES,
    conditions: LOCATION_CONDITIONS,
    faqTitle: { lead: "Frequently Asked", accent: "Questions" },
    faqs: [
      {
        question: "Can physiotherapy fix back pain without surgery?",
        answer:
          "Yes, in most cases. Physiotherapy for back pain works by finding and treating the root cause, whether that is a muscle imbalance, poor posture, a slipped disc, or sciatica. Through manual therapy, dry needling, TENS, and targeted exercise therapy, most patients see significant improvement without needing surgery. At The Fysit, we assess your back properly on the first visit and build a plan from there.",
      },
      {
        question: "How many physiotherapy sessions does it take to see results?",
        answer:
          "Most patients feel a real difference within 4 to 8 sessions. Acute injuries often respond faster. Conditions like chronic back pain, spondylitis, or post-surgery rehabilitation may take longer, depending on severity and how long the problem has been present. After your first session at our Sadanandanagar center, your physiotherapist will give you a clear, honest timeline.",
      },
      {
        question: "Is physiotherapy effective for knee pain?",
        answer:
          "Yes. Physiotherapy for knee pain targets the muscles, tendons, and movement patterns that put stress on the knee joint. It is effective for osteoarthritis, ligament injuries, runner’s knee, post-surgery recovery, and general knee stiffness. Most patients avoid surgery entirely with the right physiotherapy plan started early enough.",
      },
      {
        question: "What is the difference between a physiotherapist and an orthopedic doctor?",
        answer:
          "An orthopedic doctor diagnoses conditions and may recommend surgery or medication. A physiotherapist focuses on restoring movement, reducing pain, and rebuilding strength through physical treatment — no surgery, no drugs. They often work together. If your orthopedic doctor has referred you to physiotherapy, The Fysit in Sadanandanagar can pick up from there and take you through your full recovery.",
      },
      {
        question: "What is corporate physiotherapy, and how does it help office workers?",
        answer:
          "Most office workers are not dealing with one big injury. They are dealing with months of slow, building pain in the neck, lower back, and shoulders. Corporate physiotherapy fixes this at the source through ergonomics assessments, workstation corrections, group fitness sessions, and mental wellness support. Get in touch, and we will put something together for your team.",
      },
    ],
  },
  {
    slug: "physiotherapy-center-in-kasturi-nagar",
    name: "Kasturi Nagar",
    title: "Physiotherapy Center in Kasturi Nagar",
    metaTitle: "Physiotherapy Center in Kasturi Nagar, Bangalore",
    metaDescription:
      "Physiotherapy at No. 143, 4th Cross, near SBI Bank, Kasturi Nagar, Bangalore: clinic and home visits for back and knee pain, sports injuries and stroke rehab.",
    eyebrow: "Expert Physiotherapy in Kasturi Nagar",
    heading: { lead: "Physiotherapy Center in", accent: "Kasturi Nagar, Bangalore" },
    intro:
      "Have back pain that just won’t quit? Recovering from surgery and unsure where to start? Or simply tired of managing chronic pain on your own? Our physiotherapy center in Kasturi Nagar offers the expert care you deserve — so you can move better, feel stronger, and get back to the life you had before the pain started.",
    address: {
      street: "No. 143, 4th Cross, near SBI Bank",
      area: "Kasturi Nagar",
      city: "Bangalore",
      full: "No. 143, 4th Cross, near SBI Bank, Kasturi Nagar, Bangalore",
    },
    phone: SITE.phone,
    approach: {
      title: { lead: "Expert Physiotherapy Care,", accent: "Built Around You" },
      paragraphs: [
        "At The Fysit Kasturi Nagar, we believe in treating the root cause of your pain. Your physiotherapist will sit with you, understand your condition, your daily routine, and what recovery actually looks like for you. Only then do we begin treatment.",
        "From orthopedic injuries to neurological conditions to chronic back pain, we have the tools, the experience, and physiotherapists in Kasturi Nagar who are genuinely invested in helping you get better.",
        "We also offer doorstep physiotherapy for patients who prefer treatment at home. The same physiotherapist, the same standard of care — just at your door.",
      ],
      image: "/images/case-therapy-facility.jpg",
    },
    services: {
      lead: "Physiotherapy Services at Our",
      accent: "Kasturi Nagar Clinic",
      intro:
        "At our Kasturi Nagar clinic, we treat everything from sudden injuries to conditions you have been managing for years.",
    },
    conditionsTitle: { lead: "Conditions We Treat in", accent: "Kasturi Nagar" },
    why: {
      title: { lead: "Why Choose The Fysit in", accent: "Kasturi Nagar?" },
      points: [
        {
          title: "Personalised treatment plans",
          body: "Every patient gets a plan built around their condition and recovery goals. No generic routines, no one-size-fits-all approach.",
        },
        {
          title: "Certified, experienced physiotherapists",
          body: "Our Kasturi Nagar team brings clinical expertise across orthopedic, neurological, sports and pediatric physiotherapy — backed by advanced in-clinic equipment.",
        },
        {
          title: "Clinic and home visits",
          body: "Visit us at the clinic or choose home physiotherapy — we make expert care accessible to everyone in Kasturi Nagar.",
        },
        {
          title: "Honest, affordable care",
          body: "A transparent, pressure-free approach. You get the care you need — nothing more, nothing unnecessary.",
        },
      ],
    },
    corporate: {
      title: "Corporate Wellness for Kasturi Nagar’s Working Professionals",
      paragraphs: [
        "Kasturi Nagar is home to a growing number of businesses and working professionals — and with that comes the very real problem of workplace pain. Posture problems, repetitive strain, and desk-induced back and neck pain are things we see every day.",
        "Our corporate wellness programs include ergonomics assessments, workstation corrections, group fitness workshops and mental wellness support, all shaped around what your team actually needs. Because a healthier team is a happier, more productive one.",
      ],
    },
    stats: LOCATION_STATS,
    serviceItems: LOCATION_SERVICES,
    conditions: LOCATION_CONDITIONS,
    faqTitle: { lead: "Frequently Asked", accent: "Questions" },
    faqs: [
      {
        question: "Where can I find a physiotherapist near Kasturi Nagar?",
        answer:
          "The Fysit is a physiotherapy center in Kasturi Nagar located at No. 143, 4th Cross, near SBI Bank, Bangalore. You can visit us at the clinic or book a doorstep physiotherapy session if you prefer treatment at home. Call us on +91 7892 604 549 to book your appointment.",
      },
      {
        question: "Is home physiotherapy available in Kasturi Nagar?",
        answer:
          "Yes, we offer doorstep physiotherapy in Kasturi Nagar. Our physiotherapists visit your home and deliver the same standard of clinical care as an in-clinic session. This is especially helpful for patients recovering from surgery, older adults, or anyone who finds travelling to the clinic difficult.",
      },
      {
        question: "How many physiotherapy sessions are needed for back pain or knee pain?",
        answer:
          "The number of sessions depends on the condition, its severity, and how long it has been present. Most patients see noticeable improvement within 4 to 8 sessions. After your first assessment at our Kasturi Nagar center, your physiotherapist will give you a clear, realistic timeline — no vague estimates, no unnecessary sessions.",
      },
      {
        question: "What conditions does a physiotherapist treat?",
        answer:
          "A physiotherapist treats a wide range of musculoskeletal and neurological conditions. At The Fysit Kasturi Nagar, we treat back pain, neck pain, knee pain, shoulder pain, sciatica, frozen shoulder, spondylitis, arthritis, sports injuries, post-surgery rehabilitation, stroke recovery, and Parkinson’s disease, among others.",
      },
      {
        question: "How do I book a physiotherapy appointment in Kasturi Nagar?",
        answer:
          "Call us on +91 7892 604 549 to book. Walk-ins are welcome, subject to availability. Our clinic is open Monday to Friday, 9:00am to 9:00pm, and Saturday, 10:00am to 1:00pm.",
      },
      {
        question: "What is corporate physiotherapy and how does it help office workers?",
        answer:
          "Corporate physiotherapy brings professional pain management and wellness support into the workplace, helping office workers deal with the physical toll of long desk hours, poor posture, and repetitive strain. The Fysit offers corporate wellness programs in Bangalore covering ergonomics assessments, workstation corrections, group fitness, and mental wellness.",
      },
    ],
  },
];

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
    /** Placeholder only — the options come from Admin → Doctors (lib/doctors.ts). */
    doctors: ["Select Doctor"],
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
        { label: "Clinical Physiotherapy", href: "/services" },
        { label: "Doorstep Physiotherapy", href: "/services" },
        { label: "Corporate Wellness", href: "/services" },
        { label: "Virtual Fitness Class", href: "/services" },
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
