import { useEffect, useState } from 'react';

type Variant = {
  id: string;
  name: string;
  gradient: string;
  note?: string;
};

// Brand-inspired gradients. These mirror the logo’s palette.
const VARIANTS: Variant[] = [
  {
    id: 'brand-balanced',
    name: 'Balanced (Default)',
    gradient: [
      'radial-gradient(1200px 700px at 8% 0%, rgba(27,59,156,0.48), transparent 65%)',
      'radial-gradient(1200px 700px at 92% 100%, rgba(49,34,122,0.42), transparent 70%)',
      'radial-gradient(1000px 560px at 40% 45%, rgba(41,171,226,0.35), transparent 72%)',
      'radial-gradient(520px 300px at 95% 6%, rgba(245,179,1,0.35), transparent 74%)',
    ].join(', '),
    note: 'Even mix of royal blue, purple, cyan, and golden accent',
  },
  {
    id: 'deep-blue',
    name: 'Royal Blue Emphasis',
    gradient: [
      'radial-gradient(1300px 760px at 12% 0%, rgba(27,59,156,0.62), transparent 65%)',
      'radial-gradient(1200px 700px at 88% 98%, rgba(49,34,122,0.52), transparent 72%)',
      'radial-gradient(900px 520px at 45% 50%, rgba(41,171,226,0.20), transparent 70%)',
      'radial-gradient(440px 260px at 95% 6%, rgba(245,179,1,0.22), transparent 74%)',
    ].join(', '),
    note: 'Stronger blues and purples, subtle cyan and gold',
  },
  {
    id: 'warm-golden',
    name: 'Warm Golden Accent',
    gradient: [
      'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,1) 100%)',
      'radial-gradient(1200px 700px at 10% 5%, rgba(27,59,156,0.34), transparent 65%)',
      'radial-gradient(1200px 700px at 92% 100%, rgba(49,34,122,0.30), transparent 70%)',
      'radial-gradient(980px 560px at 40% 45%, rgba(41,171,226,0.24), transparent 72%)',
      'radial-gradient(620px 360px at 95% 6%, rgba(245,179,1,0.46), transparent 74%)',
    ].join(', '),
    note: 'Brighter feel with stronger gold and lighter base',
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    gradient: [
      'radial-gradient(1200px 700px at 12% 0%, rgba(49,34,122,0.55), transparent 66%)',
      'radial-gradient(1100px 640px at 88% 100%, rgba(27,59,156,0.38), transparent 70%)',
      'radial-gradient(700px 420px at 40% 45%, rgba(41,171,226,0.18), transparent 72%)',
    ].join(', '),
    note: 'Deep purple base with royal blue glow',
  },
  {
    id: 'sky-cyan',
    name: 'Sky Blue Breeze',
    gradient: [
      'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,1) 100%)',
      'radial-gradient(1200px 700px at 30% 5%, rgba(41,171,226,0.38), transparent 68%)',
      'radial-gradient(1000px 560px at 90% 95%, rgba(27,59,156,0.24), transparent 70%)',
    ].join(', '),
    note: 'Airy cyan-led look, soft royal shadow',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    gradient: [
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,1) 100%)',
      'radial-gradient(1000px 600px at 90% 6%, rgba(245,179,1,0.52), transparent 74%)',
      'radial-gradient(1200px 700px at 12% 100%, rgba(49,34,122,0.28), transparent 70%)',
      'radial-gradient(900px 520px at 40% 45%, rgba(41,171,226,0.20), transparent 72%)',
    ].join(', '),
    note: 'Golden highlight with subtle purple & cyan',
  },
  {
    id: 'emerald-teal',
    name: 'Emerald Teal',
    gradient: [
      'radial-gradient(1200px 700px at 8% 0%, rgba(0,128,128,0.44), transparent 65%)',
      'radial-gradient(1100px 640px at 92% 100%, rgba(27,59,156,0.35), transparent 70%)',
      'radial-gradient(900px 520px at 40% 45%, rgba(41,171,226,0.30), transparent 72%)',
    ].join(', '),
    note: 'Teal touch while keeping brand blues',
  },
];

export default function BackgroundVariants() {
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    // Read initial value if previously set
    const persisted = (typeof window !== 'undefined') ? window.localStorage.getItem('app-bg') || '' : '';
    const init = persisted || (document.documentElement.style.getPropertyValue('--app-bg') || '').trim();
    if (init) {
      document.documentElement.style.setProperty('--app-bg', init);
    }
    setCurrent(init);
  }, []);

  const apply = (css: string) => {
    document.documentElement.style.setProperty('--app-bg', css);
    try { window.localStorage.setItem('app-bg', css); } catch {}
    setCurrent(css);
  };

  const reset = () => {
    document.documentElement.style.removeProperty('--app-bg');
    try { window.localStorage.removeItem('app-bg'); } catch {}
    setCurrent('');
  };

  return (
    <section aria-label="Background theme options" className="mt-8">
      <h3 className="text-lg font-semibold">Background themes (brand palette)</h3>
      <p className="text-sm text-slate-600 mt-1">Click Apply under any swatch to set it as the page background. Reset restores the default.</p>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        {VARIANTS.map(v => (
          <div key={v.id} className="rounded-xl border border-slate-200 overflow-hidden">
            <div
              aria-hidden="true"
              className="h-24"
              style={{
                backgroundImage: v.gradient,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            />
            <div className="p-3">
              <div className="font-medium">{v.name}</div>
              {v.note && <div className="text-xs text-slate-600 mt-1">{v.note}</div>}
              <button
                type="button"
                className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md bg-royalBlue text-white hover:opacity-90"
                onClick={() => apply(v.gradient)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300"
          onClick={reset}
        >
          Reset to default
        </button>
      </div>
    </section>
  );
}
