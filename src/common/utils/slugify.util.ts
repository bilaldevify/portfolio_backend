/**
 * Converts a string into a URL-safe slug.
 * e.g. "My Awesome Project!" -> "my-awesome-project"
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
