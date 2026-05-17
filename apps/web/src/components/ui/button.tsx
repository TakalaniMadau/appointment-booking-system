import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-brand-red-100 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-red-500 text-white shadow-action hover:bg-brand-red-600",
        secondary:
          "bg-brand-navy-950 text-white shadow-soft hover:bg-brand-navy-900",
        ghost:
          "bg-transparent text-brand-navy-950 hover:bg-brand-navy-50 hover:text-brand-navy-950",
        quiet:
          "border border-brand-navy-100 bg-white/80 text-brand-navy-950 shadow-soft hover:bg-white",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, type = "button", ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Button.displayName = "Button";
