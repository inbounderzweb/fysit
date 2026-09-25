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
 * Every string here is transcribed from the Figma frame "1920w light".
 * The logo artwork reads "The Fysit", while the body copy refers to
 * "TheFysit" — both are preserved exactly as the design has them.
 */
export const SITE = {
  name: "The Fysit",
  tagline: "Your Trusted Partner Health and Wellness",
  description:
    "We’re committed to offering compassionate and comprehensive healthcare tailored to your needs. At TheFysit, your health is our priority every step of the way.",
  url: "https://thefysit.com",
  phone: "(888) 4567890",
  phoneLabel: "Emergency Call:",
  email: "info@example.com",
  enquiryPhone: "+4800 45 678 900",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
  { label: "Services", href: "#services", hasDropdown: false },
  { label: "Case Studies", href: "#case-studies", hasDropdown: false },
  { label: "Blogs", href: "/blog", hasDropdown: false },
  { label: "Contact", href: "#contact" },
];

/* -------------------------------------------------------------------------
   Hero — Figma 1:3. Four stacked groups make up a two-slide slider; the
   hidden duplicates differ only by background image and CTA label.
------------------------------------------------------------------------- */
export const HERO_BANNER: HeroBanner = {
  video: "/videos/hero-banner.webm",
  heading: "Your Trusted Partner Health and Wellness",
  cta: { label: "Schedule a Checkup", href: "#appointment" },
  word: "Physiotherapy",
  stats: [
    { value: 20, suffix: "+", label: "Years of Excellence" },
    { value: 15000, suffix: "+", label: "Successful Treatments" },
  ],
  body: "Hands-on physiotherapy and rehabilitation from clinicians who listen — a plan built around your body, your pace and your goals.",
};

const HERO_CARD_BODY =
  "Our experienced medical team combines the latest technology with personalized attention to provide you with exceptional healthcare tailored to your unique needs.";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "trusted-specialists",
    image: "/images/hero-slide-1.jpg",
    imageAlt:
      "Smiling doctor in a white coat holding a tablet in a bright clinic",
    eyebrowBadge: "TheFysit",
    eyebrowText: "Trusted Specialists",
    headingLines: ["Your Trusted", "Partner Health", "and Wellness"],
    cardBody: HERO_CARD_BODY,
    cta: { label: "Meet Our Team", href: "#team" },
  },
  {
    id: "schedule-a-checkup",
    image: "/images/hero-slide-2.jpg",
    imageAlt: "Medical team consulting together in a modern clinic",
    eyebrowBadge: "TheFysit",
    eyebrowText: "Trusted Specialists",
    headingLines: ["Your Trusted", "Partner Health", "and Wellness"],
    cardBody: HERO_CARD_BODY,
    cta: { label: "Schedule a Checkup", href: "#appointment" },
  },
];

/* -------------------------------------------------------------------------
   About — Figma 1:104 … 1:133
------------------------------------------------------------------------- */
export const ABOUT = {
  eyebrow: "About TheFysit",
  heading: { lead: "Caring for You Like", accent: "Family Health" },
  image: "/images/about-team.jpg",
  imageAlt: "Team of five doctors and nurses standing together",
  statValue: "25+",
  statImage: "/images/stat-fill.jpg",
  statHeading: "Trusted Experts in Medical Health and Wellness",
  body: "We’re committed to offering compassionate and comprehensive healthcare tailored to your needs. At TheFysit, your health is our priority every step of the way.",
  cta: { label: "Discover More", href: "#services" },
} as const;

export const OPENING_HOURS_TITLE = "Opening Hours:";

export const OPENING_HOURS: OpeningHour[] = [
  { label: "Mon - Fri", value: "9:00 - 18:00" },
  { label: "Sat - Sun", value: "8:00 - 16:00" },
  { label: "Emergency", value: "24/7 Hours" },
];

/* -------------------------------------------------------------------------
   Marquees — Figma 1:139 (200px uppercase) and 1:252
------------------------------------------------------------------------- */
const DEPARTMENTS = [
  "Cardiology",
  "Dental Care",
  "Psychiatry",
  "Ophthalmology",
  "Physical Therapy",
  "Oncology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Surgery",
];

/** Words alternate solid navy / teal→navy gradient (Figma 1:140 vs 1:143). */
export const MARQUEE_PRIMARY: MarqueeWord[] = DEPARTMENTS.map((text, i) => ({
  text,
  variant: i % 2 === 0 ? "solid" : "gradient",
}));

export const MARQUEE_EMERGENCY: MarqueeWord[] = [
  "24/7 Emergency Services",
  "Experienced Doctors On Call",
  "Pharmacy Open 24/7",
  "Ambulance Available Anytime",
].map((text, i) => ({ text, variant: i % 2 === 0 ? "solid" : "gradient" }));

/* -------------------------------------------------------------------------
   Services — Figma 1:144 … 1:231
------------------------------------------------------------------------- */
export const SERVICES_HEADING = {
  eyebrow: "Our Department",
  lead: "Comprehensive Medical Services for",
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
    id: "diagnostics",
    title: "Diagnostics",
    description:
      "Accurate testing and screening services to detect, monitor, and manage a wide range of health conditions.",
    icon: "/icons/service-diagnostics.svg",
    hoverImage: "/images/service-bg-04.jpg",
    href: "#services",
  },
  {
    id: "diabetes-care",
    title: "Diabetes Care",
    description:
      "Comprehensive management of diabetes through medication, lifestyle changes, and regular monitoring to prevent complications.",
    icon: "/icons/service-diabetes.svg",
    hoverImage: "/images/service-bg-05.jpg",
    href: "#services",
  },
  {
    id: "family-medicine",
    title: "Family Medicine",
    description:
      "One of the defining features of family medicine is the continuity of care—physicians often build long-term relationships with patients and their families.",
    icon: "/icons/service-family.svg",
    hoverImage: "/images/service-bg-06.jpg",
    href: "#services",
  },
  {
    id: "neurology",
    title: "Neurology",
    description:
      "Neurology is the branch of medicine that focuses on the diagnosis, treatment, and management of disorders related to the nervous system.",
    icon: "/icons/service-neurology.svg",
    hoverImage: "/images/service-bg-08.jpg",
    href: "#services",
  },
  {
    id: "holistic-care",
    title: "Holistic Care",
    description:
      "It recognizes that health is influenced by a combination of physical, emotional, mental, social, and spiritual factors.",
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
  eyebrow: "Physiotherapy Services",
  lead: "Effective, Hands-On Treatment",
  accent: "Physiotherapy Solutions",
} as const;

export const PHYSIO_SERVICES: PhysioService[] = [
  {
    id: "manual-therapy",
    title: "Manual Therapy",
    description:
      "Hands-on techniques to relieve tension, improve joint mobility, and reduce pain.",
    image: "/images/service-slide-manual-therapy.jpg",
    href: "#services",
  },
  {
    id: "exercise-therapy",
    title: "Exercise Therapy",
    description:
      "Customized strengthening and mobility programs for long-term recovery and improved function.",
    image: "/images/service-slide-exercise-therapy.jpg",
    href: "#services",
  },
  {
    id: "sports-injury-rehab",
    title: "Sports Injury Rehab",
    description:
      "Treatment for sprains, strains, tendonitis, and other athletic injuries.",
    image: "/images/service-slide-sports-injury.jpg",
    href: "#services",
  },
  {
    id: "knee-pain-arthritis",
    title: "Knee Pain & Arthritis",
    description:
      "Treatment for chronic knee pain, osteoarthritis, patellofemoral syndrome, and joint stiffness.",
    image: "/images/service-slide-knee-pain.jpg",
    href: "#services",
  },
  {
    id: "back-neck-pain",
    title: "Back & Neck Pain",
    description:
      "Relief for common issues like lower back pain, sciatica, and neck stiffness.",
    image: "/images/service-slide-back-neck.jpg",
    href: "#services",
  },
  {
    id: "foot-ankle-therapy",
    title: "Foot & Ankle Therapy",
    description:
      "Care for plantar fasciitis, Achilles tendinopathy, ankle sprains, and post-injury recovery.",
    image: "/images/service-slide-foot-ankle.jpg",
    href: "#services",
  },
];

/* -------------------------------------------------------------------------
   Dark benefits banner — Figma 1:306
------------------------------------------------------------------------- */
export const BANNER = {
  eyebrow: "Our Benefits",
  heading: { lead: "Reliable Care with", accent: "TheFysit Healthcare" },
  body: "Our expert team combines state-of-the-art technology with personalized care to provide treatments designed around your unique health needs.",
  cta: { label: "Discover More", href: "#services" },
  image: "/images/banner-care.jpg",
  imageAlt: "Clinician reviewing diagnostics on a tablet",
  benefits: [
    {
      id: "health-treatments",
      title: "Health Treatments",
      description: "Tailored treatment plans focused on your recovery.",
      icon: "/icons/benefit-treatments.svg",
    },
    {
      id: "advanced-facilities",
      title: "Advanced Facilities",
      description:
        "Equipped with the latest technology for accurate diagnoses.",
      icon: "/icons/benefit-facilities.svg",
    },
    {
      id: "expert-physicians",
      title: "Expert Physicians",
      description: "Highly trained specialists providing personalized care.",
      icon: "/icons/benefit-physicians.svg",
    },
  ],
  /** Bar widths in Figma: 219, 197 and 261 of a 267px track. */
  stats: [
    { id: "expert-doctor", label: "Expert Doctor", value: 82 },
    { id: "patient-satisfaction", label: "Patient Satisfaction", value: 74 },
    { id: "success-case", label: "Success Case", value: 98 },
  ],
} as const;

