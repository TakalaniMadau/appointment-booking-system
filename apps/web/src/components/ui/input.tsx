import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <input
      className={cn(
        "flex h-12 w-full rounded-field border bg-white/90 px-4 text-sm text-brand-navy-950 shadow-soft outline-none transition-all duration-200 placeholder:text-brand-navy-500/80 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-brand-red-500 focus-visible:ring-brand-red-100"
          : "border-brand-navy-200 focus-visible:border-brand-red-500 focus-visible:ring-brand-red-100",
        className,
      )}
      data-invalid={invalid ? "true" : undefined}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";
