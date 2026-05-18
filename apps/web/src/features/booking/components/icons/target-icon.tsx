import type { SVGProps } from "react";

export const TargetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" fill="currentColor" r="1.5" />
    <path
      d="M12 3v3m0 12v3M3 12h3m12 0h3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
);
