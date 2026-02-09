"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endTimestamp: number;
  className?: string;
  variant?: "default" | "compact" | "large";
  onComplete?: () => void;
  showLabels?: boolean;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

function calculateTimeRemaining(endTimestamp: number): TimeUnit[] {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, endTimestamp - now);

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return [
    { value: days, label: "Days", shortLabel: "d" },
    { value: hours, label: "Hours", shortLabel: "h" },
    { value: minutes, label: "Minutes", shortLabel: "m" },
    { value: seconds, label: "Seconds", shortLabel: "s" },
  ];
}

const TimeBlock = React.memo(function TimeBlock({
  value,
  label,
  shortLabel,
  variant,
  showLabels,
}: TimeUnit & { variant: string; showLabels: boolean }) {
  const displayValue = value.toString().padStart(2, "0");

  if (variant === "compact") {
    return (
      <div className="flex items-baseline gap-0.5">
        <span className="font-mono text-lg font-bold text-veil-text">
          {displayValue}
        </span>
        <span className="text-xs text-veil-text-dim">{shortLabel}</span>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-veil-surface border border-veil-border rounded-xl px-4 py-3 min-w-[72px]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={displayValue}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block font-mono text-3xl font-bold text-veil-text text-center"
              >
                {displayValue}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 rounded-xl bg-veil-purple/5 pointer-events-none" />
        </div>
        {showLabels && (
          <span className="mt-2 text-xs text-veil-text-dim uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center">
      <div className="bg-veil-surface-elevated border border-veil-border rounded-lg px-3 py-2 min-w-[52px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="block font-mono text-xl font-bold text-veil-text text-center"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </div>
      {showLabels && (
        <span className="mt-1.5 text-[10px] text-veil-text-dim uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
});

export function CountdownTimer({
  endTimestamp,
  className,
  variant = "default",
  onComplete,
  showLabels = true,
}: CountdownTimerProps) {
  const [timeUnits, setTimeUnits] = React.useState<TimeUnit[]>(() =>
    calculateTimeRemaining(endTimestamp)
  );
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newUnits = calculateTimeRemaining(endTimestamp);
      setTimeUnits(newUnits);

      // Check if countdown is complete
      const totalSeconds = newUnits.reduce(
        (acc, unit, i) =>
          acc + unit.value * [86400, 3600, 60, 1][i],
        0
      );

      if (totalSeconds === 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp, onComplete, isComplete]);

  // Filter out days if zero for compact display
  const displayUnits =
    variant === "compact" && timeUnits[0].value === 0
      ? timeUnits.slice(1)
      : timeUnits;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "text-amber-400 font-semibold",
          variant === "large" && "text-2xl",
          variant === "compact" && "text-sm",
          className
        )}
      >
        Time&apos;s Up
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center",
        variant === "compact" && "gap-2",
        variant === "default" && "gap-2",
        variant === "large" && "gap-3",
        className
      )}
    >
      {displayUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <TimeBlock
            {...unit}
            variant={variant}
            showLabels={showLabels}
          />
          {index < displayUnits.length - 1 && variant !== "compact" && (
            <span
              className={cn(
                "text-veil-text-dim font-bold",
                variant === "large" && "text-2xl -mt-6",
                variant === "default" && "text-xl -mt-4"
              )}
            >
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
