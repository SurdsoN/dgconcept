import Image from "next/image";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export function AuthorBio() {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/images/founder-headshot.jpg"
          alt={siteConfig.founder}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{siteConfig.founder}</p>
        <p className="text-xs text-muted">{siteConfig.founderTitle}</p>
      </div>
    </Card>
  );
}
