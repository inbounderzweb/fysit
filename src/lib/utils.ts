import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPagination(params: { page?: string | number; limit?: string | number }) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function totalPages(totalItems: number, limit: number): number {
  return Math.max(1, Math.ceil(totalItems / limit));
}
