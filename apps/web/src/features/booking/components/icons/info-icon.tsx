import type { SVGProps } from "react";

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" fill="currentColor" r="10" />
    <path
      d="M12 10.5v5m0-8h.01"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
