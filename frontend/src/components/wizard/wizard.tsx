import { useEffect, useRef } from "react";

interface WizardProps {
  
  size?: number;
  
  intensity?: number;
  
  onClick?: () => void;
}

export function Wizard({ size = 240, intensity = 1, onClick }: WizardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);


  const targetRef = useRef({ x: 0, y: 0 });


  const headRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const armRef = useRef<SVGGElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const beardRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const wholeRef = useRef<HTMLDivElement>(null);
  const pendantRef = useRef<SVGGElement>(null);
  const bookRef = useRef<SVGGElement>(null);
  const crystalGlowRef = useRef<SVGCircleElement>(null);
  const crystalShineRef = useRef<SVGPathElement>(null);
  const auraRef = useRef<SVGEllipseElement>(null);
  const particleRefs = useRef<(SVGGElement | null)[]>([]);


  const stateRef = useRef({
    head: { x: 0, y: 0, rot: 0 },
    pupil: { x: 0, y: 0 },
    arm: { rot: 0 },
    leftArm: { rot: 0 },
    breath: 0,
    float: 0,
    beard: 0,
    pendant: 0,
    crystal: 0,
    t: 0,
  });

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const state = stateRef.current;

    
    const lerp = (current: number, target: number, factor: number, dt: number) => {
      const t = 1 - Math.exp(-factor * dt);
      return current + (target - current) * t;
    };

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.t += dt;

      const tx = targetRef.current.x;
      const ty = targetRef.current.y;


      state.pupil.x = lerp(state.pupil.x, tx * 1.8 * intensity, 22, dt);
      state.pupil.y = lerp(state.pupil.y, ty * 1.6 * intensity, 22, dt);
      state.head.x = lerp(state.head.x, tx * 5 * intensity, 9, dt);
      state.head.y = lerp(state.head.y, ty * 4 * intensity, 9, dt);
      state.head.rot = lerp(state.head.rot, tx * 9 * intensity, 8, dt);
      state.arm.rot = lerp(state.arm.rot, ty * 28 * intensity, 6, dt);
      state.leftArm.rot = lerp(state.leftArm.rot, tx * -4 * intensity, 5, dt);


      state.breath = Math.sin(state.t * 1.6) * 0.5;
      state.float = Math.sin(state.t * 1.2) * 3;
      state.beard = Math.sin(state.t * 1.8) * 1.5;
      state.pendant = Math.sin(state.t * 2.5) * 1.5;
      state.crystal = 0.7 + 0.3 * Math.abs(Math.sin(state.t * 2.2));


      if (wholeRef.current) {
        wholeRef.current.style.transform = `translateY(${state.float}px)`;
      }
      headRef.current?.setAttribute(
        "transform",
        `translate(${state.head.x},${state.head.y}) rotate(${state.head.rot} 100 80)`,
      );
      pupilsRef.current?.setAttribute(
        "transform",
        `translate(${state.pupil.x},${state.pupil.y})`,
      );
      armRef.current?.setAttribute("transform", `rotate(${state.arm.rot} 125 130)`);
      leftArmRef.current?.setAttribute("transform", `rotate(${state.leftArm.rot} 75 130)`);
      beardRef.current?.setAttribute("transform", `translate(${state.beard},0)`);

      const sy = 1 + state.breath * 0.012;
      const sx = 1 + state.breath * 0.005;
      bodyRef.current?.setAttribute(
        "transform",
        `translate(100,200) scale(${sx},${sy}) translate(-100,-200)`,
      );
      pendantRef.current?.setAttribute("transform", `translate(0,${state.pendant})`);
      bookRef.current?.setAttribute("transform", `translate(0,${state.breath * 1.5})`);

      crystalGlowRef.current?.setAttribute("r", String(6 + state.crystal * 3));
      crystalGlowRef.current?.setAttribute("opacity", String(0.15 + state.crystal * 0.15));
      crystalShineRef.current?.setAttribute("opacity", String(0.4 + state.crystal * 0.3));
      auraRef.current?.setAttribute("opacity", String(0.15 + state.crystal * 0.08));


      const PARTICLE_BASE = [
        { baseX: 35, baseY: 60, amp: 8, speed: 1.3 },
        { baseX: 165, baseY: 90, amp: 10, speed: 1.0 },
        { baseX: 145, baseY: 200, amp: 6, speed: 1.7 },
        { baseX: 30, baseY: 180, amp: 9, speed: 1.4 },
        { baseX: 105, baseY: 30, amp: 5, speed: 2.0 },
      ];
      for (let i = 0; i < PARTICLE_BASE.length; i++) {
        const p = PARTICLE_BASE[i]!;
        const g = particleRefs.current[i];
        if (!g) continue;
        const px = Math.cos(state.t * p.speed + i) * p.amp;
        const py = Math.sin(state.t * p.speed * 1.3 + i) * p.amp;
        const op = 0.4 + 0.4 * Math.abs(Math.sin(state.t * 1.5 + i * 1.2));
        g.setAttribute("transform", `translate(${px},${py})`);
        g.setAttribute("opacity", String(op));
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intensity]);


  useEffect(() => {
    function onMove(clientX: number, clientY: number) {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(window.innerWidth, window.innerHeight) / 2;
      targetRef.current.x = Math.max(-1, Math.min(1, (clientX - cx) / radius));
      targetRef.current.y = Math.max(-1, Math.min(1, (clientY - cy) / radius));
    }
    function handleMouse(e: MouseEvent) { onMove(e.clientX, e.clientY); }
    function handleTouch(e: TouchEvent) {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    }
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  const particleColors = [
    { hue: 50 }, { hue: 280 }, { hue: 195 }, { hue: 330 }, { hue: 50 },
  ];
  const particleBase = [
    { x: 35, y: 60 }, { x: 165, y: 90 }, { x: 145, y: 200 },
    { x: 30, y: 180 }, { x: 105, y: 30 },
  ];

  return (
    <div
      ref={wrapperRef}
      onClick={onClick}
      style={{
        width: size,
        height: size * 1.2,
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
      }}
    >
      <div ref={wholeRef} style={{ width: "100%", height: "100%", willChange: "transform" }}>
        <svg
          viewBox="0 0 200 240"
          width="100%" height="100%"
          style={{
            overflow: "visible",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
          }}
        >
          <defs>
            <linearGradient id="wz-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b35a8" />
              <stop offset="50%" stopColor="#3d1466" />
              <stop offset="100%" stopColor="#1a052e" />
            </linearGradient>
            <linearGradient id="wz-hood-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1a052e" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="wz-crystal" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#a5e8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.85" />
            </radialGradient>
            <linearGradient id="wz-beard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8ec" />
              <stop offset="100%" stopColor="#a8a8b0" />
            </linearGradient>
            <linearGradient id="wz-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4d6b8" />
              <stop offset="100%" stopColor="#d4a87f" />
            </linearGradient>
            <linearGradient id="wz-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3a2410" />
              <stop offset="50%" stopColor="#5e3d1f" />
              <stop offset="100%" stopColor="#3a2410" />
            </linearGradient>
            <radialGradient id="wz-crystal-glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#a5e8ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a5e8ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wz-book" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a3b14" />
              <stop offset="100%" stopColor="#3d1c08" />
            </linearGradient>
          </defs>

          {}
          <ellipse ref={auraRef} cx="100" cy="120" rx="95" ry="115"
            fill="url(#wz-crystal-glow)" opacity="0.2" />

          {}
          {particleBase.map((p, i) => (
            <g key={i} ref={(el) => { particleRefs.current[i] = el; }}>
              <circle cx={p.x} cy={p.y} r="2.5"
                fill={`hsl(${particleColors[i]!.hue},85%,75%)`}
                style={{ filter: `blur(0.5px) drop-shadow(0 0 4px hsl(${particleColors[i]!.hue},85%,65%))` }} />
              <text x={p.x} y={p.y + 2} fontSize="6"
                fill={`hsl(${particleColors[i]!.hue},85%,80%)`}
                textAnchor="middle" opacity="0.7">✦</text>
            </g>
          ))}

          {}
          <g ref={bodyRef}>
            <ellipse cx="100" cy="232" rx="55" ry="6" fill="#000" opacity="0.5" />
            <path d="M 100,90 L 60,110 L 35,225 Q 100,240 165,225 L 140,110 Z"
              fill="url(#wz-robe)" stroke="#d4af37" strokeWidth="1.2" />
            <path d="M 70,140 Q 75,180 65,220" stroke="#1a052e" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 100,130 Q 100,180 100,228" stroke="#1a052e" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 130,140 Q 125,180 135,220" stroke="#1a052e" strokeWidth="1.5" fill="none" opacity="0.6" />

            <text x="55" y="160" fontSize="11" fill="#fbbf24" opacity="0.9">✦</text>
            <text x="85" y="180" fontSize="8" fill="#fbbf24" opacity="0.7">✧</text>
            <text x="120" y="155" fontSize="9" fill="#fbbf24" opacity="0.85">✦</text>
            <text x="140" y="195" fontSize="7" fill="#fbbf24" opacity="0.7">✧</text>
            <text x="70" y="210" fontSize="6" fill="#fbbf24" opacity="0.65">✦</text>
            <text x="115" y="215" fontSize="8" fill="#fbbf24" opacity="0.8">✦</text>
            <text x="95" y="125" fontSize="6" fill="#fbbf24" opacity="0.7">✧</text>

            <rect x="55" y="140" width="90" height="6" fill="#5a3a14" stroke="#d4af37" strokeWidth="0.5" rx="1" />
            <circle cx="100" cy="143" r="4" fill="#d4af37" stroke="#8b6914" strokeWidth="0.5" />
            <circle cx="100" cy="143" r="1.5" fill="#8b6914" />
          </g>

          {}
          <g ref={leftArmRef} style={{ willChange: "transform" }}>
            <path d="M 75,125 Q 60,135 50,160 Q 45,175 55,180 L 70,170 Q 78,150 80,135 Z"
              fill="url(#wz-robe)" stroke="#d4af37" strokeWidth="0.8" />
            <ellipse cx="55" cy="178" rx="6" ry="5" fill="url(#wz-skin)" />
            <g ref={bookRef}>
              <rect x="42" y="172" width="22" height="28" rx="1.5"
                fill="url(#wz-book)" stroke="#d4af37" strokeWidth="0.8" />
              <rect x="44" y="174" width="18" height="24" rx="0.5"
                fill="none" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
              <circle cx="53" cy="186" r="2.5" fill="#d4af37"
                style={{ filter: "drop-shadow(0 0 3px #fbbf24)" }} />
              <text x="53" y="195" fontSize="4" fill="#d4af37" textAnchor="middle" opacity="0.8">✦</text>
            </g>
          </g>

          {}
          <g ref={armRef} style={{ willChange: "transform" }}>
            <path d="M 125,125 Q 140,138 152,165 Q 156,178 145,182 L 130,170 Q 122,150 120,135 Z"
              fill="url(#wz-robe)" stroke="#d4af37" strokeWidth="0.8" />
            <ellipse cx="148" cy="180" rx="6" ry="5" fill="url(#wz-skin)" />
            <rect x="146" y="100" width="4" height="100"
              fill="url(#wz-wood)" stroke="#2a1808" strokeWidth="0.4" rx="1.5" />
            <ellipse cx="148" cy="130" rx="2.2" ry="1" fill="#3a2410" />
            <ellipse cx="148" cy="160" rx="2.2" ry="1" fill="#3a2410" />
            <path d="M 142,108 Q 148,100 154,108 Q 152,112 148,110 Q 144,112 142,108 Z"
              fill="url(#wz-wood)" stroke="#2a1808" strokeWidth="0.5" />
            <path d="M 148,90 L 153,100 L 148,108 L 143,100 Z"
              fill="url(#wz-crystal)" stroke="#fff" strokeWidth="0.5" opacity="0.95" />
            <path ref={crystalShineRef} d="M 148,90 L 153,100 L 148,103 Z"
              fill="#fff" opacity="0.5" />
            <circle ref={crystalGlowRef} cx="148" cy="99" r="6" fill="#a5e8ff" opacity="0.2" />
          </g>

          {}
          <g ref={headRef} style={{ willChange: "transform" }}>
            <path d="M 100,15 L 65,40 Q 50,75 55,105 L 145,105 Q 150,75 135,40 Z"
              fill="url(#wz-robe)" stroke="#d4af37" strokeWidth="1.2" />
            <path d="M 65,40 Q 100,28 135,40" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.7" />
            <ellipse cx="100" cy="78" rx="32" ry="28" fill="url(#wz-hood-inner)" />

            <g ref={pendantRef}>
              <line x1="100" y1="15" x2="100" y2="22" stroke="#d4af37" strokeWidth="0.8" />
              <circle cx="100" cy="24" r="3" fill="#fbbf24"
                style={{ filter: "drop-shadow(0 0 4px #fbbf24)" }} />
              <circle cx="100" cy="24" r="6" fill="#fbbf24" opacity="0.3" />
            </g>

            <text x="72" y="55" fontSize="6" fill="#fbbf24" opacity="0.8">✦</text>
            <text x="123" y="58" fontSize="5" fill="#fbbf24" opacity="0.7">✧</text>

            <ellipse cx="100" cy="80" rx="18" ry="20" fill="url(#wz-skin)" opacity="0.92" />
            <ellipse cx="83" cy="78" rx="6" ry="18" fill="#000" opacity="0.55" />
            <ellipse cx="117" cy="78" rx="6" ry="18" fill="#000" opacity="0.55" />

            <path d="M 88,68 Q 92,66 96,68" stroke="#d8d8dc" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 104,68 Q 108,66 112,68" stroke="#d8d8dc" strokeWidth="2" fill="none" strokeLinecap="round" />

            <ellipse cx="92" cy="76" rx="3.5" ry="2.5" fill="#fff" />
            <ellipse cx="108" cy="76" rx="3.5" ry="2.5" fill="#fff" />

            <g ref={pupilsRef} style={{ willChange: "transform" }}>
              <circle cx="92" cy="76" r="1.8" fill="#1a3050"
                style={{ filter: "drop-shadow(0 0 3px #6ba9ff)" }} />
              <circle cx="108" cy="76" r="1.8" fill="#1a3050"
                style={{ filter: "drop-shadow(0 0 3px #6ba9ff)" }} />
              <circle cx="93" cy="75.5" r="0.6" fill="#fff" />
              <circle cx="109" cy="75.5" r="0.6" fill="#fff" />
            </g>

            <path d="M 100,80 Q 99,85 100,89 Q 102,90 103,88"
              stroke="#a8825c" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M 92,93 Q 96,95 100,94 Q 104,95 108,93"
              stroke="#e8e8ec" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            <g ref={beardRef}>
              <path d="M 86,92 Q 83,108 87,118 Q 92,128 100,130 Q 108,128 113,118 Q 117,108 114,92 Q 110,98 100,99 Q 90,98 86,92 Z"
                fill="url(#wz-beard)" stroke="#a8a8b0" strokeWidth="0.5" />
              <path d="M 92,105 Q 95,115 94,125" stroke="#c8c8cc" strokeWidth="0.6" fill="none" opacity="0.8" />
              <path d="M 100,108 Q 100,120 100,128" stroke="#c8c8cc" strokeWidth="0.6" fill="none" opacity="0.8" />
              <path d="M 108,105 Q 105,115 106,125" stroke="#c8c8cc" strokeWidth="0.6" fill="none" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}