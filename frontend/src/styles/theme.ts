export const theme = {
  colors: {
    bg:         "radial-gradient(ellipse at top, #1a0b2e 0%, #0a0612 60%, #04020a 100%)",
    text:       "#e8d5a8",
    textDim:    "rgba(232,213,168,0.55)",
    textFaint:  "rgba(232,213,168,0.4)",
    gold:       "#d4af37",
    goldGlow:   "rgba(212,175,55,0.4)",
    success:    "#10d96a",
    danger:     "#f87171",
    warn:       "#fbbf24",
    cardBg:     "linear-gradient(160deg, rgba(40,28,15,0.7), rgba(20,14,8,0.9))",
    cardBgSoft: "linear-gradient(160deg, rgba(40,28,15,0.6), rgba(20,14,8,0.85))",
    border:     "rgba(212,175,55,0.25)",
    borderStrong: "rgba(212,175,55,0.5)",
  },
  fonts: {
    heading: '"Cinzel", serif',
    body:    '"Cormorant Garamond", Georgia, serif',
  },
  radii: {
    sm:  6,
    md:  10,
    lg:  14,
  },
} as const;


export const goldButtonStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #f4d066 0%, #d4af37 30%, #8b6914 70%, #d4af37 100%)",
  color: "#1a0a02",
  fontFamily: theme.fonts.heading,
  fontWeight: 700,
  letterSpacing: "0.18em",
  border: "1px solid #5a4216",
  textShadow: "0 1px 0 rgba(255,255,255,0.35)",
  borderRadius: theme.radii.sm,
  cursor: "pointer",
};


export const ghostButtonStyle: React.CSSProperties = {
  background: "rgba(40,28,15,0.6)",
  border: `1px solid ${theme.colors.borderStrong}`,
  color: theme.colors.text,
  fontFamily: theme.fonts.heading,
  letterSpacing: "0.16em",
  borderRadius: theme.radii.sm,
  cursor: "pointer",
};