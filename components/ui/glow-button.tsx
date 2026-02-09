"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const glowButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-veil-purple/50",
  {
    variants: {
      variant: {
        default:
          "bg-veil-gradient-purple text-white rounded-xl hover:glow-md active:scale-[0.98]",
        secondary:
          "bg-veil-surface border border-veil-border text-veil-text-muted rounded-xl hover:border-veil-purple/40 hover:text-veil-text hover:glow-sm active:scale-[0.98]",
        outline:
          "border border-veil-purple/30 bg-transparent text-veil-purple-light rounded-xl hover:bg-veil-purple/10 hover:border-veil-purple/50 hover:glow-sm active:scale-[0.98]",
        ghost:
          "bg-transparent text-veil-text-muted rounded-xl hover:bg-veil-purple/10 hover:text-veil-text active:scale-[0.98]",
        glow: "bg-veil-gradient-purple text-white rounded-xl glow-purple hover:glow-lg active:scale-[0.98] animate-glow-pulse",
        btc: "bg-gradient-to-r from-[#F7931A] to-[#E8850E] text-white rounded-xl hover:glow-btc active:scale-[0.98]",
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
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : motion.button;

    return (
      <Comp
        ref={ref}
        className={cn(glowButtonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            Loading...
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
