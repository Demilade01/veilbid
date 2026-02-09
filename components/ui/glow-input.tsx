"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowInputVariants = cva(
  "w-full bg-veil-surface border rounded-xl px-4 py-3 text-veil-text placeholder:text-veil-text-dim transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-veil-border focus:border-veil-purple/50 focus:ring-2 focus:ring-veil-purple/20",
        glow: "border-veil-purple/30 focus:border-veil-purple/60 focus:ring-2 focus:ring-veil-purple/30 focus:glow-sm",
        error:
          "border-red-500/50 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/20",
        success:
          "border-emerald-500/50 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20",
      },
      inputSize: {
        sm: "h-9 text-sm px-3 py-2",
        default: "h-11 text-base",
        lg: "h-14 text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface GlowInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof glowInputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suffix?: string;
}

const GlowInput = React.forwardRef<HTMLInputElement, GlowInputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      suffix,
      type,
      ...props
    },
    ref
  ) => {
    const inputVariant = error ? "error" : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-veil-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-veil-text-dim">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              glowInputVariants({ variant: inputVariant, inputSize, className }),
              leftIcon && "pl-11",
              (rightIcon || suffix) && "pr-11"
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-veil-text-dim text-sm font-medium">
              {suffix}
            </div>
          )}
          {rightIcon && !suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-veil-text-dim">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-veil-text-dim">{hint}</p>
        )}
      </div>
    );
  }
);

GlowInput.displayName = "GlowInput";

export { GlowInput, glowInputVariants };
