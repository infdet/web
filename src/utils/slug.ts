/** Convert a human-readable string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
