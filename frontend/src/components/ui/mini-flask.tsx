interface MiniFlaskProps {
  hue: number;
  filled: boolean;
  bubbling?: boolean;
}

export function MiniFlask({ hue, filled, bubbling = false }: MiniFlaskProps) {
  return (
    <svg width="40" height="50" viewBox="0 0 44 56" style={{
      flexShrink: 0,
      filter: filled ? `drop-shadow(0 0 8px hsla(${hue},80%,55%,0.5))` : "none",
      transition: "filter 0.3s",
    }}>
      <defs>
        <linearGradient id={`flask-liq-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={`hsl(${hue},80%,60%)`} />
          <stop offset="100%" stopColor={`hsl(${hue},75%,28%)`} />
        </linearGradient>
        <clipPath id={`flask-clip-${hue}`}>
          <path d="M 17,5 L 17,18 L 7,46 Q 22,52 37,46 L 27,18 L 27,5 Z" />
        </clipPath>
      </defs>
      {filled && (
        <g clipPath={`url(#flask-clip-${hue})`}>
          <rect x="0" y="22" width="44" height="34" fill={`url(#flask-liq-${hue})`}
            style={{ animation: "liquid-fill 0.5s ease-out" }} />
          {bubbling && [0, 1, 2].map(i => (
            <circle key={i} cx={14 + i * 8} cy="42" r="2"
              fill={`hsla(${hue},90%,85%,0.8)`}
              style={{
                animation: `bubble-rise 1.5s ease-in infinite`,
                animationDelay: `${i * 0.4}s`,
                transformOrigin: `${14 + i * 8}px 42px`,
              }} />
          ))}
        </g>
      )}
      <path d="M 17,5 L 17,18 L 7,46 Q 22,52 37,46 L 27,18 L 27,5"
        fill="none" stroke={filled ? "#d4af37" : "rgba(212,175,55,0.35)"}
        strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="14" y1="5" x2="30" y2="5"
        stroke={filled ? "#d4af37" : "rgba(212,175,55,0.35)"}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}