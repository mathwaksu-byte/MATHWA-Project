import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-nowrap -ml-4 sm:-ml-6 lg:-ml-8">
              <img
                src="/ksu-logo.png"
                alt="I. Arabaev Kyrgyz State University logo"
                className="w-8 h-8 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200 shadow-sm"
                loading="eager"
                decoding="async"
              />
              <span className="font-semibold text-royalBlue whitespace-nowrap">Kyrgyz State University</span>
              <span className="ml-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap">
                — MATHWA (Official Partner)
              </span>
            </div>
            <p className="text-sm text-slate-600">Official admissions representation for I. Arabaev Kyrgyz State University (KSU) by MATHWA. Direct, transparent admissions—no consultancy.</p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link to="/universities" className="hover:text-royalBlue">Universities</Link></li>
              <li><Link to="/about" className="hover:text-royalBlue">About us</Link></li>
              <li><Link to="/apply" className="hover:text-royalBlue">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Email: support@mathwa.example</li>
              <li>Phone: +1 (555) 000‑0000</li>
              <li>Hours: Mon‑Fri 9:00–18:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} Kyrgyz State University — MATHWA. All rights reserved.</div>
     </div>
    </footer>
  );
}
