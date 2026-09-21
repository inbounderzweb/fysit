import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">{siteConfig.name}</h1>
      <p className="text-neutral-600">{siteConfig.tagline}</p>
      <p className="text-sm text-neutral-500">
        This is a placeholder homepage. Real content is managed through the admin CMS.
      </p>
    </div>
  );
}
