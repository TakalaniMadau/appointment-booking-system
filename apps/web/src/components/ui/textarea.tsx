import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-field border bg-white px-4 py-3 text-sm text-slate-900 shadow-soft outline-none transition-all duration-200 placeholder:text-slate-400 focus-visible:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70",
        invalid
          ? "border-danger-500 focus-visible:ring-danger-100"
          : "border-slate-200 focus-visible:border-brand-blue-500 focus-visible:ring-brand-blue-100",
        className,
      )}
      data-invalid={invalid ? "true" : undefined}
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
