import type { SVGProps } from "react";

export const LocationPinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11z"
      fill="currentColor"
    />
    <circle cx="12" cy="10" fill="#ffffff" r="2.5" />
  </svg>
);
