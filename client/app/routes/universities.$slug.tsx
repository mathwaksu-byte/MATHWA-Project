import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

type University = {
  slug: string;
  name: string;
  overview?: string;
  accreditation?: string[];
  hero_image_url?: string;
  logo_url?: string;
  gallery_urls?: string[];
  duration_years?: number;
  intake_months?: string[];
  eligibility?: string;
  hostel_info?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug ?? '';
  const envBase = import.meta.env.PUBLIC_SERVER_BASE_URL as string | undefined;
  const apiBasePrimary = envBase ? envBase : 'http://localhost:4000';
  const apiBaseFallback = envBase ? 'http://localhost:4000' : 'http://localhost:4001';
  let res = await fetch(`${apiBasePrimary}/api/universities/${slug}`).catch(() => null as any);
  if (!res || !res.ok) {
    res = await fetch(`${apiBaseFallback}/api/universities/${slug}`).catch(() => null as any);
  }
  if (!res.ok) {
    throw new Response('University not found', { status: 404 });
  }
  const data = await res.json();
  return data as { university: University; fees: Array<{ year: number; tuition: number; hostel: number; misc: number; currency: string }>; };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const u = data?.university;
  return [
    { title: `${u?.name ?? 'University'} — MATHWA` },
    { name: 'description', content: `${u?.name ?? 'University'} — Official partner admissions via MATHWA` },
  ];
};

export default function UniversityPage() {
  const { university, fees } = useLoaderData<typeof loader>();
  const isOfficialPartner = university.slug === 'kyrgyz-state-university';
  const [tab, setTab] = useState<'overview'|'fees'|'gallery'>('overview');
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const order: Array<'overview'|'fees'|'gallery'> = ['overview','fees','gallery'];
      const idx = order.indexOf(tab);
      const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % order.length : (idx - 1 + order.length) % order.length;
      setTab(order[nextIdx]);
      tabsRef.current[nextIdx]?.focus();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tab]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid sm:grid-cols-2 gap-6 items-start">
        <div>
          <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src={university.hero_image_url || university.logo_url || ''}
              alt={university.name}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-royalBlue">{university.name}</h1>
          {isOfficialPartner && (
            <div className="mt-2">
              <a
                href="https://arabaevksu.edu.kg/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs sm:text-sm"
              >
                <img
                  src="/ksu-logo.png"
                  alt="I. Arabaev Kyrgyz State University logo"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200"
                  loading="eager"
                  decoding="async"
                  onError={(e) => { (e.currentTarget.style.display = 'none'); }}
                />
                <span className="font-semibold">Kyrgyz State University — MATHWA</span>
              </a>
            </div>
          )}
          <p className="mt-3 text-slate-700">{university.overview}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(university.accreditation || []).map((a) => (
              <span key={a} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">{a}</span>
            ))}
          </div>
        <div className="mt-6 flex gap-3">
          <a href="/apply" className="px-4 py-2 rounded-md bg-royalBlue text-white">Apply Now</a>
          <a href="https://wa.me/" className="px-4 py-2 rounded-md bg-green-600 text-white">Admissions Support</a>
        </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex gap-2 border-b" role="tablist" aria-label="University information">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'fees', label: 'Fees' },
            { id: 'gallery', label: 'Gallery' },
          ] as const).map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                const order: Array<'overview'|'fees'|'gallery'> = ['overview','fees','gallery'];
                tabsRef.current[order.indexOf(t.id)] = el;
              }}
              id={t.id}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm -mb-px border-b-2 ${
                tab === t.id ? 'border-royalBlue text-royalBlue' : 'border-transparent text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div id="panel-overview" role="tabpanel" aria-labelledby="overview" className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="glass p-6 rounded-lg">
              <div className="font-semibold">Course Duration</div>
              <div className="text-slate-700 mt-1">{university.duration_years} years</div>
              <div className="font-semibold mt-4">Intake Months</div>
              <div className="text-slate-700 mt-1">{(university.intake_months || []).join(', ')}</div>
              <div className="font-semibold mt-4">Eligibility</div>
              <div className="text-slate-700 mt-1">{university.eligibility}</div>
              <div className="font-semibold mt-4">Hostel</div>
              <div className="text-slate-700 mt-1">{university.hostel_info}</div>
            </div>
            <div className="glass p-6 rounded-lg">
              <div className="font-semibold">Accreditations</div>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-700">
                {(university.accreditation || []).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'fees' && (
          <div id="panel-fees" role="tabpanel" aria-labelledby="fees" className="glass p-6 rounded-lg mt-6">
            <div className="font-semibold">Year-wise Fee Structure</div>
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Year</th>
                  <th className="py-2">Tuition</th>
                  <th className="py-2">Hostel</th>
                  <th className="py-2">Misc</th>
                  <th className="py-2">Currency</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.year}>
                    <td className="py-1">{f.year}</td>
                    <td className="py-1">{f.tuition}</td>
                    <td className="py-1">{f.hostel}</td>
                    <td className="py-1">{f.misc}</td>
                    <td className="py-1">{f.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'gallery' && university.gallery_urls && university.gallery_urls.length > 0 && (
          <div id="panel-gallery" role="tabpanel" aria-labelledby="gallery" className="mt-6 grid sm:grid-cols-3 gap-4">
            {university.gallery_urls.map((url) => (
              <div key={url} className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                <img src={url} alt={university.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto glass rounded-full px-4 py-2 shadow-glow flex gap-2">
          <a href="/apply" className="px-4 py-2 rounded-full bg-royalBlue text-white">Start Application</a>
          <a href="https://wa.me/" className="px-4 py-2 rounded-full bg-green-600 text-white">Chat</a>
        </div>
      </div>
    </div>
  );
}
