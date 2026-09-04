import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./section-heading";
import type { FaqItem } from "@/lib/content";

export function FaqSection({
  id,
  title = "Frequently Asked Questions",
  description = "Got questions? Here are answers to the ones I hear most often.",
  items,
}: {
  id?: string;
  title?: string;
  description?: string;
  items: FaqItem[];
}) {
  return (
    <section id={id} className="py-20">
      <div className="container-page">
        <SectionHeading title={title} description={description} />
        <div className="mx-auto mt-10 max-w-2xl">
          <Accordion type="single" collapsible>
            {items.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
