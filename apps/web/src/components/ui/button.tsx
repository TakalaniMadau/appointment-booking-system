import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill border font-semibold transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-brand-blue-100 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "border-brand-blue-600 bg-brand-blue-600 text-white shadow-action hover:border-brand-blue-700 hover:bg-brand-blue-700",
        secondary:
          "border-slate-200 bg-white text-brand-blue-700 shadow-soft hover:border-brand-blue-200 hover:bg-brand-blue-50",
        ghost:
          "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        quiet:
          "border-slate-200 bg-white text-slate-900 shadow-soft hover:border-brand-blue-200 hover:bg-slate-50",
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
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, children, className, size, type = "button", variant, ...props },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;

      return cloneElement(child, {
        className: cn(child.props.className, classes),
      });
    }

    return (
      <button
        className={classes}
        ref={ref}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
