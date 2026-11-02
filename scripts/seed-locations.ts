import path from "node:path";
import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()));

/**
 * Imports the two built-in clinic pages (LOCATIONS in src/lib/content.ts —
 * copy from the previous site) into Admin → Locations, so they can be edited
 * there. Safe to re-run: a location whose address already exists is skipped,
 * never overwritten.
 *
 *   npm run seed:locations            → imports as Published
 *   npm run seed:locations -- --draft → imports as Draft, to review first
 */
async function main() {
  const { Location } = await import("../src/models/Location");
  const { LOCATIONS } = await import("../src/lib/content");

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Add it to your .env.local file.");
  }

  const status = process.argv.includes("--draft") ? "DRAFT" : "PUBLISHED";
  await mongoose.connect(mongoUri);

  const last = await Location.findOne().sort({ displayOrder: -1 }).select("displayOrder").lean();
  let nextOrder = last ? last.displayOrder + 1 : 0;
  let created = 0;

  for (const location of LOCATIONS) {
    if (await Location.exists({ slug: location.slug })) {
      console.log(`  skipped  ${location.slug} (already exists)`);
      continue;
    }

    // Photos stay empty: the page's defaults apply until some are uploaded.
    await Location.create({
      name: location.name,
      slug: location.slug,
      title: location.title,
      eyebrow: location.eyebrow,
      heading: location.heading,
      intro: location.intro,
      address: { street: location.address.street, area: location.address.area, city: location.address.city },
      phone: location.phone,
      stats: location.stats,
      approach: { title: location.approach.title, paragraphs: location.approach.paragraphs },
      services: location.services,
      serviceItems: location.serviceItems.map((item) => ({ ...item, href: item.href ?? "" })),
      conditionsTitle: location.conditionsTitle,
      conditions: location.conditions,
      why: location.why,
      corporate: location.corporate,
      faqTitle: location.faqTitle,
      faqs: location.faqs,
      seo: { title: location.metaTitle, description: location.metaDescription },
      status,
      displayOrder: nextOrder++,
    });
    created++;
    console.log(`  created  ${location.slug}`);
  }

  console.log(`\n${created} location(s) imported as ${status}, ${LOCATIONS.length - created} skipped.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Location import failed:", error);
  process.exit(1);
});
