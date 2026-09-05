import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FlickrIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v6.98A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM21 21h-3.38v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21H9.64V8.5h3.24v1.71h.05c.45-.85 1.56-1.75 3.2-1.75 3.43 0 4.06 2.26 4.06 5.19V21Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.29.638 4.43 1.744 6.256L4 29l7.94-1.706A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.99 0-3.85-.58-5.41-1.58l-.388-.24-4.71 1.012 1-4.59-.253-.401A9.66 9.66 0 0 1 6.3 15c0-5.354 4.35-9.7 9.704-9.7 5.353 0 9.699 4.346 9.699 9.7 0 5.353-4.346 9.7-9.699 9.7Zm5.34-7.27c-.293-.147-1.735-.856-2.004-.955-.269-.098-.464-.147-.66.147-.196.293-.758.955-.929 1.15-.171.196-.342.22-.635.073-.293-.147-1.238-.456-2.358-1.454-.872-.777-1.461-1.737-1.632-2.03-.171-.293-.018-.451.129-.598.132-.132.293-.342.44-.513.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.59-.904-2.178-.238-.572-.48-.494-.66-.503l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.002-1.026 2.443 0 1.44 1.05 2.833 1.196 3.03.147.196 2.067 3.157 5.008 4.428.7.302 1.246.483 1.672.618.702.223 1.341.192 1.846.117.563-.084 1.735-.709 1.98-1.393.244-.685.244-1.271.171-1.393-.073-.122-.269-.196-.562-.343Z" />
    </svg>
  );
}
