import type { SVGProps } from "react";

export const PrinterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      d="M7.5 8V4.5h9V8m-9 8v3.5h9V16M6 10h12a2 2 0 012 2v3h-3.5v-2h-9v2H4v-3a2 2 0 012-2z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);
