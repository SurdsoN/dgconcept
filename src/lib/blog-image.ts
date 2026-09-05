// Picsum Photos (https://picsum.photos) serves real, freely-usable stock
// photography with no API key and no attribution required. The seed keeps
// each post's photo consistent across renders and sizes.
export function getPostImageUrl(slug: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/${width}/${height}`;
}

// A post's own uploaded image always wins; otherwise fall back to the
// automatic stock photo.
export function resolvePostImage(
  slug: string,
  image: string | null | undefined,
  width: number,
  height: number,
): string {
  return image || getPostImageUrl(slug, width, height);
}
