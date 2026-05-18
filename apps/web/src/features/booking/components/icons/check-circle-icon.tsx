import type { SVGProps } from "react";

export const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" fill="currentColor" r="10" />
    <path
      d="M8.25 12.2l2.35 2.35 5.15-5.6"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
