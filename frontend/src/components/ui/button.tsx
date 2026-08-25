import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ghostButtonStyle, goldButtonStyle } from "../../styles/theme";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GoldButton({ children, style, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`press ${rest.className ?? ""}`}
      style={{
        ...goldButtonStyle,
        padding: "10px 28px",
        fontSize: 13,
        ...(disabled && {
          background: "linear-gradient(180deg, #2a1f0a, #1a1006)",
          color: "#5a4a2a",
          cursor: "not-allowed",
          textShadow: "none",
        }),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, style, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`press ${rest.className ?? ""}`}
      style={{
        ...ghostButtonStyle,
        padding: "10px 20px",
        fontSize: 13,
        ...style,
      }}
    >
      {children}
    </button>
  );
}