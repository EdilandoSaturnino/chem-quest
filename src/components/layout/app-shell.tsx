import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: theme.colors.bg,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}