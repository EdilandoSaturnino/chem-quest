import type { ChemicalElement } from "../../domain/elements/element";

interface ElementCardProps {
  element: ChemicalElement;
  selected: boolean;
  disabled?: boolean;
  limitReached?: boolean;
  onClick: () => void;
}

export function ElementCard({
  element: el,
  selected,
  disabled = false,
  limitReached = false,
  onClick,
}: ElementCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="press"
      style={{
        background: selected
          ? `linear-gradient(160deg, hsla(${el.hue},65%,30%,0.95), hsla(${el.hue},80%,15%,0.95))`
          : limitReached
          ? "linear-gradient(160deg, rgba(30,20,10,0.5), rgba(15,10,5,0.6))"
          : "linear-gradient(160deg, rgba(40,28,15,0.65), rgba(20,14,8,0.85))",
        border: selected
          ? `1.5px solid hsla(${el.hue},85%,65%,0.95)`
          : limitReached
          ? "1px dashed rgba(212,175,55,0.15)"
          : "1px solid rgba(212,175,55,0.22)",
        boxShadow: selected
          ? `0 0 18px hsla(${el.hue},85%,55%,0.55), inset 0 0 14px hsla(${el.hue},80%,40%,0.25)`
          : "inset 0 0 6px rgba(0,0,0,0.5)",
        transform: selected ? "translateY(-2px)" : "none",
        opacity: limitReached ? 0.4 : disabled ? 0.5 : 1,
        borderRadius: 10,
        padding: 10,
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
        color: "#e8d5a8",
      }}
    >
      <span style={{
        position: "absolute", top: 6, left: 8,
        fontSize: 14, opacity: 0.5,
        color: selected ? `hsl(${el.hue},60%,80%)` : "#d4af37",
      }}>
        {el.num}
      </span>

      {selected && (
        <span style={{
          position: "absolute", top: 6, right: 8,
          width: 8, height: 8, borderRadius: "50%",
          background: `hsl(${el.hue},90%,72%)`,
          boxShadow: `0 0 8px hsl(${el.hue},90%,60%)`,
        }} />
      )}

      <span style={{
        fontFamily: '"Cinzel", serif', fontWeight: 700, lineHeight: 1,
        fontSize: "clamp(28px, 4.5vw, 48px)", marginBottom: 6,
        color: `hsl(${el.hue},${selected ? 85 : 50}%,${selected ? 80 : 62}%)`,
        textShadow: selected ? `0 0 14px hsl(${el.hue},85%,55%)` : "none",
      }}>
        {el.sym}
      </span>
      <span style={{
        fontSize: 17, lineHeight: 1.1, textAlign: "center",
        color: selected ? `hsl(${el.hue},45%,82%)` : "rgba(232,213,168,0.55)",
      }}>
        {el.real}
      </span>
    </button>
  );
}