/** Teal strip — Figma 1:233 */
export const DEPARTMENT_STRIP = [
  "Cardiology",
  "Dental Care",
  "Physical Therapy",
  "Psychiatry",
  "Oncology",
  "Pediatrics",
  "Ophthalmology",
  "Orthopedics",
  "General Surgery",
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
    "Take the first step toward better health by scheduling your appointment today. Whether you’re a new patient or returning, our quick and secure booking makes it easy.",
  support:
    "If you have general questions about our services, doctors, or clinic policies, feel free to reach out via email and Call us directly.",
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
    departments: ["Select Department", "Cardiology", "Dental Care", "Neurology"],
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
------------------------------------------------------------------------- */
export const TESTIMONIALS_HEADING = {
  lead: "Feedback from",
  accent: "Our Patient",
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "arietta-preston",
    name: "Arietta Preston",
    role: "Cardiology",
    avatar: "/images/doctor-01.jpg",
    rating: 4.5,
    quote:
      "From the moment I walked in, I felt genuinely cared for. The doctors took the time to explain everything and answered all my questions.",
  },
  {
    id: "woulfe-nick",
    name: "Woulfe Nick",
    role: "Oncology",
    avatar: "/images/doctor-07.jpg",
    rating: 5,
    quote:
      "Everyone from the reception to the doctors was friendly and professional. The clinic is clean, modern, and welcoming. They treat you like a person.",
  },
  {
    id: "sapphire-rose",
    name: "Sapphire Rose",
    role: "Dental",
    avatar: "/images/doctor-03.jpg",
    rating: 4.5,
    quote: "The medical team is incredibly knowledgeable and thorough. I felt confident in their care every step of the way. I'm so thankful for their expertise.",
  },
  {
    id: "melissa-jewel",
    name: "Melissa Jewel",
    role: "Therapy",
    avatar: "/images/doctor-02.jpg",
    rating: 5,
    quote: "The medical team is incredibly knowledgeable and thorough. I felt confident in their care every step of the way. I'm so thankful for their expertise.",
  },
  {
    id: "xeinna-chris",
    name: "Xeinna Chris",
    role: "Psychology",
    avatar: "/images/doctor-05.jpg",
    rating: 4,
    quote: "The medical team is incredibly knowledgeable and thorough. I felt confident in their care every step of the way. I'm so thankful for their expertise.",
  },
  {
    id: "cathy-divine",
    name: "Cathy Divine",
    role: "Pediatrics",
    avatar: "/images/doctor-06.jpg",
    rating: 4,
    quote: "The medical team is incredibly knowledgeable and thorough. I felt confident in their care every step of the way. I'm so thankful for their expertise.",
  },
];

/* -------------------------------------------------------------------------
   Blog — Figma 1:581 … 1:631
------------------------------------------------------------------------- */
export const BLOG_HEADING = {
  eyebrow: "Latest News & Updates",
  lead: "Latest Health Insights",
  accent: "Your Wellness Journey",
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "doctor-approved",
    title: "Doctor-Approved Ways to Stay Healthy",
    date: "September 12, 2025",
    category: "Health & Wellness",
    image: "/images/blog-01.jpg",
    href: "#blog",
  },
  {
    id: "first-visit",
    title: "What to Expect During Your First Visit to Our Clinic",
    date: "September 12, 2025",
    category: "Health & Wellness",
    image: "/images/blog-02.jpg",
    href: "#blog",
  },
  {
    id: "telemedicine",
    title: "Telemedicine or In-Person Care: What’s Best?",
    date: "September 12, 2025",
    category: "Health & Wellness",
    image: "/images/blog-03.jpg",
    href: "#blog",
  },
];

export const BLOG_AUTHOR = "admin";

/* -------------------------------------------------------------------------
   Footer — Figma 1:632 … 1:718
------------------------------------------------------------------------- */
export const FOOTER = {
  blurb:
    "We dedicated to providing flexible & accessible healthcare services.",
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
      title: "Department",
      links: [
        { label: "Eye Care", href: "#services" },
        { label: "Cardiology", href: "#services" },
        { label: "Dentist", href: "#services" },
        { label: "Pregnancy", href: "#services" },
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
      value: "5th Street, 21st Floor, New York, USA",
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
      label: "Emergency Cases",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}`,
      icon: "/icons/footer-phone.svg",
    },
  ],
  marquee: DEPARTMENTS,
  copyright: "© 2026 thefysit . All rights reserved.",
} as const;
