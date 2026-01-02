import * as React from "react";

import { cn } from "@/lib/utils";

export type StackProps = {
  children: React.ReactNode;
  /** Layout direction: vertical (column) or horizontal (row). Defaults to column. */
  direction?: "row" | "column";
  /** Gap between children, e.g. `1`, `2`, `4` => `gap-1`, `gap-2`, `gap-4`. Defaults to 2. */
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** Justify content along the main axis. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Align items along the cross axis. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const directionClasses: Record<NonNullable<StackProps["direction"]>, string> = {
  column: "flex-col",
  row: "flex-row",
};

const justifyClasses: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const alignClasses: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const spacingToGapClass: Record<NonNullable<StackProps["spacing"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export function Stack({
  children,
  direction = "column",
  spacing = 2,
  justify = "start",
  align = "stretch",
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        spacingToGapClass[spacing],
        justifyClasses[justify],
        alignClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Stack;
