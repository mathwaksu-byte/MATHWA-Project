import { Link, NavLink, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [logoOk, setLogoOk] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "backdrop-blur bg-white/70 shadow" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 flex-nowrap">
            {logoOk ? (
              <img
                src="/ksu-logo.png"
                alt="I. Arabaev Kyrgyz State University logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200 shadow-sm"
                loading="eager"
                decoding="async"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-royalBlue to-blue-500 shadow-glow" />
            )}
            <span className="font-semibold text-royalBlue tracking-tight">Kyrgyz State University</span>
            <span className="ml-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap">
              — MATHWA (Official Partner)
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/" className={({ isActive }) =>
              `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`
            }>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) =>
              `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`
            }>About</NavLink>
            <NavLink to="/universities" className={({ isActive }) =>
              `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`
            }>Universities</NavLink>
            <NavLink to="/apply" className={({ isActive }) =>
              `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`
            }>Apply</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/apply"
              className="inline-flex items-center rounded-full bg-royalBlue text-white px-4 py-2 text-sm shadow-glow hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-royalBlue"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {location.pathname === "/" && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-royalBlue/20 to-transparent" />
      )}
    </header>
  );
}
