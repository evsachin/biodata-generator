// Small SVG decorations used by the biodata templates (they use currentColor / CSS variables, so they follow the theme).

export function Corner({ pos }) {
  return (
    <svg className={`bio-corner ${pos}`} viewBox="0 0 74 74" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      <path d="M4 70 V22 Q4 4 22 4 H70" strokeWidth="2.4" />
      <path d="M12 70 V30 Q12 12 30 12 H70" strokeWidth="1" />
      <path d="M22 22 q14 0 14 14 q0 -14 14 -14 q-14 0 -14 -14 q0 14 -14 14z" fill="currentColor" strokeWidth="0" />
      <circle cx="8" cy="8" r="3.4" fill="currentColor" strokeWidth="0" />
      <circle cx="58" cy="8" r="1.8" fill="currentColor" strokeWidth="0" />
      <circle cx="8" cy="58" r="1.8" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export function Toran() {
  const n = 18;
  const step = 722 / n;
  return (
    <svg className="bio-toran" viewBox="0 0 722 58" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 3 H722" stroke="var(--primary)" strokeWidth="4" />
      {Array.from({ length: n }, (_, i) => {
        const x = step / 2 + i * step;
        return (
          <g key={i}>
            <path d={`M${x} 5 C${x - 15} 18 ${x - 11} 42 ${x} 56 C${x + 11} 42 ${x + 15} 18 ${x} 5Z`} fill="var(--accent)" />
            <path d={`M${x} 10 V50`} stroke="var(--bg)" strokeWidth="1.2" opacity="0.6" />
            <circle cx={x + step / 2} cy="15" r="6.5" fill="var(--primary)" />
            <circle cx={x + step / 2} cy="15" r="2.4" fill="var(--bg)" opacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

export function Mandala() {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const petals2 = Array.from({ length: 24 }, (_, i) => i * 15 + 7.5);
  return (
    <svg className="bio-mandala" viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden="true">
      {[96, 90, 62, 38, 14].map((r) => <circle key={r} r={r} />)}
      {petals.map((a) => <path key={a} d="M0 -62 C14 -76 14 -90 0 -96 C-14 -90 -14 -76 0 -62Z" transform={`rotate(${a})`} />)}
      {petals2.map((a) => <path key={a} d="M0 -38 C6 -46 6 -54 0 -60 C-6 -54 -6 -46 0 -38Z" transform={`rotate(${a})`} />)}
      {petals.map((a) => <circle key={`d${a}`} cx="0" cy="-26" r="2" fill="currentColor" transform={`rotate(${a})`} />)}
    </svg>
  );
}
