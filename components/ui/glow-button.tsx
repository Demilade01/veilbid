"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const glowButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] active:scale-[0.98]",
        secondary:
          "bg-gray-900/80 border border-purple-500/30 text-purple-200 rounded-xl hover:border-purple-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] active:scale-[0.98]",
        outline:
          "border border-purple-500/30 bg-transparent text-purple-300 rounded-xl hover:bg-purple-500/10 hover:border-purple-500/50 active:scale-[0.98]",
        ghost:
          "bg-transparent text-purple-300 rounded-xl hover:bg-purple-500/10 hover:text-white active:scale-[0.98]",
        glow: "bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl shadow-[0_0_25px_rgba(147,51,234,0.6)] hover:shadow-[0_0_35px_rgba(147,51,234,0.8)] active:scale-[0.98]",
        btc: "bg-gradient-to-r from-[#F7931A] to-[#E8850E] text-white rounded-xl hover:shadow-[0_0_20px_rgba(247,147,26,0.5)] active:scale-[0.98]",
        success:
          "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        xs: "h-7 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-14 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(glowButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };
