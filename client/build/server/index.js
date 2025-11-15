var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/tailwind.css?url
var tailwind_default = "/build/_assets/tailwind-J37YMOX5.css?url";

// app/components/SmartPopup.tsx
import { useEffect, useState } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function SmartPopup() {
  let [visible, setVisible] = useState(!1);
  return useEffect(() => {
    let timer = setTimeout(() => setVisible(!0), 15e3), onScroll = () => {
      window.scrollY > 600 && setVisible(!0);
    };
    return window.addEventListener("scroll", onScroll), () => {
      clearTimeout(timer), window.removeEventListener("scroll", onScroll);
    };
  }, []), visible ? /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 glass p-4 rounded-lg shadow-glow", children: [
    /* @__PURE__ */ jsx2("div", { className: "font-semibold", children: "Official Admissions Desk" }),
    /* @__PURE__ */ jsx2("p", { className: "text-sm text-slate-700 mt-1", children: "Chat with the official admissions team representing I. Arabaev KSU." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsx2("a", { href: "https://wa.me/", className: "px-3 py-2 rounded-md bg-green-600 text-white", children: "WhatsApp" }),
      /* @__PURE__ */ jsx2("a", { href: "/apply", className: "px-3 py-2 rounded-md bg-royalBlue text-white", children: "Apply (Official)" })
    ] }),
    /* @__PURE__ */ jsx2("button", { className: "absolute -top-2 -right-2 bg-slate-800 text-white rounded-full w-6 h-6", onClick: () => setVisible(!1), children: "\xD7" })
  ] }) : null;
}

// app/components/FloatingActions.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function FloatingActions() {
  return /* @__PURE__ */ jsxs2("div", { className: "fixed bottom-6 left-6 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsx3("a", { title: "WhatsApp", href: "https://wa.me/", className: "w-12 h-12 rounded-full bg-green-600 text-white grid place-items-center shadow-glow", children: "WA" }),
    /* @__PURE__ */ jsx3("a", { title: "Call", href: "tel:+919999999999", className: "w-12 h-12 rounded-full bg-golden text-black grid place-items-center shadow-glow", children: "\u{1F4DE}" })
  ] });
}

// app/components/Navbar.tsx
import { Link, NavLink, useLocation } from "@remix-run/react";
import { useEffect as useEffect2, useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function Navbar() {
  let location = useLocation(), [scrolled, setScrolled] = useState2(!1), [logoOk, setLogoOk] = useState2(!0);
  return useEffect2(() => {
    let onScroll = () => setScrolled(window.scrollY > 8);
    return onScroll(), window.addEventListener("scroll", onScroll, { passive: !0 }), () => window.removeEventListener("scroll", onScroll);
  }, []), /* @__PURE__ */ jsxs3(
    "header",
    {
      className: `sticky top-0 z-50 transition-all ${scrolled ? "backdrop-blur bg-white/70 shadow" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsx4("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between h-14", children: [
          /* @__PURE__ */ jsxs3(Link, { to: "/", className: "flex items-center gap-2.5 flex-nowrap", children: [
            logoOk ? /* @__PURE__ */ jsx4(
              "img",
              {
                src: "/ksu-logo.png",
                alt: "I. Arabaev Kyrgyz State University logo",
                className: "w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200 shadow-sm",
                loading: "eager",
                decoding: "async",
                onError: () => setLogoOk(!1)
              }
            ) : /* @__PURE__ */ jsx4("span", { className: "inline-block w-7 h-7 rounded-full bg-gradient-to-br from-royalBlue to-blue-500 shadow-glow" }),
            /* @__PURE__ */ jsx4("span", { className: "font-semibold text-royalBlue tracking-tight", children: "Kyrgyz State University" }),
            /* @__PURE__ */ jsx4("span", { className: "ml-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap", children: "\u2014 MATHWA (Official Partner)" })
          ] }),
          /* @__PURE__ */ jsxs3("nav", { className: "hidden md:flex items-center gap-6 text-sm", children: [
            /* @__PURE__ */ jsx4(NavLink, { to: "/", className: ({ isActive }) => `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`, children: "Home" }),
            /* @__PURE__ */ jsx4(NavLink, { to: "/about", className: ({ isActive }) => `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`, children: "About" }),
            /* @__PURE__ */ jsx4(NavLink, { to: "/universities", className: ({ isActive }) => `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`, children: "Universities" }),
            /* @__PURE__ */ jsx4(NavLink, { to: "/apply", className: ({ isActive }) => `hover:text-royalBlue transition-colors ${isActive && "text-royalBlue"}`, children: "Apply" })
          ] }),
          /* @__PURE__ */ jsx4("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx4(
            Link,
            {
              to: "/apply",
              className: "inline-flex items-center rounded-full bg-royalBlue text-white px-4 py-2 text-sm shadow-glow hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-royalBlue",
              children: "Get Started"
            }
          ) })
        ] }) }),
        location.pathname === "/" && /* @__PURE__ */ jsx4("div", { className: "h-px w-full bg-gradient-to-r from-transparent via-royalBlue/20 to-transparent" })
      ]
    }
  );
}

// app/components/Footer.tsx
import { Link as Link2 } from "@remix-run/react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function Footer() {
  return /* @__PURE__ */ jsx5("footer", { className: "mt-24 border-t border-slate-200 bg-transparent", children: /* @__PURE__ */ jsxs4("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 mb-3 flex-nowrap -ml-4 sm:-ml-6 lg:-ml-8", children: [
          /* @__PURE__ */ jsx5(
            "img",
            {
              src: "/ksu-logo.png",
              alt: "I. Arabaev Kyrgyz State University logo",
              className: "w-8 h-8 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200 shadow-sm",
              loading: "eager",
              decoding: "async"
            }
          ),
          /* @__PURE__ */ jsx5("span", { className: "font-semibold text-royalBlue whitespace-nowrap", children: "Kyrgyz State University" }),
          /* @__PURE__ */ jsx5("span", { className: "ml-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap", children: "\u2014 MATHWA (Official Partner)" })
        ] }),
        /* @__PURE__ */ jsx5("p", { className: "text-sm text-slate-600", children: "Official admissions representation for I. Arabaev Kyrgyz State University (KSU) by MATHWA. Direct, transparent admissions\u2014no consultancy." })
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx5("h4", { className: "font-medium mb-3", children: "Explore" }),
        /* @__PURE__ */ jsxs4("ul", { className: "space-y-2 text-sm text-slate-700", children: [
          /* @__PURE__ */ jsx5("li", { children: /* @__PURE__ */ jsx5(Link2, { to: "/universities", className: "hover:text-royalBlue", children: "Universities" }) }),
          /* @__PURE__ */ jsx5("li", { children: /* @__PURE__ */ jsx5(Link2, { to: "/about", className: "hover:text-royalBlue", children: "About us" }) }),
          /* @__PURE__ */ jsx5("li", { children: /* @__PURE__ */ jsx5(Link2, { to: "/apply", className: "hover:text-royalBlue", children: "Apply" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx5("h4", { className: "font-medium mb-3", children: "Contact" }),
        /* @__PURE__ */ jsxs4("ul", { className: "space-y-2 text-sm text-slate-700", children: [
          /* @__PURE__ */ jsx5("li", { children: "Email: support@mathwa.example" }),
          /* @__PURE__ */ jsx5("li", { children: "Phone: +1 (555) 000\u20110000" }),
          /* @__PURE__ */ jsx5("li", { children: "Hours: Mon\u2011Fri 9:00\u201318:00" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "mt-10 text-xs text-slate-500", children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Kyrgyz State University \u2014 MATHWA. All rights reserved."
    ] })
  ] }) });
}

// app/root.tsx
import { useEffect as useEffect3 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default }
], meta = () => [
  { title: "Kyrgyz State University \u2014 MATHWA Official Admissions" },
  { name: "description", content: "Official admissions representation for Kyrgyz State University (Arabaev KSU) via MATHWA." }
];
function App() {
  return useEffect3(() => {
    try {
      typeof window < "u" && window.localStorage.removeItem("app-bg");
    } catch {
    }
    let envBase = import.meta.env?.PUBLIC_SERVER_BASE_URL, primary = envBase || "http://localhost:4000", secondary = envBase ? "http://localhost:4000" : "http://localhost:4001", apply = (css) => {
      css && css.trim().length > 0 && document.documentElement.style.setProperty("--app-bg", css);
    };
    fetch(`${primary}/api/site-settings`).then(async (r) => r.ok ? r.json() : fetch(`${secondary}/api/site-settings`).then((r2) => r2.json())).then((j) => apply(j?.settings?.background_gradient_css)).catch(() => {
    });
  }, []), /* @__PURE__ */ jsxs5("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs5("head", { children: [
      /* @__PURE__ */ jsx6("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx6("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx6("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx6("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
      /* @__PURE__ */ jsx6("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap", rel: "stylesheet" }),
      /* @__PURE__ */ jsx6(Meta, {}),
      /* @__PURE__ */ jsx6(Links, {})
    ] }),
    /* @__PURE__ */ jsxs5("body", { className: "min-h-screen flex flex-col font-sans", children: [
      /* @__PURE__ */ jsx6(Navbar, {}),
      /* @__PURE__ */ jsx6("main", { className: "flex-1", children: /* @__PURE__ */ jsx6(Outlet, {}) }),
      /* @__PURE__ */ jsx6(SmartPopup, {}),
      /* @__PURE__ */ jsx6(FloatingActions, {}),
      /* @__PURE__ */ jsx6(Footer, {}),
      /* @__PURE__ */ jsx6(ScrollRestoration, {}),
      /* @__PURE__ */ jsx6(Scripts, {}),
      /* @__PURE__ */ jsx6(LiveReload, {})
    ] })
  ] });
}

// app/routes/universities.$slug.tsx
var universities_slug_exports = {};
__export(universities_slug_exports, {
  default: () => UniversityPage,
  loader: () => loader,
  meta: () => meta2
});
import { useLoaderData } from "@remix-run/react";
import { useEffect as useEffect4, useRef, useState as useState3 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
async function loader({ params }) {
  let slug = params.slug ?? "", envBase = import.meta.env.PUBLIC_SERVER_BASE_URL, apiBasePrimary = envBase || "http://localhost:4000", apiBaseFallback = envBase ? "http://localhost:4000" : "http://localhost:4001", res = await fetch(`${apiBasePrimary}/api/universities/${slug}`).catch(() => null);
  if ((!res || !res.ok) && (res = await fetch(`${apiBaseFallback}/api/universities/${slug}`).catch(() => null)), !res.ok)
    throw new Response("University not found", { status: 404 });
  return await res.json();
}
var meta2 = ({ data }) => {
  let u = data?.university;
  return [
    { title: `${u?.name ?? "University"} \u2014 MATHWA` },
    { name: "description", content: `${u?.name ?? "University"} \u2014 Official partner admissions via MATHWA` }
  ];
};
function UniversityPage() {
  let { university, fees } = useLoaderData(), isOfficialPartner = university.slug === "kyrgyz-state-university", [tab, setTab] = useState3("overview"), tabsRef = useRef([]);
  return useEffect4(() => {
    let handler = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight")
        return;
      e.preventDefault();
      let order = ["overview", "fees", "gallery"], idx = order.indexOf(tab), nextIdx = e.key === "ArrowRight" ? (idx + 1) % order.length : (idx - 1 + order.length) % order.length;
      setTab(order[nextIdx]), tabsRef.current[nextIdx]?.focus();
    };
    return window.addEventListener("keydown", handler), () => window.removeEventListener("keydown", handler);
  }, [tab]), /* @__PURE__ */ jsxs6("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs6("div", { className: "grid sm:grid-cols-2 gap-6 items-start", children: [
      /* @__PURE__ */ jsx7("div", { children: /* @__PURE__ */ jsx7("div", { className: "w-full rounded-lg overflow-hidden", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsx7(
        "img",
        {
          src: university.hero_image_url || university.logo_url || "",
          alt: university.name,
          loading: "eager",
          decoding: "async",
          className: "w-full h-full object-cover"
        }
      ) }) }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx7("h1", { className: "text-3xl font-bold text-royalBlue", children: university.name }),
        isOfficialPartner && /* @__PURE__ */ jsx7("div", { className: "mt-2", children: /* @__PURE__ */ jsxs6(
          "a",
          {
            href: "https://arabaevksu.edu.kg/en/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs sm:text-sm",
            children: [
              /* @__PURE__ */ jsx7(
                "img",
                {
                  src: "/ksu-logo.png",
                  alt: "I. Arabaev Kyrgyz State University logo",
                  className: "h-6 w-6 sm:h-7 sm:w-7 rounded-full object-contain bg-white p-0.5 border border-blue-200 ring-1 ring-blue-200",
                  loading: "eager",
                  decoding: "async",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsx7("span", { className: "font-semibold", children: "Kyrgyz State University \u2014 MATHWA" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx7("p", { className: "mt-3 text-slate-700", children: university.overview }),
        /* @__PURE__ */ jsx7("div", { className: "mt-4 flex flex-wrap gap-2", children: (university.accreditation || []).map((a) => /* @__PURE__ */ jsx7("span", { className: "px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm", children: a }, a)) }),
        /* @__PURE__ */ jsxs6("div", { className: "mt-6 flex gap-3", children: [
          /* @__PURE__ */ jsx7("a", { href: "/apply", className: "px-4 py-2 rounded-md bg-royalBlue text-white", children: "Apply Now" }),
          /* @__PURE__ */ jsx7("a", { href: "https://wa.me/", className: "px-4 py-2 rounded-md bg-green-600 text-white", children: "Admissions Support" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "mt-10", children: [
      /* @__PURE__ */ jsx7("div", { className: "flex gap-2 border-b", role: "tablist", "aria-label": "University information", children: [
        { id: "overview", label: "Overview" },
        { id: "fees", label: "Fees" },
        { id: "gallery", label: "Gallery" }
      ].map((t) => /* @__PURE__ */ jsx7(
        "button",
        {
          ref: (el) => {
            let order = ["overview", "fees", "gallery"];
            tabsRef.current[order.indexOf(t.id)] = el;
          },
          id: t.id,
          role: "tab",
          "aria-selected": tab === t.id,
          "aria-controls": `panel-${t.id}`,
          onClick: () => setTab(t.id),
          className: `px-4 py-2 text-sm -mb-px border-b-2 ${tab === t.id ? "border-royalBlue text-royalBlue" : "border-transparent text-slate-600"}`,
          children: t.label
        },
        t.id
      )) }),
      tab === "overview" && /* @__PURE__ */ jsxs6("div", { id: "panel-overview", role: "tabpanel", "aria-labelledby": "overview", className: "grid sm:grid-cols-2 gap-6 mt-6", children: [
        /* @__PURE__ */ jsxs6("div", { className: "glass p-6 rounded-lg", children: [
          /* @__PURE__ */ jsx7("div", { className: "font-semibold", children: "Course Duration" }),
          /* @__PURE__ */ jsxs6("div", { className: "text-slate-700 mt-1", children: [
            university.duration_years,
            " years"
          ] }),
          /* @__PURE__ */ jsx7("div", { className: "font-semibold mt-4", children: "Intake Months" }),
          /* @__PURE__ */ jsx7("div", { className: "text-slate-700 mt-1", children: (university.intake_months || []).join(", ") }),
          /* @__PURE__ */ jsx7("div", { className: "font-semibold mt-4", children: "Eligibility" }),
          /* @__PURE__ */ jsx7("div", { className: "text-slate-700 mt-1", children: university.eligibility }),
          /* @__PURE__ */ jsx7("div", { className: "font-semibold mt-4", children: "Hostel" }),
          /* @__PURE__ */ jsx7("div", { className: "text-slate-700 mt-1", children: university.hostel_info })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "glass p-6 rounded-lg", children: [
          /* @__PURE__ */ jsx7("div", { className: "font-semibold", children: "Accreditations" }),
          /* @__PURE__ */ jsx7("ul", { className: "mt-2 list-disc list-inside text-sm text-slate-700", children: (university.accreditation || []).map((a) => /* @__PURE__ */ jsx7("li", { children: a }, a)) })
        ] })
      ] }),
      tab === "fees" && /* @__PURE__ */ jsxs6("div", { id: "panel-fees", role: "tabpanel", "aria-labelledby": "fees", className: "glass p-6 rounded-lg mt-6", children: [
        /* @__PURE__ */ jsx7("div", { className: "font-semibold", children: "Year-wise Fee Structure" }),
        /* @__PURE__ */ jsxs6("table", { className: "w-full text-sm mt-3", children: [
          /* @__PURE__ */ jsx7("thead", { children: /* @__PURE__ */ jsxs6("tr", { className: "text-left", children: [
            /* @__PURE__ */ jsx7("th", { className: "py-2", children: "Year" }),
            /* @__PURE__ */ jsx7("th", { className: "py-2", children: "Tuition" }),
            /* @__PURE__ */ jsx7("th", { className: "py-2", children: "Hostel" }),
            /* @__PURE__ */ jsx7("th", { className: "py-2", children: "Misc" }),
            /* @__PURE__ */ jsx7("th", { className: "py-2", children: "Currency" })
          ] }) }),
          /* @__PURE__ */ jsx7("tbody", { children: fees.map((f) => /* @__PURE__ */ jsxs6("tr", { children: [
            /* @__PURE__ */ jsx7("td", { className: "py-1", children: f.year }),
            /* @__PURE__ */ jsx7("td", { className: "py-1", children: f.tuition }),
            /* @__PURE__ */ jsx7("td", { className: "py-1", children: f.hostel }),
            /* @__PURE__ */ jsx7("td", { className: "py-1", children: f.misc }),
            /* @__PURE__ */ jsx7("td", { className: "py-1", children: f.currency })
          ] }, f.year)) })
        ] })
      ] }),
      tab === "gallery" && university.gallery_urls && university.gallery_urls.length > 0 && /* @__PURE__ */ jsx7("div", { id: "panel-gallery", role: "tabpanel", "aria-labelledby": "gallery", className: "mt-6 grid sm:grid-cols-3 gap-4", children: university.gallery_urls.map((url) => /* @__PURE__ */ jsx7("div", { className: "w-full rounded-lg overflow-hidden", style: { aspectRatio: "4 / 3" }, children: /* @__PURE__ */ jsx7("img", { src: url, alt: university.name, loading: "lazy", decoding: "async", className: "w-full h-full object-cover" }) }, url)) })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "fixed bottom-4 inset-x-0 flex justify-center pointer-events-none", children: /* @__PURE__ */ jsxs6("div", { className: "pointer-events-auto glass rounded-full px-4 py-2 shadow-glow flex gap-2", children: [
      /* @__PURE__ */ jsx7("a", { href: "/apply", className: "px-4 py-2 rounded-full bg-royalBlue text-white", children: "Start Application" }),
      /* @__PURE__ */ jsx7("a", { href: "https://wa.me/", className: "px-4 py-2 rounded-full bg-green-600 text-white", children: "Chat" })
    ] }) })
  ] });
}

// app/routes/sitemap[.]xml.tsx
var sitemap_xml_exports = {};
__export(sitemap_xml_exports, {
  default: () => Sitemap,
  loader: () => loader2
});
async function loader2({}) {
  let base = import.meta.env.PUBLIC_APP_BASE_URL || "http://localhost:5173", body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + [
    `${base}/`,
    `${base}/about`,
    `${base}/apply`,
    `${base}/universities/kyrgyz-state-university`
  ].map((u) => `<url><loc>${u}</loc></url>`).join("") + "</urlset>";
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
function Sitemap() {
  return null;
}

// app/routes/robots[.]txt.tsx
var robots_txt_exports = {};
__export(robots_txt_exports, {
  default: () => Robots,
  loader: () => loader3
});
async function loader3({}) {
  let body = `User-agent: *
Allow: /
Sitemap: ${import.meta.env.PUBLIC_APP_BASE_URL || "http://localhost:5173"}/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
function Robots() {
  return null;
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader4,
  meta: () => meta3
});
import { useLoaderData as useLoaderData2, useNavigation } from "@remix-run/react";

// app/components/TrustBadges.tsx
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function TrustBadges() {
  return /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
    { label: "Transparent Fees", icon: "\u{1F4B3}" },
    { label: "Top Accreditation", icon: "\u{1F3DB}\uFE0F" },
    { label: "Visa Support", icon: "\u{1F6C2}" },
    { label: "Student Housing", icon: "\u{1F3E1}" }
  ].map((b) => /* @__PURE__ */ jsxs7("div", { className: "glass rounded-xl px-4 py-3 flex items-center gap-3", children: [
    /* @__PURE__ */ jsx8("span", { className: "text-xl", children: b.icon }),
    /* @__PURE__ */ jsx8("span", { className: "text-sm font-medium text-slate-800", children: b.label })
  ] }, b.label)) });
}

// app/components/Stats.tsx
import { useEffect as useEffect5, useRef as useRef2, useState as useState4 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function useCounter(target, durationMs = 1200) {
  let [value, setValue] = useState4(0), started = useRef2(!1);
  return useEffect5(() => {
    if (started.current)
      return;
    started.current = !0;
    let start = performance.now(), step = (t) => {
      let p = Math.min(1, (t - start) / durationMs);
      setValue(Math.floor(target * (1 - Math.pow(1 - p, 3)))), p < 1 && requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, durationMs]), value;
}
function Stats() {
  let universities = useCounter(25), students = useCounter(1200), countries = useCounter(8);
  return /* @__PURE__ */ jsxs8("div", { className: "grid sm:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs8("div", { className: "text-center glass rounded-xl p-6", children: [
      /* @__PURE__ */ jsxs8("div", { className: "text-3xl font-bold text-royalBlue", children: [
        universities,
        "+"
      ] }),
      /* @__PURE__ */ jsx9("div", { className: "text-sm text-slate-600 mt-1", children: "Partner Universities" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "text-center glass rounded-xl p-6", children: [
      /* @__PURE__ */ jsxs8("div", { className: "text-3xl font-bold text-royalBlue", children: [
        students,
        "+"
      ] }),
      /* @__PURE__ */ jsx9("div", { className: "text-sm text-slate-600 mt-1", children: "Happy Students" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "text-center glass rounded-xl p-6", children: [
      /* @__PURE__ */ jsx9("div", { className: "text-3xl font-bold text-royalBlue", children: countries }),
      /* @__PURE__ */ jsx9("div", { className: "text-sm text-slate-600 mt-1", children: "Countries" })
    ] })
  ] });
}

// app/components/Testimonials.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function Testimonials() {
  return /* @__PURE__ */ jsx10("div", { className: "overflow-x-auto scroll-snap-x mandatory flex gap-4 pb-2", children: [
    {
      quote: "MATHWA made my admission process effortless. Transparent fees and friendly guidance!",
      name: "Ayan"
    },
    {
      quote: "I loved the quick responses and visa support. Highly recommend for medical aspirations.",
      name: "Leena"
    },
    {
      quote: "Great university recommendations within my budget. The housing support was a plus.",
      name: "Ravi"
    }
  ].map((t, i) => /* @__PURE__ */ jsxs9(
    "figure",
    {
      className: "min-w-[280px] sm:min-w-[360px] scroll-snap-align-start glass rounded-xl p-5",
      children: [
        /* @__PURE__ */ jsxs9("blockquote", { className: "text-sm text-slate-800", children: [
          "\u201C",
          t.quote,
          "\u201D"
        ] }),
        /* @__PURE__ */ jsxs9("figcaption", { className: "mt-3 text-xs text-slate-600", children: [
          "\u2014 ",
          t.name
        ] })
      ]
    },
    i
  )) });
}

// app/components/FAQ.tsx
import { useState as useState5 } from "react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var faqs = [
  {
    q: "Is MBBS abroad affordable?",
    a: "Yes. We curate universities with transparent fee structures and scholarships to fit various budgets."
  },
  {
    q: "Do you help with visa and housing?",
    a: "Absolutely. We assist with visa paperwork and help secure student housing near campus."
  },
  {
    q: "How long does admission take?",
    a: "With complete documents, offers often arrive within 2\u20133 weeks, varying by university."
  }
];
function FAQ() {
  let [open, setOpen] = useState5(0);
  return /* @__PURE__ */ jsx11("div", { className: "space-y-3", role: "list", "aria-label": "Frequently asked questions", children: faqs.map((item, idx) => {
    let isOpen = open === idx, buttonId = `faq-button-${idx}`, panelId = `faq-panel-${idx}`;
    return /* @__PURE__ */ jsxs10("div", { className: "glass rounded-xl", role: "listitem", children: [
      /* @__PURE__ */ jsxs10(
        "button",
        {
          id: buttonId,
          "aria-expanded": isOpen,
          "aria-controls": panelId,
          onClick: () => setOpen(isOpen ? null : idx),
          className: "w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-royalBlue rounded-xl",
          children: [
            /* @__PURE__ */ jsx11("span", { className: "font-medium text-slate-800", children: item.q }),
            /* @__PURE__ */ jsx11("span", { className: "text-slate-500", "aria-hidden": "true", children: isOpen ? "\u2212" : "+" })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx11("div", { id: panelId, role: "region", "aria-labelledby": buttonId, className: "px-4 pb-4 text-sm text-slate-700", children: item.a })
    ] }, idx);
  }) });
}

// app/components/SkeletonCard.tsx
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
function SkeletonCard() {
  return /* @__PURE__ */ jsxs11("div", { className: "rounded-xl overflow-hidden border border-slate-200", children: [
    /* @__PURE__ */ jsx12("div", { className: "h-40 bg-slate-200 animate-pulse" }),
    /* @__PURE__ */ jsxs11("div", { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsx12("div", { className: "h-4 bg-slate-200 rounded animate-pulse" }),
      /* @__PURE__ */ jsx12("div", { className: "h-3 bg-slate-200 rounded animate-pulse w-5/6" }),
      /* @__PURE__ */ jsx12("div", { className: "h-8 bg-slate-200 rounded animate-pulse w-32" })
    ] })
  ] });
}

// app/components/HeroVideo.tsx
import { useEffect as useEffect6, useRef as useRef3 } from "react";
import { useState as useState6 } from "react";
import { Fragment, jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
function HeroVideo({
  srcMp4 = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  srcWebm,
  poster,
  title = "Study MBBS Abroad with Confidence",
  subtitle = "Transparent fees, visa assistance, and housing with official partners.",
  showTitleSubtitle = !1,
  overlay = "subtle",
  showPartnerBadge = !1,
  brandName = "MATHWA",
  partnerName,
  partnerUrl,
  badgeText,
  badgeLogoSrc,
  badgeLogoAlt
}) {
  let ref = useRef3(null), [badgeLogoError, setBadgeLogoError] = useState6(!1);
  return useEffect6(() => {
    let video = ref.current;
    if (!video)
      return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    let io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.isIntersecting ? video.play().catch(() => {
          }) : video.pause();
        });
      },
      { threshold: 0.25 }
    );
    return io.observe(video), () => io.disconnect();
  }, []), /* @__PURE__ */ jsxs12("section", { className: "relative min-h-[65vh] rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxs12(
      "video",
      {
        ref,
        className: "absolute inset-0 w-full h-full object-cover",
        muted: !0,
        loop: !0,
        playsInline: !0,
        autoPlay: !0,
        preload: "metadata",
        poster,
        "aria-label": "Hero background video preview",
        children: [
          srcWebm && /* @__PURE__ */ jsx13("source", { src: srcWebm, type: "video/webm" }),
          /* @__PURE__ */ jsx13("source", { src: srcMp4, type: "video/mp4" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs12(
      "div",
      {
        className: `relative z-10 h-full w-full flex items-center justify-center text-center p-6 ${overlay === "none" ? "" : overlay === "strong" ? "bg-gradient-to-t from-black/50 via-black/20 to-transparent" : "bg-gradient-to-t from-black/20 via-black/10 to-transparent"}`,
        children: [
          showPartnerBadge && /* @__PURE__ */ jsx13("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxs12(
            "a",
            {
              href: partnerUrl || "#",
              target: partnerUrl ? "_blank" : void 0,
              rel: partnerUrl ? "noopener noreferrer" : void 0,
              className: "inline-flex items-center gap-2 rounded-full bg-white/90 text-slate-800 border border-slate-200 px-3 py-1 text-xs sm:text-sm shadow backdrop-blur-sm",
              children: [
                badgeLogoSrc && !badgeLogoError ? /* @__PURE__ */ jsx13(
                  "img",
                  {
                    src: badgeLogoSrc,
                    alt: badgeLogoAlt || partnerName || "University logo",
                    className: "h-6 w-6 sm:h-7 sm:w-7 rounded-full object-contain bg-white p-0.5 border border-slate-200 ring-1 ring-slate-200",
                    loading: "eager",
                    decoding: "async",
                    onError: () => setBadgeLogoError(!0)
                  }
                ) : /* @__PURE__ */ jsx13("span", { className: "inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-royalBlue/15 border border-slate-200" }),
                badgeText ? /* @__PURE__ */ jsx13("span", { className: "font-semibold whitespace-nowrap", children: badgeText }) : /* @__PURE__ */ jsxs12(Fragment, { children: [
                  /* @__PURE__ */ jsx13("span", { className: "font-semibold", children: brandName }),
                  /* @__PURE__ */ jsx13("span", { className: "opacity-60", children: "\u2022" }),
                  /* @__PURE__ */ jsxs12("span", { children: [
                    "Official Partner",
                    partnerName ? ` of ${partnerName}` : ""
                  ] })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs12("div", { className: "max-w-4xl mx-auto", children: [
            showTitleSubtitle && /* @__PURE__ */ jsxs12(Fragment, { children: [
              /* @__PURE__ */ jsx13("h1", { className: "text-white text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow", children: title }),
              /* @__PURE__ */ jsx13("p", { className: "mt-3 text-white/90 text-lg drop-shadow", children: subtitle })
            ] }),
            /* @__PURE__ */ jsxs12("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [
              /* @__PURE__ */ jsx13("a", { href: "/apply", className: "px-5 py-2.5 rounded-full bg-royalBlue text-white shadow-glow", children: "Apply Now" }),
              /* @__PURE__ */ jsx13(
                "a",
                {
                  href: "#admissions",
                  className: "px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
                  children: "Admissions Desk"
                }
              ),
              /* @__PURE__ */ jsx13("a", { href: "https://wa.me/", className: "px-5 py-2.5 rounded-full bg-green-600 text-white", children: "WhatsApp" })
            ] })
          ] })
        ]
      }
    )
  ] });
}

// app/routes/_index.tsx
import { Fragment as Fragment2, jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var meta3 = () => [
  { title: "Kyrgyz State University \u2014 MATHWA Official Admissions" },
  { name: "description", content: "Official admissions representation for Kyrgyz State University (Arabaev KSU) via MATHWA." }
];
async function loader4() {
  try {
    let envBase = import.meta.env.PUBLIC_SERVER_BASE_URL, apiBasePrimary = envBase || "http://localhost:4000", apiBaseFallback = envBase ? "http://localhost:4000" : "http://localhost:4001", res = await fetch(`${apiBasePrimary}/api/universities`).catch(() => null);
    (!res || !res.ok) && (res = await fetch(`${apiBaseFallback}/api/universities`).catch(() => null));
    let resSettings = await fetch(`${apiBasePrimary}/api/site-settings`).catch(() => null);
    if ((!resSettings || !resSettings.ok) && (resSettings = await fetch(`${apiBaseFallback}/api/site-settings`).catch(() => null)), !res.ok)
      throw new Error("Failed to load");
    let list = (await res.json())?.universities ?? [], featured = list[0] ?? null, settings = {
      hero_title: "Study MBBS Abroad with Confidence",
      hero_subtitle: "Transparent fees, visa assistance, and student housing.",
      hero_video_mp4_url: "",
      hero_video_webm_url: "",
      hero_video_poster_url: ""
    };
    return resSettings.ok && (settings = (await resSettings.json())?.settings ?? settings), { featured, universities: list, settings };
  } catch {
    return { featured: null, universities: [], settings: null };
  }
}
function Index() {
  let { featured, universities, settings } = useLoaderData2(), isLoading = useNavigation().state !== "idle";
  return /* @__PURE__ */ jsxs13("div", { className: "relative", children: [
    /* @__PURE__ */ jsx14("div", { className: "px-4", children: /* @__PURE__ */ jsx14(
      HeroVideo,
      {
        srcMp4: settings?.hero_video_mp4_url,
        srcWebm: settings?.hero_video_webm_url,
        poster: settings?.hero_video_poster_url,
        title: settings?.hero_title,
        subtitle: settings?.hero_subtitle,
        showTitleSubtitle: !1,
        overlay: "none",
        showPartnerBadge: !1
      }
    ) }),
    /* @__PURE__ */ jsx14("section", { className: "mt-8 px-4", children: /* @__PURE__ */ jsx14("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsx14(TrustBadges, {}) }) }),
    /* @__PURE__ */ jsx14("section", { className: "py-12", children: /* @__PURE__ */ jsx14("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsx14(Stats, {}) }) }),
    /* @__PURE__ */ jsx14("section", { className: "py-12", children: /* @__PURE__ */ jsxs13("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx14("h2", { className: "text-2xl font-bold", children: "Explore Universities" }),
      /* @__PURE__ */ jsxs13("div", { className: "mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        isLoading && /* @__PURE__ */ jsx14(Fragment2, { children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx14(SkeletonCard, {}, i)) }),
        !isLoading && universities.length > 0 && /* @__PURE__ */ jsx14(Fragment2, { children: universities.map((u) => /* @__PURE__ */ jsxs13("a", { href: `/universities/${u.slug}`, className: "block rounded-xl overflow-hidden border border-slate-200 hover:shadow transition-shadow", children: [
          /* @__PURE__ */ jsx14(
            "img",
            {
              src: u.hero_image_url || "",
              alt: u.name,
              loading: "lazy",
              decoding: "async",
              sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
              className: "w-full h-40 object-cover bg-gradient-to-br from-royalBlue/10 to-blue-100/20",
              onError: (e) => {
                e.currentTarget.src = "/ksu-logo.png", e.currentTarget.style.objectFit = "contain", e.currentTarget.style.padding = "8px", e.currentTarget.style.backgroundColor = "white";
              }
            }
          ),
          /* @__PURE__ */ jsxs13("div", { className: "p-4", children: [
            /* @__PURE__ */ jsx14("div", { className: "font-semibold", children: u.name }),
            /* @__PURE__ */ jsx14("p", { className: "text-slate-600 text-sm mt-1", children: u.overview ?? "Government accredited MBBS program with affordable fees." }),
            /* @__PURE__ */ jsx14("div", { className: "mt-3 inline-block px-3 py-2 rounded-md bg-royalBlue text-white", children: "View Details" })
          ] })
        ] }, u.slug)) }),
        !isLoading && universities.length === 0 && /* @__PURE__ */ jsxs13("div", { className: "glass rounded-xl p-6", children: [
          /* @__PURE__ */ jsx14("div", { className: "font-semibold", children: "Universities will appear here soon." }),
          /* @__PURE__ */ jsx14("p", { className: "text-slate-600 text-sm mt-1", children: "We are fetching live data. Please check back in a moment." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx14("section", { className: "py-12", children: /* @__PURE__ */ jsxs13("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx14("h2", { className: "text-2xl font-bold", children: "What students say" }),
      /* @__PURE__ */ jsx14("div", { className: "mt-4", children: /* @__PURE__ */ jsx14(Testimonials, {}) })
    ] }) }),
    /* @__PURE__ */ jsx14("section", { className: "py-12", children: /* @__PURE__ */ jsxs13("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx14("h2", { className: "text-2xl font-bold", children: "Frequently asked questions" }),
      /* @__PURE__ */ jsx14("div", { className: "mt-4", children: /* @__PURE__ */ jsx14(FAQ, {}) })
    ] }) })
  ] });
}

// app/routes/about.tsx
var about_exports = {};
__export(about_exports, {
  default: () => About,
  meta: () => meta4
});
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var meta4 = () => [
  { title: "About \u2014 Kyrgyz State University \u2014 MATHWA Official Admissions" }
];
function About() {
  return /* @__PURE__ */ jsxs14("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx15("h1", { className: "text-3xl font-bold text-royalBlue", children: "Kyrgyz State University \u2014 Official Admissions via MATHWA" }),
    /* @__PURE__ */ jsx15("p", { className: "mt-4 text-slate-700", children: "MATHWA is the official admission partner for Kyrgyz State University (Arabaev University). We focus on transparency, guidance, and end-to-end support to help Indian students pursue MBBS abroad." }),
    /* @__PURE__ */ jsx15("div", { className: "mt-8 grid sm:grid-cols-3 gap-6", children: [
      { title: "Official Partnership", desc: "MoU with Kyrgyz State University ensuring trusted admissions." },
      { title: "Visa Support", desc: "Comprehensive assistance for documentation and visa processing." },
      { title: "Student Care", desc: "Hostel, Indian mess, and local support services." }
    ].map((item) => /* @__PURE__ */ jsxs14("div", { className: "glass p-6 rounded-lg", children: [
      /* @__PURE__ */ jsx15("div", { className: "font-semibold", children: item.title }),
      /* @__PURE__ */ jsx15("div", { className: "text-slate-600 mt-1 text-sm", children: item.desc })
    ] }, item.title)) }),
    /* @__PURE__ */ jsx15("h2", { className: "mt-10 text-2xl font-bold", children: "Our Partner Universities" }),
    /* @__PURE__ */ jsx15("div", { className: "mt-4 grid sm:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxs14("a", { href: "/universities/kyrgyz-state-university", className: "block glass rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx15("img", { src: "https://images.example.com/universities/kyrgyz/logo.png", alt: "Kyrgyz State University", className: "w-full h-32 object-contain bg-white" }),
      /* @__PURE__ */ jsxs14("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx15("div", { className: "font-semibold", children: "Kyrgyz State University (Arabaev University)" }),
        /* @__PURE__ */ jsx15("p", { className: "text-slate-600 text-sm mt-1", children: "Accredited MBBS course with 6-year program." }),
        /* @__PURE__ */ jsx15("div", { className: "mt-3 inline-block px-3 py-2 rounded-md bg-royalBlue text-white", children: "View Details" })
      ] })
    ] }) })
  ] });
}

// app/routes/apply.tsx
var apply_exports = {};
__export(apply_exports, {
  action: () => action,
  default: () => Apply,
  meta: () => meta5
});
import { Form, useActionData } from "@remix-run/react";
import { useEffect as useEffect7, useMemo, useState as useState7 } from "react";
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var meta5 = () => [
  { title: "Apply \u2014 Official Admissions via MATHWA" },
  { name: "description", content: "Submit your application through MATHWA \u2014 Official Partner of I. Arabaev Kyrgyz State University." }
];
async function action({ request }) {
  let formData = await request.formData(), envBase = import.meta.env.PUBLIC_SERVER_BASE_URL, primary = envBase || "http://localhost:4000", secondary = envBase ? "http://localhost:4000" : "http://localhost:4001";
  try {
    let res = await fetch(`${primary}/api/apply`, { method: "POST", body: formData }).catch(() => null);
    return (!res || !res.ok) && (res = await fetch(`${secondary}/api/apply`, { method: "POST", body: formData }).catch(() => null)), !res || !res.ok ? { ok: !1, message: "Failed to submit application" } : { ok: !0 };
  } catch {
    return { ok: !1, message: "Network error. Please try again." };
  }
}
function Apply() {
  let result = useActionData(), [errors, setErrors] = useState7({}), [phone, setPhone] = useState7(""), phoneMasked = useMemo(() => phone.replace(/[^0-9+]/g, "").replace(/^\+?/, "+"), [phone]);
  return useEffect7(() => {
    if (result?.ok && typeof window < "u")
      try {
        window.dataLayer?.push({ event: "apply_form_submit", phone: phoneMasked });
      } catch {
      }
  }, [result, phoneMasked]), /* @__PURE__ */ jsxs15("div", { className: "max-w-3xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx16("h1", { className: "text-3xl font-bold text-royalBlue", children: "Official Admissions Application" }),
    /* @__PURE__ */ jsx16("p", { className: "mt-2 text-slate-700", children: "Fill the form below. The official admissions team (MATHWA) will contact you shortly." }),
    /* @__PURE__ */ jsxs15("div", { className: "mt-4 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsx16("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white", children: "1" }),
      /* @__PURE__ */ jsx16("span", { children: "Personal" }),
      /* @__PURE__ */ jsx16("span", { className: "text-slate-400", children: "\u2192" }),
      /* @__PURE__ */ jsx16("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white", children: "2" }),
      /* @__PURE__ */ jsx16("span", { children: "Academic" }),
      /* @__PURE__ */ jsx16("span", { className: "text-slate-400", children: "\u2192" }),
      /* @__PURE__ */ jsx16("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white", children: "3" }),
      /* @__PURE__ */ jsx16("span", { children: "Preference" }),
      /* @__PURE__ */ jsx16("span", { className: "text-slate-400", children: "\u2192" }),
      /* @__PURE__ */ jsx16("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white", children: "\u2713" }),
      /* @__PURE__ */ jsx16("span", { children: "Submit" })
    ] }),
    result?.ok && /* @__PURE__ */ jsxs15("div", { className: "mt-4 p-4 rounded-md bg-green-50 text-green-700", children: [
      "Application submitted successfully! We will contact you via WhatsApp.",
      /* @__PURE__ */ jsx16("div", { className: "mt-2", children: /* @__PURE__ */ jsx16("a", { href: "https://wa.me/", className: "px-3 py-2 rounded-md bg-green-600 text-white", children: "WhatsApp Admissions" }) })
    ] }),
    result && !result.ok && /* @__PURE__ */ jsx16("div", { className: "mt-4 p-4 rounded-md bg-red-50 text-red-700", children: result.message }),
    /* @__PURE__ */ jsxs15(Form, { method: "post", encType: "multipart/form-data", className: "mt-6 grid gap-6", children: [
      /* @__PURE__ */ jsxs15("div", { className: "glass p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx16("div", { className: "font-semibold", children: "Personal Info" }),
        /* @__PURE__ */ jsxs15("div", { className: "grid sm:grid-cols-2 gap-3 mt-3", children: [
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsxs15("label", { className: "text-sm text-slate-600", htmlFor: "name", children: [
              "Full Name",
              /* @__PURE__ */ jsx16("span", { className: "text-red-500", children: " *" })
            ] }),
            /* @__PURE__ */ jsx16(
              "input",
              {
                id: "name",
                name: "name",
                required: !0,
                placeholder: "ex: John Doe",
                className: "mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue",
                "aria-invalid": Boolean(errors.name),
                "aria-describedby": errors.name ? "error-name" : void 0,
                onBlur: (e) => {
                  let v = e.currentTarget.value.trim();
                  setErrors((prev) => ({ ...prev, name: v ? "" : "Name is required" }));
                }
              }
            ),
            errors.name && /* @__PURE__ */ jsx16("p", { id: "error-name", role: "alert", className: "text-xs text-red-600 mt-1", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsxs15("label", { className: "text-sm text-slate-600", htmlFor: "phone", children: [
              "Phone",
              /* @__PURE__ */ jsx16("span", { className: "text-red-500", children: " *" })
            ] }),
            /* @__PURE__ */ jsx16(
              "input",
              {
                id: "phone",
                name: "phone",
                required: !0,
                placeholder: "ex: +91 98765 43210",
                inputMode: "tel",
                pattern: "^[+0-9\\s-]{10,}$",
                value: phoneMasked,
                onChange: (e) => setPhone(e.currentTarget.value),
                className: "mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue",
                "aria-invalid": Boolean(errors.phone),
                "aria-describedby": errors.phone ? "error-phone" : void 0,
                onBlur: (e) => {
                  let v = e.currentTarget.value.replace(/[^0-9]/g, "");
                  setErrors((prev) => ({ ...prev, phone: v.length >= 10 ? "" : "Enter a valid phone number" }));
                }
              }
            ),
            errors.phone && /* @__PURE__ */ jsx16("p", { id: "error-phone", role: "alert", className: "text-xs text-red-600 mt-1", children: errors.phone }),
            /* @__PURE__ */ jsx16("p", { className: "text-xs text-slate-500 mt-1", children: "We use WhatsApp to contact you." })
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("label", { className: "text-sm text-slate-600", htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx16("input", { id: "email", name: "email", type: "email", placeholder: "ex: you@example.com", className: "mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("label", { className: "text-sm text-slate-600", htmlFor: "city", children: "City" }),
            /* @__PURE__ */ jsx16("input", { id: "city", name: "city", placeholder: "ex: Mumbai", className: "mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "glass p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx16("div", { className: "font-semibold", children: "Academic Info" }),
        /* @__PURE__ */ jsxs15("div", { className: "grid sm:grid-cols-2 gap-3 mt-3", children: [
          /* @__PURE__ */ jsxs15("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx16("input", { type: "checkbox", name: "neet_qualified", "aria-label": "NEET Qualified" }),
            " NEET Qualified"
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("label", { className: "text-sm text-slate-600", htmlFor: "marksheet", children: "Upload Marksheet" }),
            /* @__PURE__ */ jsx16("input", { id: "marksheet", name: "marksheet", type: "file", accept: "application/pdf,image/*", className: "mt-1 block" }),
            /* @__PURE__ */ jsx16("p", { className: "text-xs text-slate-500 mt-1", children: "PDF/JPG/PNG up to 10MB." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "glass p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx16("div", { className: "font-semibold", children: "Preference" }),
        /* @__PURE__ */ jsxs15("div", { className: "grid sm:grid-cols-2 gap-3 mt-3", children: [
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("label", { className: "text-sm text-slate-600", htmlFor: "preferred_university_slug", children: "Preferred University" }),
            /* @__PURE__ */ jsx16("select", { id: "preferred_university_slug", name: "preferred_university_slug", className: "mt-1 border rounded-md px-3 py-2 w-full", children: /* @__PURE__ */ jsx16("option", { value: "kyrgyz-state-university", children: "Kyrgyz State University (Arabaev University)" }) })
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("label", { className: "text-sm text-slate-600", htmlFor: "preferred_year", children: "Starting Year" }),
            /* @__PURE__ */ jsx16("select", { id: "preferred_year", name: "preferred_year", className: "mt-1 border rounded-md px-3 py-2 w-full", children: [1, 2, 3, 4, 5, 6].map((y) => /* @__PURE__ */ jsx16("option", { value: y, children: y }, y)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx16("button", { type: "submit", className: "px-4 py-2 rounded-md bg-royalBlue text-white", children: "Submit (Official)" }),
        /* @__PURE__ */ jsx16("a", { href: "https://wa.me/", className: "px-4 py-2 rounded-md bg-green-600 text-white", children: "WhatsApp Admissions" })
      ] })
    ] })
  ] });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-FRWDONOZ.js", imports: ["/build/_shared/chunk-ZXEP7L7R.js", "/build/_shared/chunk-4HXKWYDW.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-3LXJW2PW.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-WEPPVMWX.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/about": { id: "routes/about", parentId: "root", path: "about", index: void 0, caseSensitive: void 0, module: "/build/routes/about-FHALRLJZ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/apply": { id: "routes/apply", parentId: "root", path: "apply", index: void 0, caseSensitive: void 0, module: "/build/routes/apply-WJJG5JV7.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/robots[.]txt": { id: "routes/robots[.]txt", parentId: "root", path: "robots.txt", index: void 0, caseSensitive: void 0, module: "/build/routes/robots[.]txt-2VIQNYUC.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/sitemap[.]xml": { id: "routes/sitemap[.]xml", parentId: "root", path: "sitemap.xml", index: void 0, caseSensitive: void 0, module: "/build/routes/sitemap[.]xml-NI5BDI56.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/universities.$slug": { id: "routes/universities.$slug", parentId: "root", path: "universities/:slug", index: void 0, caseSensitive: void 0, module: "/build/routes/universities.$slug-HAMN3TMR.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "c172cc02", hmr: void 0, url: "/build/manifest-C172CC02.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/universities.$slug": {
    id: "routes/universities.$slug",
    parentId: "root",
    path: "universities/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: universities_slug_exports
  },
  "routes/sitemap[.]xml": {
    id: "routes/sitemap[.]xml",
    parentId: "root",
    path: "sitemap.xml",
    index: void 0,
    caseSensitive: void 0,
    module: sitemap_xml_exports
  },
  "routes/robots[.]txt": {
    id: "routes/robots[.]txt",
    parentId: "root",
    path: "robots.txt",
    index: void 0,
    caseSensitive: void 0,
    module: robots_txt_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: about_exports
  },
  "routes/apply": {
    id: "routes/apply",
    parentId: "root",
    path: "apply",
    index: void 0,
    caseSensitive: void 0,
    module: apply_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
