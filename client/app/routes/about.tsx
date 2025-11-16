import type { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => ([
  { title: 'About — Kyrgyz State University — MATHWA Official Admissions' },
]);

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-royalBlue">Kyrgyz State University — Official Admissions via MATHWA</h1>
      <p className="mt-4 text-slate-700">
        MATHWA is the official admission partner for Kyrgyz State University (Arabaev University). We focus on transparency, guidance, and end-to-end support to help Indian students pursue MBBS abroad.
      </p>
      <div className="mt-8 grid sm:grid-cols-3 gap-6">
        {[
          { title: 'Official Partnership', desc: 'MoU with Kyrgyz State University ensuring trusted admissions.' },
          { title: 'Visa Support', desc: 'Comprehensive assistance for documentation and visa processing.' },
          { title: 'Student Care', desc: 'Hostel, Indian mess, and local support services.' },
        ].map((item) => (
          <div key={item.title} className="glass p-6 rounded-lg">
            <div className="font-semibold">{item.title}</div>
            <div className="text-slate-600 mt-1 text-sm">{item.desc}</div>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-bold">Our Partner Universities</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-6">
        <a href="/universities/kyrgyz-state-university" className="block glass rounded-lg overflow-hidden">
          <img src="/uploads/universities/kyrgyz/logo.png" alt="Kyrgyz State University" className="w-full h-32 object-contain bg-white" />
          <div className="p-4">
            <div className="font-semibold">Kyrgyz State University (Arabaev University)</div>
            <p className="text-slate-600 text-sm mt-1">Accredited MBBS course with 6-year program.</p>
            <div className="mt-3 inline-block px-3 py-2 rounded-md bg-royalBlue text-white">View Details</div>
          </div>
        </a>
        {/* Future universities will appear here dynamically via API */}
      </div>
    </div>
  );
}
