interface LivesProps {
  count: number;
  max?: number;
}

export function Lives({ count, max = 3 }: LivesProps) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: max }, (_, i) => {
        const alive = i < count;
        return (
          <span key={i} style={{
            fontSize: 22,
            opacity: alive ? 1 : 0.18,
            filter: alive ? "drop-shadow(0 0 6px rgba(248,113,113,0.7))" : "grayscale(1)",
            transition: "opacity 0.4s, filter 0.4s",
          }}>
            {alive ? "❤️" : "🖤"}
          </span>
        );
      })}
    </div>
  );
}