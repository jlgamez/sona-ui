import type { ReactNode } from "react";

/** A key drawn as a small keyboard cap. */
export const Keycap = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex min-w-8 items-center justify-center rounded-md border border-b-2 bg-muted px-2 py-0.5 font-sans text-sm font-medium text-foreground shadow-sm">
    {children}
  </kbd>
);

/** The chosen hotkey as a keycap, or plain words while its name is not loaded yet. */
export const HotKeyHint = ({ label }: { label?: string }) =>
  label ? <Keycap>{label}</Keycap> : <>your hotkey</>;
