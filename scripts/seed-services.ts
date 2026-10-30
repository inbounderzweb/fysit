import path from "node:path";
import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()));

/**
 * Imports the clinic's services, with copy carried over from the previous
 * site (thefysit.com), into Admin → Services. Safe to re-run: a service whose
 * slug already exists is skipped, never overwritten, so edits made in the
 * admin are kept.
 *
 *   npm run seed:services            → imports as Published
 *   npm run seed:services -- --draft → imports as Draft, to review first
 *
 * Like scripts/seed.ts, this talks to Mongoose directly: src/services/* import
 * "server-only", which throws outside Next's bundler.
 */

type SeedService = {
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string };
};

const ICON = (name: string) => `/icons/physio-departments/${name}.svg`;

const SERVICES: SeedService[] = [
  {
    name: "Clinical Physiotherapy",
    slug: "clinical-physiotherapy",
    tagline: "Recovery, pain relief and mobility — personalised physiotherapy in Bangalore.",
    shortDescription:
      "With advanced equipment and a team of highly skilled physiotherapists, our clinical physiotherapy services provide expert care for a wide range of conditions.",
    description: `
<p>Whether you need recovery support, pain relief, or improved mobility, we’ve got you covered. Our expert team of physiotherapists in Bangalore is dedicated to providing personalised treatment, ensuring you get back to feeling your best in no time.</p>
<h2>Experience Advanced Care at Our Physiotherapy Centre</h2>
<p>At The Fysit, we combine modern techniques with advanced equipment. Our physiotherapy centre in Bangalore is equipped with state-of-the-art technology and a comfortable environment to support your healing journey. From hands-on therapy to innovative rehab techniques, we ensure faster recovery and long-term well-being.</p>
<h2>Comprehensive In-Clinic Physiotherapy Solutions</h2>
<p>Our clinical physiotherapy services offer expert care for a wide range of conditions, including musculoskeletal, neurological, and sports-related injuries. With advanced equipment and a team of highly skilled physiotherapists, we focus on delivering superior care through personalised treatment plans. Whether you’re managing an ongoing condition or recovering from surgery, our clinic provides the resources you need for a full recovery.</p>
<h2>Musculoskeletal Disorders</h2>
<p>Whether it’s a constant backache or joint discomfort, our experts design personalised treatment plans to help you regain movement and reduce pain effectively.</p>
<h2>Get in Touch with The Fysit</h2>
<p>Don’t let pain take control of your life. Whether you visit our clinic or prefer physiotherapy at home, we’re here to help you move better, feel stronger, and live pain-free.</p>`,
    icon: ICON("manual-therapy"),
    features: [
      "Personalised treatment plans built around your goals",
      "State-of-the-art equipment and a comfortable environment",
      "Hands-on therapy and innovative rehab techniques",
      "Care for musculoskeletal, neurological and sports injuries",
      "Post-operative rehabilitation",
      "Faster recovery and long-term well-being",
    ],
    process: [],
    faqs: [
      {
        question: "What conditions can Clinical Physiotherapy at The Fysit help with?",
        answer:
          "Our Clinical Physiotherapy services address a wide range of conditions, including musculoskeletal disorders (back pain, neck pain, joint pain), neurological conditions (stroke, Parkinson’s Disease), sports injuries, post-operative rehabilitation, and more.",
      },
    ],
    seo: {
      title: "Clinical Physiotherapy in Bangalore",
      description:
        "Personalised clinical physiotherapy in Bangalore for back pain, joint injuries, neurological conditions, sports injuries and post-operative rehab.",
    },
  },
  {
    name: "Doorstep Physiotherapy",
    slug: "doorstep-physiotherapy",
    tagline: "Convenient, personalised physiotherapy at your doorstep.",
    shortDescription:
      "Whether you’re recovering from an injury or managing a chronic condition, we bring personalised physiotherapy treatments right to your doorstep.",
    description: `
<p>Why travel to a physiotherapy clinic in Bangalore when you can have expert physiotherapists visit you? We understand the struggles of busy professionals and those recovering at home in accessing expert physiotherapy, so we bring personalised treatment to the comfort of your home.</p>
<p>Whether you’re dealing with an injury or managing a chronic condition, our service is designed for home-based recovery. With personalised treatment plans, you’ll receive the same high-quality care in your own space — without the need to travel or take time off from your busy schedule.</p>
<h2>Who Can Benefit from Physiotherapy at Home?</h2>
<ul>
<li><strong>Seniors requiring mobility support</strong> — our care makes all the difference in improving mobility and independence.</li>
<li><strong>Patients recovering from surgery or injury</strong> — speed up your recovery without needing to step out of the house.</li>
<li><strong>Busy professionals</strong> — get the care you need without disrupting your schedule.</li>
<li><strong>Individuals with chronic pain or disabilities</strong> — a targeted plan to help you manage pain and improve your quality of life.</li>
</ul>
<h2>Why Choose The Fysit for Doorstep Physiotherapy?</h2>
<p>Our team includes licensed professionals with years of proven experience. Our patients trust us because they see results — from improved mobility to reduced pain. At The Fysit, you’re more than just a patient: we take the time to understand your concerns, answer your questions, and tailor our treatments to your unique needs.</p>`,
    icon: ICON("back-neck"),
    features: [
      "One-on-one care in the comfort of your home",
      "No travel or waiting-room hassles",
      "Ideal for elderly patients and post-surgical rehabilitation",
      "Chronic pain management",
      "Qualified, experienced physiotherapists",
      "Compassionate, personalised treatment",
    ],
    process: [],
    faqs: [],
    seo: {
      title: "Physiotherapy at Home in Bangalore",
      description:
        "Expert doorstep physiotherapy in Bangalore for seniors, post-surgery recovery, chronic pain and busy professionals.",
    },
  },
  {
    name: "Corporate Wellness Programs",
    slug: "corporate-wellness",
    tagline: "For a healthier, more productive workplace.",
    shortDescription:
      "Specialised wellness programs designed to help organisations promote employee well-being, with services that support both physical and mental health.",
    description: `
<p>In today’s corporate hustle, workplace wellness is no longer just a trend — it’s a necessity. By prioritising employee health and investing in corporate wellness programs, you can build a happier, healthier workforce that directly contributes to your company’s success. Employees who feel valued and supported are more engaged and satisfied, leading to a more positive work culture and better results.</p>
<h2>Ergonomics Workshops</h2>
<p>Whether it’s ergonomic workshops to reduce workplace strain, group fitness classes to boost energy levels, or mental health support to promote emotional wellness, we offer a comprehensive approach to employee care. Our programs are flexible, so they can be easily integrated into any work environment.</p>
<h2>Mental Wellness Programs</h2>
<p>Mental health is just as important as physical health. From expert counselling and stress management workshops to mindfulness practices, we help employees tackle the challenges of a fast-paced work environment.</p>
<h2>Fitness Programs</h2>
<p>Our corporate fitness programs include both onsite and virtual group fitness classes — yoga, cardio and flexibility exercises — making it easy for employees to stay fit, whether they work from the office or remotely.</p>
<h2>Flexible Wellness Programs to Suit Your Needs</h2>
<p>Whether you’re a small startup, a mid-sized company, or a large corporation, we’ll work with you to curate a program that meets your company’s goals and challenges, and adapt it as your business grows.</p>`,
    icon: ICON("exercise-therapy"),
    features: [
      "Tailored solutions for businesses of all sizes",
      "A dedicated team of wellness professionals",
      "Proven results in improving workplace health",
      "Onsite and virtual wellness options",
      "Higher employee retention",
      "Lower healthcare costs and better team collaboration",
    ],
    process: [],
    faqs: [
      {
        question: "What are corporate wellness programs, and why are they a worthy investment?",
        answer:
          "Our Corporate Ergonomics Program can significantly improve employee well-being and productivity. By optimizing workstations and providing ergonomic training, we help reduce musculoskeletal disorders, increase employee comfort, and enhance overall workplace efficiency.",
      },
    ],
    seo: {
      title: "Corporate Wellness Programs in Bangalore",
      description:
        "Ergonomics workshops, mental wellness and fitness programs that improve employee well-being and productivity.",
    },
  },
  {
    name: "Ergonomics Training",
    slug: "ergonomics-training",
    tagline: "Boost workplace wellness with expert ergonomics workshops.",
    shortDescription:
      "Hands-on workshops that help employees set up healthier, more efficient workspaces — in the office or at home.",
    description: `
<p>If your employees spend long hours sitting at their desks, it’s a cause for concern. Prolonged sitting and poorly arranged workstations can gradually impact their health and energy levels, leading to discomfort and decreased performance over time.</p>
<h2>Why Workplace Ergonomics Training Matters</h2>
<p>Hours of sitting, poorly arranged workstations and repetitive movements often lead to chronic pain, fatigue and reduced productivity. The good news? These problems are preventable. Businesses investing in effective ergonomics training experience fewer injuries, lower absenteeism and a more engaged workforce.</p>
<h2>Corporate Posture Correction Programs</h2>
<p>Slouching, forward head posture and rounded shoulders can lead to long-term musculoskeletal disorders. Our specialists use proven techniques to improve posture, relieve strain and enhance spinal health.</p>
<h2>Ergonomic Desk Setup Workshops</h2>
<p>Even small adjustments make a huge difference. We guide employees in setting up their workstations correctly — from monitor heights and chair positions to keyboard and mouse placement — to reduce stress on the neck, back and wrists.</p>
<h2>Remote Worker Ergonomics</h2>
<p>Dining tables and couches may be convenient but can lead to discomfort and injury. Our online workshops teach remote employees how to create ergonomic home offices, maintain good posture and build regular movement into their workday.</p>`,
    icon: ICON("back-neck"),
    features: [
      "Healthier employees with fewer back, neck and wrist complaints",
      "Prevention of repetitive strain injuries",
      "Workplace safety training",
      "Programs for in-office and remote teams",
      "Certified ergonomists and physiotherapists",
      "Measurable results and follow-up support",
    ],
    process: [
      {
        title: "Initial evaluation",
        description:
          "We check workspaces to see how your team uses their desks, chairs and tools, spotting any ergonomic red flags.",
      },
      {
        title: "Customised solutions",
        description:
          "Based on our findings we suggest easy fixes — adjusting monitor heights, rearranging keyboards or introducing ergonomic accessories.",
      },
      {
        title: "Interactive training workshops",
        description: "Through hands-on workshops or quick virtual sessions, we guide your team on better posture and habits.",
      },
      {
        title: "Follow-up and monitoring",
        description:
          "We follow up to make sure our recommendations make a real difference, with periodic refresher sessions as needs change.",
      },
    ],
    faqs: [
      {
        question: "How can the Corporate Ergonomics Program benefit a company?",
        answer:
          "Our Corporate Ergonomics Program can significantly improve employee well-being and productivity. By optimizing workstations and providing ergonomic training, we help reduce musculoskeletal disorders, increase employee comfort, and enhance overall workplace efficiency.",
      },
    ],
    seo: {
      title: "Workplace Ergonomics Training",
      description:
        "Ergonomics workshops for office and remote teams: posture correction, desk setup and injury prevention led by physiotherapists.",
    },
  },
  {
    name: "Home Office Ergonomics Consulting",
    slug: "home-office-ergonomics",
    tagline: "Make your home office feel good.",
    shortDescription:
      "Tailored assessments that guide you in adjusting your furniture, screen setup and posture to ensure comfort and prevent work-related injuries.",
    description: `
<p>Many of us spend hours working from home. A poorly set-up workspace can lead to poor posture, chronic back pain, eye strain, neck stiffness and other repetitive stress injuries. Our home office ergonomics consulting helps you prevent discomfort and optimise your workspace for comfort and productivity.</p>
<h2>Comprehensive Ergonomic Assessment</h2>
<p>Our consultants evaluate your home office to identify postural issues and ergonomic risks, looking at chair positioning and support, desk height and arrangement, and monitor and keyboard placement.</p>
<h2>Personalised Recommendations</h2>
<p>We provide physiotherapy-backed recommendations, including advice on adjustable chairs, standing desks, footrests and monitor risers, and guidance on positioning your equipment.</p>
<h2>Posture &amp; Movement Optimisation</h2>
<p>We cover correct sitting posture to reduce neck, back and wrist strain, best practices for alternating between sitting and standing, and custom stretching exercises to prevent stiffness.</p>
<h2>Lighting &amp; Environment</h2>
<p>Proper lighting reduces eye strain, and adjustments to temperature, noise and layout help you concentrate.</p>
<h2>Who Needs a Home Office Ergonomics Consultant?</h2>
<ul>
<li>Remote workers spending long hours at home and experiencing discomfort</li>
<li>Entrepreneurs and freelancers setting up or improving a home office</li>
<li>Individuals recovering from injuries who need a safe setup</li>
<li>Companies supporting employees who work remotely</li>
</ul>`,
    icon: ICON("knee-pain"),
    features: [
      "Boosts productivity with less fatigue",
      "Lowers the long-term risk of musculoskeletal disorders",
      "Improves comfort and focus",
      "Trained in both physiotherapy and ergonomics",
      "Personalised, science-backed solutions",
      "Online and in-person consultations",
    ],
    process: [
      {
        title: "Ergonomic assessment",
        description: "A thorough evaluation of your chair, desk, monitor and keyboard setup.",
      },
      {
        title: "Personalised recommendations",
        description: "Physiotherapy-backed advice on furniture, accessories and equipment positioning.",
      },
      {
        title: "Posture & movement plan",
        description: "Correct sitting posture, sit–stand routines and custom stretches to prevent stiffness.",
      },
    ],
    faqs: [],
    seo: {
      title: "Home Office Ergonomics Consulting",
      description:
        "Physiotherapy-backed home office assessments to fix posture, desk setup and lighting for pain-free remote work.",
    },
  },
  {
    name: "Group Fitness Classes",
    slug: "group-fitness-classes",
    tagline: "Energise your team with corporate group fitness.",
    shortDescription:
      "Physiotherapist-led group sessions that help desk-bound teams stay active, improve posture and build team spirit.",
    description: `
<p>Sitting for long periods is harmful to your back and overall health. Many employees struggle with back pain, poor posture and low energy levels, which can affect their work and happiness. Our corporate group fitness training helps your team improve their posture and gain more energy, flexibility and a sense of unity.</p>
<h2>What Makes Our Group Fitness Training Unique?</h2>
<p>Every session is crafted and led by physiotherapists, so the exercises are safe, effective and tailored to prevent injuries while correcting posture. Our routines are adapted for desk workers, and they’re safe for every fitness level — from enthusiasts to those just starting out.</p>
<h2>More Than Just a Workout</h2>
<p>We focus on corporate health and well-being with customisable sessions for flexibility, mobility or stress relief. Regular exercise leads to increased focus, reduced absenteeism and higher motivation.</p>
<h2>Modes of Training</h2>
<p>Choose on-site sessions at your workplace, virtual classes for remote teams, or a mix of both.</p>`,
    icon: ICON("exercise-therapy"),
    features: [
      "Improves posture and ergonomics",
      "Prevents workplace injuries",
      "Enhances productivity",
      "Boosts mental health and reduces stress",
      "Encourages team bonding",
      "On-site, virtual or hybrid sessions",
    ],
    process: [
      {
        title: "Warm-up & posture alignment (5–10 mins)",
        description: "Light stretching and posture exercises to prepare your body for the workout.",
      },
      {
        title: "Customised group workout (30–45 mins)",
        description: "Strength, mobility and flexibility training, with every move designed to support your posture.",
      },
      {
        title: "Cool-down & stretching (10 mins)",
        description: "A cool-down to reduce strain and aid recovery, so you leave refreshed and energised.",
      },
    ],
    faqs: [],
    seo: {
      title: "Corporate Group Fitness Classes in Bangalore",
      description:
        "Physiotherapist-led group fitness for desk-bound teams: better posture, fewer injuries and more energy, on-site or virtual.",
    },
  },
  {
    name: "Mental Wellness Programs",
    slug: "mental-wellness-program",
    tagline: "Transform workplace culture with mental wellness.",
    shortDescription:
      "Programs that help employees manage stress, prevent burnout and stay motivated — for a healthier, happier workplace.",
    description: `
<p>Employees juggling deadlines, meetings and daily challenges often pay a hefty price with their mental wellness. Stress, burnout and anxiety directly affect both productivity and job satisfaction. Companies investing in workplace mental wellness see higher engagement, better performance and improved retention.</p>
<h2>Tailored Mental Health Support for Your Team</h2>
<ul>
<li><strong>Group therapy sessions</strong> — safe spaces for employees to discuss their struggles and find support.</li>
<li><strong>Stress management workshops</strong> — practical tools and techniques to handle workplace stress.</li>
<li><strong>Crisis support</strong> — immediate help for employees facing urgent mental health challenges.</li>
</ul>
<h2>What Makes Our Programs Stand Out</h2>
<p>Every workplace is different, so we tailor our programs to your company’s culture. HR managers receive insights to measure impact, and employees feel safe knowing their concerns are handled privately.</p>`,
    icon: ICON("foot-ankle"),
    features: [
      "Employees feel more motivated and focused",
      "Better teamwork and communication",
      "Reduced stress and clearer thinking",
      "Customised strategies for your culture",
      "Data-driven insights for HR",
      "Confidential and inclusive support",
    ],
    process: [
      {
        title: "Initial consultation",
        description: "We meet with HR and management to understand your workplace needs.",
      },
      {
        title: "Finding stressors",
        description: "An employee assessment identifies the key stressors and mental wellness gaps.",
      },
      {
        title: "Tailoring the solution",
        description: "Targeted coaching sessions and group workshops create a sustainable support system.",
      },
      {
        title: "Ongoing evaluation",
        description: "We continuously monitor results and adjust the program to keep it effective.",
      },
    ],
    faqs: [],
    seo: {
      title: "Workplace Mental Wellness Programs",
      description:
        "Group therapy, stress management workshops and crisis support that help employees manage stress and avoid burnout.",
    },
  },
  {
    name: "Virtual Fitness Classes & Webinars",
    slug: "virtual-fitness-classes",
    tagline: "Expert-led virtual wellness sessions for your team.",
    shortDescription:
      "Our live and recorded fitness sessions, and wellness webinars, provide you with the resources you need to stay active and informed.",
    description: `
<p>Keeping employees healthy and engaged in today’s hybrid and remote work environment is more important than ever. We bring virtual fitness classes and webinars to your employees, helping them stay active, reduce stress and boost productivity — from the comfort of their homes or offices.</p>
<h2>Why Virtual Corporate Wellness Matters</h2>
<p>A healthy workforce is a productive workforce. Our expert-led online sessions help employees build fitness and mindfulness into their daily routines, leading to improved performance and job satisfaction.</p>
<h2>Why Choose The Fysit for Virtual Wellness?</h2>
<p>Sessions are led by certified fitness instructors and physiotherapists, use physiotherapy-backed exercises to prevent injuries and improve mobility, and are fully customisable — you choose the fitness styles, wellness topics and schedule that suit your team.</p>`,
    icon: ICON("sports-injury"),
    features: [
      "Improves employee engagement and productivity",
      "Reduces work-related stress and burnout",
      "Better posture through guided exercises",
      "Certified trainers and health experts",
      "Flexible, customisable programs",
      "Live and recorded sessions",
    ],
    process: [],
    faqs: [],
    seo: {
      title: "Virtual Fitness Classes & Wellness Webinars",
      description:
        "Live and recorded fitness classes and wellness webinars for remote and hybrid teams, led by certified trainers and physiotherapists.",
    },
  },
];

async function main() {
  const { Service } = await import("../src/models/Service");

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Add it to your .env.local file.");
  }

  const status = process.argv.includes("--draft") ? "DRAFT" : "PUBLISHED";
  await mongoose.connect(mongoUri);

  const last = await Service.findOne().sort({ displayOrder: -1 }).select("displayOrder").lean();
  let nextOrder = last ? last.displayOrder + 1 : 0;
  let created = 0;

  for (const service of SERVICES) {
    if (await Service.exists({ slug: service.slug })) {
      console.log(`  skipped  ${service.slug} (already exists)`);
      continue;
    }

    await Service.create({
      ...service,
      description: service.description.trim(),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
      displayOrder: nextOrder++,
    });
    created++;
    console.log(`  created  ${service.slug}`);
  }

  console.log(`\n${created} service(s) imported as ${status}, ${SERVICES.length - created} skipped.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Service import failed:", error);
  process.exit(1);
});
