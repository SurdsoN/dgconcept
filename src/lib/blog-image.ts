// Picsum Photos (https://picsum.photos) serves real, freely-usable stock
// photography with no API key and no attribution required. The seed keeps
// each post's photo consistent across renders and sizes.
export function getPostImageUrl(slug: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/${width}/${height}`;
}
