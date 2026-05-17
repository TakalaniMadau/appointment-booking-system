import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, invalid = false, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          "flex h-12 w-full appearance-none rounded-field border bg-white/90 px-4 pr-11 text-sm text-brand-navy-950 shadow-soft outline-none transition-all duration-200 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
          invalid
            ? "border-brand-red-500 focus-visible:ring-brand-red-100"
            : "border-brand-navy-200 focus-visible:border-brand-red-500 focus-visible:ring-brand-red-100",
          className,
        )}
        data-invalid={invalid ? "true" : undefined}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brand-navy-500">
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </span>
    </div>
  ),
);

Select.displayName = "Select";
