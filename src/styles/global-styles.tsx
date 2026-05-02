import { useEffect } from "react";

export function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body, #root { height: 100%; margin: 0; padding: 0; }
      button { font-family: inherit; cursor: pointer; }
      input { font-family: inherit; }

      @keyframes pop-in {
        0%   { transform: scale(0.4); opacity: 0; }
        70%  { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse-aura {
        0%, 100% { box-shadow: 0 0 22px rgba(212,175,55,0.45), inset 0 1px 2px rgba(255,255,255,0.3); }
        50%      { box-shadow: 0 0 44px rgba(212,175,55,0.75), inset 0 1px 2px rgba(255,255,255,0.4); }
      }
      @keyframes brew-shake {
        0%, 100% { transform: translateX(0); }
        25%      { transform: translate(-2px, 1px); }
        75%      { transform: translate(2px, -1px); }
      }
      @keyframes result-rise {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes liquid-fill {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
      }
      @keyframes bubble-rise {
        0%   { transform: translateY(0) scale(1);   opacity: 0; }
        15%  { opacity: 0.85; }
        100% { transform: translateY(-25px) scale(0.4); opacity: 0; }
      }
      @keyframes fade-up {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes glow-correct {
        0%, 100% { box-shadow: 0 0 0 rgba(16,217,106,0); }
        50%      { box-shadow: 0 0 30px rgba(16,217,106,0.7); }
      }
      .press:active:not(:disabled) { transform: translateY(2px) scale(0.97); }
      .scrollbar::-webkit-scrollbar { width: 8px; }
      .scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
      .scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    `} </style>
  );
}