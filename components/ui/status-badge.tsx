"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Lock,
  Eye,
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-2 font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-veil-surface border border-veil-border text-veil-text-muted",
        commit:
          "bg-blue-500/10 border border-blue-500/30 text-blue-400",
        reveal:
          "bg-veil-purple/10 border border-veil-purple/30 text-veil-purple-light",
        settled:
          "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
        ended:
          "bg-amber-500/10 border border-amber-500/30 text-amber-400",
        success:
          "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
        warning:
          "bg-amber-500/10 border border-amber-500/30 text-amber-400",
        error:
          "bg-red-500/10 border border-red-500/30 text-red-400",
        info:
          "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
        loading:
          "bg-veil-surface border border-veil-border text-veil-text-dim",
      },
      size: {
        sm: "px-2.5 py-1 text-xs rounded-lg",
        default: "px-3.5 py-1.5 text-sm rounded-xl",
        lg: "px-4 py-2 text-base rounded-xl",
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "commit",
        glow: true,
        className: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      },
      {
        variant: "reveal",
        glow: true,
        className: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
      },
      {
        variant: "settled",
        glow: true,
        className: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      },
      {
        variant: "ended",
        glow: true,
        className: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      },
      {
        variant: "success",
        glow: true,
        className: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      },
      {
        variant: "warning",
        glow: true,
        className: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      },
      {
        variant: "error",
        glow: true,
        className: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

// Icon mapping for auction phases
const phaseIcons: Record<string, LucideIcon> = {
  commit: Lock,
  reveal: Eye,
  settled: Trophy,
  ended: Clock,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: AlertCircle,
  loading: Loader2,
  default: AlertCircle,
};

export interface StatusBadgeProps
  extends VariantProps<typeof statusBadgeVariants> {
  icon?: LucideIcon | boolean;
  pulse?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      glow = false,
      icon,
      pulse = false,
      children,
    },
    ref
  ) => {
    // Determine which icon to show
    let IconComponent: LucideIcon | null = null;
    if (icon === true) {
      IconComponent = phaseIcons[variant || "default"] || AlertCircle;
    } else if (icon && typeof icon !== "boolean") {
      IconComponent = icon;
    }

    const iconSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

    return (
      <motion.div
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size, glow, className }))}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {IconComponent && (
          <IconComponent
            className={cn(
              iconSize,
              variant === "loading" && "animate-spin"
            )}
          />
        )}
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                variant === "commit" && "bg-blue-400",
                variant === "reveal" && "bg-veil-purple-light",
                variant === "settled" && "bg-emerald-400",
                variant === "ended" && "bg-amber-400",
                variant === "success" && "bg-emerald-400",
                variant === "warning" && "bg-amber-400",
                variant === "error" && "bg-red-400",
                (!variant || variant === "default" || variant === "info" || variant === "loading") && "bg-veil-text-dim"
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                variant === "commit" && "bg-blue-400",
                variant === "reveal" && "bg-veil-purple-light",
                variant === "settled" && "bg-emerald-400",
                variant === "ended" && "bg-amber-400",
                variant === "success" && "bg-emerald-400",
                variant === "warning" && "bg-amber-400",
                variant === "error" && "bg-red-400",
                (!variant || variant === "default" || variant === "info" || variant === "loading") && "bg-veil-text-dim"
              )}
            />
          </span>
        )}
        {children}
      </motion.div>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
