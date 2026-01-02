import * as React from "react";
import { cn } from "@/lib/utils";

export type TextProps = {
  children: React.ReactNode;
  as?:
    | "p"
    | "span"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "label"
    | "small"
    | "div";
  size?: "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  tone?: "default" | "muted" | "success" | "warning" | "danger";
  align?: "left" | "center" | "right";
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

const sizeClasses: Record<NonNullable<TextProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const weightClasses: Record<NonNullable<TextProps["weight"]>, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const toneClasses: Record<NonNullable<TextProps["tone"]>, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export function Text({
  children,
  as = "span",
  size = "md",
  weight = "normal",
  tone = "default",
  align = "left",
  className,
  ...props
}: TextProps) {
  const Component = as as any;

  return (
    <Component
      className={cn(
        "leading-relaxed",
        sizeClasses[size],
        weightClasses[weight],
        toneClasses[tone],
        align === "center"
          ? "text-center"
          : align === "right"
            ? "text-right"
            : "text-left",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Text;
