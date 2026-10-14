import { Check } from 'lucide-react';

export const STEPS = [
  { id: 0, mr: 'माहिती', en: 'Information' },
  { id: 1, mr: 'डिझाईन', en: 'Design' },
  { id: 2, mr: 'पाहा व डाउनलोड', en: 'Preview & Download' },
];

export default function Stepper({ step, onStep }) {
  return (
    <nav aria-label="Progress" className="mx-auto flex w-full max-w-2xl items-center">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => onStep(i)}
              aria-current={active ? 'step' : undefined}
              className="group flex items-center gap-2.5 text-left"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                  active ? 'border-maroon-700 bg-maroon-700 text-white shadow-soft'
                    : done ? 'border-amber-500 bg-amber-500 text-stone-900' : 'border-stone-300 bg-white text-stone-500'
                }`}
              >
                {done ? <Check size={18} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`hidden leading-tight sm:block ${active ? 'text-stone-900' : 'text-stone-500'}`}>
                <span className="block text-sm font-bold">{s.mr}</span>
                <span className="block text-xs">{s.en}</span>
              </span>
            </button>
            {i < STEPS.length - 1 && <div className={`mx-3 h-0.5 flex-1 rounded ${done ? 'bg-amber-500' : 'bg-stone-200'}`} />}
          </div>
        );
      })}
    </nav>
  );
}
