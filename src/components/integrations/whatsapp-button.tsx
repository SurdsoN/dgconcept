import { siteConfig } from "@/lib/site-config";

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
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.29.638 4.43 1.744 6.256L4 29l7.94-1.706A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.99 0-3.85-.58-5.41-1.58l-.388-.24-4.71 1.012 1-4.59-.253-.401A9.66 9.66 0 0 1 6.3 15c0-5.354 4.35-9.7 9.704-9.7 5.353 0 9.699 4.346 9.699 9.7 0 5.353-4.346 9.7-9.699 9.7Zm5.34-7.27c-.293-.147-1.735-.856-2.004-.955-.269-.098-.464-.147-.66.147-.196.293-.758.955-.929 1.15-.171.196-.342.22-.635.073-.293-.147-1.238-.456-2.358-1.454-.872-.777-1.461-1.737-1.632-2.03-.171-.293-.018-.451.129-.598.132-.132.293-.342.44-.513.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.59-.904-2.178-.238-.572-.48-.494-.66-.503l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.002-1.026 2.443 0 1.44 1.05 2.833 1.196 3.03.147.196 2.067 3.157 5.008 4.428.7.302 1.246.483 1.672.618.702.223 1.341.192 1.846.117.563-.084 1.735-.709 1.98-1.393.244-.685.244-1.271.171-1.393-.073-.122-.269-.196-.562-.343Z" />
      </svg>
    </a>
  );
}
