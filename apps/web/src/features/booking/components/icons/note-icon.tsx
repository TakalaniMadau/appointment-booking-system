import type { SVGProps } from "react";

export const NoteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      d="M7.5 4.5h7l4 4v10a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016.5 18.5v-12A1.5 1.5 0 017.5 4.5z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M10 11h4m-4 3h4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
);
