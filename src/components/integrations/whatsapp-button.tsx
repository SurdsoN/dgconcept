import { siteConfig } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons/social-icons";

const defaultMessage = "Hi! I'd like to talk about a website project.";

export function WhatsAppButton() {
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    defaultMessage,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
