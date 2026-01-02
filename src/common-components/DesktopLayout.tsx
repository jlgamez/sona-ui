import React from "react";
import clsx from "clsx";

export type DesktopLayoutProps = {
  children: React.ReactNode;
  /**
   * Max content width. Number is interpreted as px.
   * Defaults to 1200 (px), a common Electron window width.
   */
  maxWidth?: number | string;
  /**
   * Controls how the simulated window height behaves.
   * - "viewport": window fills most of the viewport height (default).
   * - "fixed": fixed height (e.g. 800px), scrolls internally.
   * - "auto": height is dictated by content.
   */
  heightMode?: "viewport" | "fixed" | "auto";
  /**
   * Whether to render a faux window chrome (titlebar + traffic lights).
   * Mostly useful in development.
   */
  withChrome?: boolean;
  /**
   * If true (default), the sizing + chrome only apply in development.
   * In production, children are rendered without constraints.
   */
  devOnly?: boolean;
  /**
   * Only used when heightMode === "fixed". Number is interpreted as px.
   * Defaults to 800 (px), a common Electron window height.
   */
  fixedHeight?: number | string;
  /**
   * Extra classes for the inner scrollable content area.
   */
  className?: string;
};

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  maxWidth = 1200,
  heightMode = "viewport",
  withChrome = true,
  devOnly = true,
  fixedHeight = 800,
  className,
}) => {
  const isDev = import.meta.env.MODE === "development";

  // In production, or when devOnly is true and we're not in dev, just passthrough.
  if (devOnly && !isDev) {
    if (!className) return <>{children}</>;
    return <div className={className}>{children}</div>;
  }

  const resolvedMaxWidth = `${maxWidth}px`;
  const resolvedFixedHeight = `${fixedHeight}px`;

  // Height styles based on mode.
  const windowHeightStyle: React.CSSProperties = {};

  if (heightMode === "viewport") {
    // Fill most of the viewport, but leave a bit of breathing room.
    windowHeightStyle.maxHeight = "90vh";
    windowHeightStyle.height = "90vh";
  } else if (heightMode === "fixed") {
    windowHeightStyle.height = resolvedFixedHeight;
    // Still cap to viewport so it doesn't overflow on very small displays.
    windowHeightStyle.maxHeight = "100vh";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/80 p-4 sm:p-6">
      <div
        className={clsx(
          "w-full shadow-lg bg-background text-foreground",
          withChrome && "rounded-lg border border-border overflow-hidden",
          !withChrome && "rounded-md overflow-hidden",
        )}
        style={{
          maxWidth: resolvedMaxWidth,
          width: "100%",
          ...windowHeightStyle,
        }}
      >
        {withChrome && (
          <div className="h-8 flex items-center gap-1 px-3 border-b border-border/60 bg-muted/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">
              Dev window {resolvedMaxWidth}
              {heightMode === "fixed" && ` × ${resolvedFixedHeight}`}
              {heightMode === "viewport" && " (viewport)"}
            </span>
          </div>
        )}

        <div
          className={clsx(
            "flex flex-col bg-background",
            // When we have a fixed or viewport height, allow internal scrolling.
            (heightMode === "viewport" || heightMode === "fixed") &&
              "h-full max-h-full overflow-y-auto",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
