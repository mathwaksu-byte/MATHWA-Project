var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.ts
function cors(origin, methods = "GET,POST,PUT,DELETE,OPTIONS") {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", origin || "*");
  h.set("Access-Control-Allow-Methods", methods);
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "86400");
  h.set("Vary", "Origin");
  return h;
}
__name(cors, "cors");
function json(data, status = 200, extra, origin) {
  const h = cors(origin);
  h.set("Content-Type", "application/json");
  if (extra) Object.entries(extra).forEach(([k, v]) => h.set(k, v));
  return new Response(JSON.stringify(data), { status, headers: h });
}
__name(json, "json");
var DEMO_UNI = { slug: "kyrgyz-state-university", name: "Kyrgyz State University", active: true, overview: "", accreditation: [], hero_image_url: "", logo_url: "", gallery_urls: [], duration_years: 6, intake_months: ["September"], eligibility: "", hostel_info: "" };
var DEMO_FEES = [1, 2, 3, 4, 5, 6].map((y) => ({ year: y, tuition: 1e3, hostel: 1e3, misc: 1e3, currency: "USD" }));
async function proxy(request, env) {
  const upstream = new URL(env.UPSTREAM_URL);
  const url = new URL(request.url);
  url.protocol = upstream.protocol;
  url.host = upstream.host;
  const init = { method: request.method, headers: request.headers };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = request.body;
  return fetch(url.toString(), init);
}
__name(proxy, "proxy");
async function proxySafe(request, env, origin) {
  try {
    return await proxy(request, env);
  } catch (e) {
    return json({ error: "upstream_unreachable", message: String(e?.message || e) }, 502, void 0, origin);
  }
}
__name(proxySafe, "proxySafe");
async function handleUniversities(request, env, pathname, origin) {
  if (request.method === "GET" && pathname === "/api/universities") {
    const raw = await env.KV_APP.get("universities");
    if (raw) return json({ universities: JSON.parse(raw) }, 200, void 0, origin);
    return json({ universities: [DEMO_UNI] }, 200, void 0, origin);
  }
  if (request.method === "GET" && pathname.startsWith("/api/universities/")) {
    const slug = pathname.split("/").pop();
    const uniRaw = await env.KV_APP.get(`uni:${slug}`);
    const feesRaw = await env.KV_APP.get(`fees:${slug}`);
    const uni = uniRaw ? JSON.parse(uniRaw) : slug === DEMO_UNI.slug ? DEMO_UNI : null;
    const fees = feesRaw ? JSON.parse(feesRaw) : DEMO_FEES;
    if (!uni) return json({ error: "Not found" }, 404, void 0, origin);
    return json({ university: uni, fees }, 200, void 0, origin);
  }
  if (request.method === "POST" && pathname === "/api/universities") {
    const body = await request.json();
    const slug = String(body.slug || "");
    if (!slug) return json({ error: "slug required" }, 400, void 0, origin);
    const uni = { ...body, slug };
    await env.KV_APP.put(`uni:${slug}`, JSON.stringify(uni));
    let list = [];
    const raw = await env.KV_APP.get("universities");
    if (raw) list = JSON.parse(raw);
    const exists = list.find((x) => x.slug === slug);
    if (exists) list = list.map((x) => x.slug === slug ? uni : x);
    else list.push(uni);
    await env.KV_APP.put("universities", JSON.stringify(list));
    return json({ university: uni }, 200, void 0, origin);
  }
  if (request.method === "PUT" && pathname.startsWith("/api/universities/")) {
    const slug = pathname.split("/").pop();
    const currentRaw = await env.KV_APP.get(`uni:${slug}`);
    if (!currentRaw) return json({ error: "Not found" }, 404, void 0, origin);
    const current = JSON.parse(currentRaw);
    const body = await request.json();
    const next = { ...current, ...body };
    await env.KV_APP.put(`uni:${slug}`, JSON.stringify(next));
    const raw = await env.KV_APP.get("universities");
    let list = raw ? JSON.parse(raw) : [];
    list = list.map((x) => x.slug === slug ? next : x);
    await env.KV_APP.put("universities", JSON.stringify(list));
    return json({ university: next }, 200, void 0, origin);
  }
  if (request.method === "DELETE" && pathname.startsWith("/api/universities/")) {
    const slug = pathname.split("/").pop();
    await env.KV_APP.delete(`uni:${slug}`);
    await env.KV_APP.delete(`fees:${slug}`);
    const raw = await env.KV_APP.get("universities");
    let list = raw ? JSON.parse(raw) : [];
    list = list.filter((x) => x.slug !== slug);
    await env.KV_APP.put("universities", JSON.stringify(list));
    return json({ ok: true }, 200, void 0, origin);
  }
  if (pathname.startsWith("/api/universities/") && pathname.endsWith("/fees")) {
    const slug = pathname.split("/")[3];
    if (request.method === "POST") {
      const body = await request.json();
      const existingRaw = await env.KV_APP.get(`fees:${slug}`);
      let arr = existingRaw ? JSON.parse(existingRaw) : [];
      arr.push(body);
      await env.KV_APP.put(`fees:${slug}`, JSON.stringify(arr));
      return json({ fee: body }, 200, void 0, origin);
    }
    if (request.method === "DELETE") {
      const url = new URL(request.url);
      const yearRaw = url.searchParams.get("year") || "";
      const all = url.searchParams.get("all") ? true : false;
      const existingRaw = await env.KV_APP.get(`fees:${slug}`);
      let arr = existingRaw ? JSON.parse(existingRaw) : [];
      const next = all ? [] : arr.filter((f) => String(f.year) !== String(yearRaw));
      await env.KV_APP.put(`fees:${slug}`, JSON.stringify(next));
      return json({ ok: true, fees: next }, 200, void 0, origin);
    }
  }
  return proxy(request, env);
}
__name(handleUniversities, "handleUniversities");
async function handleSiteSettings(request, env, pathname, origin) {
  if (request.method === "GET" && pathname === "/api/site-settings") {
    const raw = await env.KV_APP.get("site_settings");
    const settings = raw ? JSON.parse(raw) : { hero_title: "Study MBBS Abroad with Confidence", hero_subtitle: "Transparent fees, visa assistance, and student housing.", hero_video_mp4_url: "", hero_video_webm_url: "", hero_video_poster_url: "", background_gradient_css: "" };
    return json({ settings }, 200, void 0, origin);
  }
  if (request.method === "POST" && pathname === "/api/admin/site-settings") {
    const fd = await request.formData();
    const title = String(fd.get("hero_title") || "");
    const subtitle = String(fd.get("hero_subtitle") || "");
    const resetBg = !!fd.get("reset_background");
    let bgId = String(fd.get("background_theme_id") || "");
    let bgCss = String(fd.get("background_gradient_css") || "");
    const mp4 = fd.get("hero_video_mp4");
    const webm = fd.get("hero_video_webm");
    const poster = fd.get("hero_poster");
    const now = Date.now();
    let mp4Url = "";
    let webmUrl = "";
    let posterUrl = "";
    if (mp4) {
      const k = `hero/${now}_${mp4.name}`;
      await env.R2_BUCKET.put(k, await mp4.arrayBuffer());
      mp4Url = `/uploads/${k}`;
    }
    if (webm) {
      const k = `hero/${now}_${webm.name}`;
      await env.R2_BUCKET.put(k, await webm.arrayBuffer());
      webmUrl = `/uploads/${k}`;
    }
    if (poster) {
      const k = `hero/${now}_${poster.name}`;
      await env.R2_BUCKET.put(k, await poster.arrayBuffer());
      posterUrl = `/uploads/${k}`;
    }
    const currentRaw = await env.KV_APP.get("site_settings");
    let current = currentRaw ? JSON.parse(currentRaw) : { hero_title: "", hero_subtitle: "", hero_video_mp4_url: "", hero_video_webm_url: "", hero_video_poster_url: "", background_gradient_css: "", background_theme_id: "" };
    const next = { ...current };
    if (title) next.hero_title = title;
    if (subtitle) next.hero_subtitle = subtitle;
    if (mp4Url) next.hero_video_mp4_url = mp4Url;
    if (webmUrl) next.hero_video_webm_url = webmUrl;
    if (posterUrl) next.hero_video_poster_url = posterUrl;
    if (resetBg) {
      next.background_theme_id = "";
      next.background_gradient_css = "";
    } else {
      if (bgId) next.background_theme_id = bgId;
      if (bgCss) next.background_gradient_css = bgCss;
    }
    await env.KV_APP.put("site_settings", JSON.stringify(next));
    return json({ settings: next }, 200, void 0, origin);
  }
  return proxy(request, env);
}
__name(handleSiteSettings, "handleSiteSettings");
async function handleLeads(request, env, pathname, origin) {
  if (request.method === "POST" && pathname === "/api/apply") {
    const fd = await request.formData();
    const obj = {};
    for (const [k, v] of fd) obj[k] = typeof v === "string" ? v : v?.name || "";
    const raw = await env.KV_APP.get("leads");
    let arr = raw ? JSON.parse(raw) : [];
    const item = { id: Date.now().toString(), created_at: (/* @__PURE__ */ new Date()).toISOString(), status: "new", priority: "normal", notes: "", ...obj };
    arr.push(item);
    await env.KV_APP.put("leads", JSON.stringify(arr));
    return json({ ok: true }, 200, void 0, origin);
  }
  if (request.method === "GET" && pathname === "/api/admin/leads") {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const perPage = Number(url.searchParams.get("perPage") || "20");
    const q = url.searchParams.get("q") || "";
    const status = url.searchParams.get("status") || "";
    const uni = url.searchParams.get("university") || "";
    const year = url.searchParams.get("year") || "";
    const assigned = url.searchParams.get("assigned") || "";
    const raw = await env.KV_APP.get("leads");
    let arr = raw ? JSON.parse(raw) : [];
    let filtered = arr;
    if (q) filtered = filtered.filter((x) => (x.name || "").includes(q) || (x.email || "").includes(q) || (x.phone || "").includes(q));
    if (status) filtered = filtered.filter((x) => x.status === status);
    if (uni) filtered = filtered.filter((x) => x.preferred_university_slug === uni);
    if (year) filtered = filtered.filter((x) => String(x.preferred_year) === String(year));
    if (assigned) filtered = filtered.filter((x) => (x.assigned_admin_id || "") === assigned);
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const data = filtered.sort((a, b) => a.created_at > b.created_at ? -1 : 1).slice(start, start + perPage);
    return json({ data, total }, 200, void 0, origin);
  }
  if (request.method === "GET" && pathname.startsWith("/api/admin/leads/metrics")) {
    const raw = await env.KV_APP.get("leads");
    let arr = raw ? JSON.parse(raw) : [];
    const byStatus = {};
    for (const x of arr) byStatus[x.status || "new"] = (byStatus[x.status || "new"] || 0) + 1;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
    const daily = {};
    for (const x of arr) {
      const d = new Date(x.created_at);
      if (d >= since) {
        const k = d.toISOString().slice(0, 10);
        daily[k] = (daily[k] || 0) + 1;
      }
    }
    return json({ byStatus, daily }, 200, void 0, origin);
  }
  if (request.method === "GET" && pathname.startsWith("/api/admin/leads/")) {
    const id = pathname.split("/").pop();
    const raw = await env.KV_APP.get("leads");
    let arr = raw ? JSON.parse(raw) : [];
    const item = arr.find((x) => x.id === id);
    if (!item) return json({ error: "Not found" }, 404, void 0, origin);
    return json({ data: item }, 200, void 0, origin);
  }
  if (request.method === "PATCH" && pathname.startsWith("/api/admin/leads/")) {
    const id = pathname.split("/").pop();
    const body = await request.json();
    const raw = await env.KV_APP.get("leads");
    let arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((x) => x.id === id);
    if (idx === -1) return json({ error: "Not found" }, 404, void 0, origin);
    arr[idx] = { ...arr[idx], ...body };
    await env.KV_APP.put("leads", JSON.stringify(arr));
    return json({ data: arr[idx] }, 200, void 0, origin);
  }
  return proxy(request, env);
}
__name(handleLeads, "handleLeads");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = url.origin;
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    const p = url.pathname;
    if (p === "/" || p.startsWith("/@vite")) {
      const h = cors(origin);
      h.set("Content-Type", "text/plain");
      return new Response("ok", { status: 200, headers: h });
    }
    if (p.startsWith("/uploads/")) return handleUploads(request, env, p, origin);
    if (p.startsWith("/api/universities")) return handleUniversities(request, env, p, origin);
    if (p.startsWith("/api/site-settings") || p.startsWith("/api/admin/site-settings")) return handleSiteSettings(request, env, p, origin);
    if (p.startsWith("/api/apply") || p.startsWith("/api/admin/leads")) return handleLeads(request, env, p, origin);
    return proxySafe(request, env, origin);
  }
};
function extContentType(key) {
  const k = key.toLowerCase();
  if (k.endsWith(".mp4")) return "video/mp4";
  if (k.endsWith(".webm")) return "video/webm";
  if (k.endsWith(".png")) return "image/png";
  if (k.endsWith(".jpg") || k.endsWith(".jpeg")) return "image/jpeg";
  if (k.endsWith(".webp")) return "image/webp";
  if (k.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}
__name(extContentType, "extContentType");
async function handleUploads(request, env, pathname, origin) {
  const key = pathname.replace(/^\/uploads\//, "");
  const obj = await env.R2_BUCKET.get(key);
  if (obj) {
    const h = cors(origin);
    h.set("Content-Type", extContentType(key));
    return new Response(obj.body, { status: 200, headers: h });
  }
  return proxySafe(request, env, origin);
}
__name(handleUploads, "handleUploads");
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
