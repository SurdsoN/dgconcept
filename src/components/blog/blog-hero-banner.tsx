import { ShoppingBag, Code2, SearchCheck, TrendingUp, type LucideIcon } from "lucide-react";

const VARIANTS: { Icon: LucideIcon }[] = [
  { Icon: ShoppingBag },
  { Icon: Code2 },
  { Icon: SearchCheck },
  { Icon: TrendingUp },
];

function pickVariant(seed: string) {
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return VARIANTS[hash % VARIANTS.length];
}

export function BlogHeroBanner({ slug }: { slug: string }) {
  const variant = pickVariant(slug);

  return (
    <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-accent sm:h-64">
      <variant.Icon
        className="absolute -right-6 -bottom-8 h-40 w-40 text-white/15 sm:h-52 sm:w-52"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <variant.Icon className="h-14 w-14 text-white sm:h-16 sm:w-16" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
