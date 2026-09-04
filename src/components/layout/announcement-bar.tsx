import { Rocket } from "lucide-react";

const items = [
  "Shopify Partner",
  "Free Website Audit",
  "Custom Web & Shopify Builds",
  "Worldwide, Remote-First",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2 whitespace-nowrap">
          <Rocket className="h-3.5 w-3.5" />
          {item}
        </span>
      ))}
    </div>
  );
}

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-dark py-2 text-xs font-medium text-white">
      <div className="flex w-max animate-[marquee_28s_linear_infinite]">
        <Row />
        <Row />
      </div>
    </div>
  );
}
