import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.5-1.46h1.6V4.35C16.3 4.24 15.34 4 14.22 4c-2.35 0-3.97 1.44-3.97 4.08V10.5H7.75v3H10.25V21h3.25Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.75a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.2V20H9.35V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.42 0 4.6 2.25 4.6 5.18V20Z" />
    </svg>
  );
}

export function SoundcloudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M2 14.5c0-.28.22-.5.5-.5s.5.22.5.5v3c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3ZM4 13c0-.28.22-.5.5-.5s.5.22.5.5v5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-5Zm2-1.2c0-.28.22-.5.5-.5s.5.22.5.5v6.4c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-6.4Zm2-1c0-.28.22-.5.5-.5s.5.22.5.5v7.4c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-7.4ZM10 8c.28 0 .5.22.5.5v9.13c0 .2-.16.37-.37.37H10c-.28 0-.5-.22-.5-.5V8.5c0-.28.22-.5.5-.5Zm1.6-1.94c.14-.04.29-.06.44-.06.28 0 .5.22.5.5V18h6.32A2.64 2.64 0 0 0 21.5 15.36a2.64 2.64 0 0 0-2.64-2.64c-.24 0-.48.03-.7.1a4.5 4.5 0 0 0-4.35-3.47c-.86 0-1.66.24-2.34.65a.5.5 0 0 1-.87-.34V6.56c0-.2.13-.38.32-.5Z" />
    </svg>
  );
}
