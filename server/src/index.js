import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import fetch from 'node-fetch';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getPrisma } from './db/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.PUBLIC_SERVER_BASE_URL || `http://localhost:${PORT}`;
// CORS: allow multiple origins in dev, or specific origins in prod
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
];
const configuredOriginsRaw = (process.env.CORS_ORIGIN || process.env.PUBLIC_APP_BASE_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const configuredOrigins = new Set(configuredOriginsRaw);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isDev = process.env.NODE_ENV !== 'production';
    // In dev, always allow standard localhost dev ports, even if configured origins exist
    if (isDev && DEV_ORIGINS.includes(origin)) return callback(null, true);
    // Otherwise, allow only configured origins if any were provided
    if (configuredOrigins.size > 0) {
      return configuredOrigins.has(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
    }
    // Fallback: no configured origins and not a recognized dev origin
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
// Serve uploaded static files (local dev/demo)
const UPLOAD_DIR = path.resolve(process.cwd(), 'server', 'uploads');
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const UNI_DATA_DIR = path.join(DATA_DIR, 'universities');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UNI_DATA_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Supabase (optional for local dev)
const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = hasSupabase ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY) : null;
const prisma = getPrisma();

// Demo fallback data when Supabase is not configured
const DEMO_UNI = {
  slug: 'kyrgyz-state-university',
  name: 'Kyrgyz State University (Arabaev University)',
  active: true,
  overview: 'Kyrgyz State University is a reputed public university in Kyrgyzstan offering MBBS programs. MATHWA is the official admission partner.',
  accreditation: ['Government Accredited','NEET Eligible','WHO Listed'],
  hero_image_url: 'https://images.example.com/universities/kyrgyz/hero.jpg',
  logo_url: 'https://images.example.com/universities/kyrgyz/logo.png',
  gallery_urls: [
    'https://images.example.com/universities/kyrgyz/gallery1.jpg',
    'https://images.example.com/universities/kyrgyz/gallery2.jpg',
    'https://images.example.com/universities/kyrgyz/gallery3.jpg',
  ],
  duration_years: 6,
  intake_months: ['September','February'],
  eligibility: 'NEET qualification required; 50% in Physics, Chemistry, Biology (PCB); Age 17+ at admission',
  hostel_info: 'Hostels with Indian mess facilities available; Separate accommodations for boys and girls.'
};
const DEMO_FEES = [1,2,3,4,5,6].map(year => ({ year, tuition: 3500, hostel: 800, misc: 200, currency: 'USD' }));

// Demo site settings (used when Supabase is not configured and no local settings file yet)
const DEMO_SITE_SETTINGS = {
  hero_title: 'Study MBBS Abroad with Confidence',
  hero_subtitle: 'NMC-recognized universities, transparent fees, visa assistance & student housing.',
  hero_video_mp4_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  hero_video_webm_url: '',
  hero_video_poster_url: '',
  // New: background theme managed from Admin
  background_theme_id: '', // e.g. 'brand-balanced', 'deep-blue', etc.
  background_gradient_css: '', // raw CSS background-image value
};

// Multer for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
// Larger limit for hero videos/posters (admin site settings)
const uploadHero = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // up to ~200MB
});
// Medium limit for university images
const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Auth middleware for admin routes
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Bootstrap default admin if not exists
async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_DEFAULT_EMAIL;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!email || !password) return;
  if (!supabase) return;
  const { data, error } = await supabase.from('admins').select('id').eq('email', email).maybeSingle();
  if (!data) {
    const hash = bcrypt.hashSync(password, 10);
    await supabase.from('admins').insert({ email, password_hash: hash });
    console.log('Seeded default admin:', email);
  }
}
ensureDefaultAdmin().catch(console.error);

// Seed default university (Arabaev KSU) if missing
async function ensureDefaultUniversity() {
  const slug = DEMO_UNI.slug;
  // Prefer Prisma if available
  if (prisma) {
    try {
      const existing = await prisma.university.findUnique({ where: { slug } });
      if (!existing) {
        await prisma.university.create({ data: { ...DEMO_UNI } });
        console.log('Seeded default university (Prisma):', slug);
      }
      return;
    } catch (e) {
      console.warn('Prisma seed university failed:', e?.message);
    }
  }
  // Fallback to Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.from('universities').select('id').eq('slug', slug).maybeSingle();
      if (!data && !error) {
        const { error: insErr } = await supabase.from('universities').insert({ ...DEMO_UNI });
        if (!insErr) console.log('Seeded default university (Supabase):', slug);
      }
    } catch (e) {
      console.warn('Supabase seed university failed:', e?.message);
    }
  }
}
ensureDefaultUniversity().catch(console.error);

// Admin login
app.post('/api/admin/login', async (req, res) => {
  if (!supabase) return res.status(501).json({ error: 'Admin login not available in demo mode' });
  const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().min(6).required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const { email, password } = value;
  const { data, error: qErr } = await supabase.from('admins').select('*').eq('email', email).maybeSingle();
  if (qErr) return res.status(500).json({ error: qErr.message });
  if (!data) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, data.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: data.id, email: data.email, role: data.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Universities public endpoints
app.get('/api/universities', async (req, res) => {
  if (prisma) {
    try {
      const list = await prisma.university.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
      return res.json({ universities: list })
    } catch (e) {
      // fall through to other sources
    }
  }
  if (supabase) {
    const { data, error } = await supabase.from('universities').select('*').eq('active', true).order('name');
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ universities: data });
  }
  return res.json({ universities: [DEMO_UNI] });
});

app.get('/api/universities/:slug', async (req, res) => {
  const slug = req.params.slug;
  if (!supabase && !prisma) {
    try {
      const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
      const feesPath = path.join(UNI_DATA_DIR, `${slug}.fees.json`);
      let uni = null;
      let fees = null;
      if (fs.existsSync(uniPath)) {
        uni = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
      }
      if (fs.existsSync(feesPath)) {
        fees = JSON.parse(fs.readFileSync(feesPath, 'utf8'));
      }
      if (!uni && slug === DEMO_UNI.slug) uni = DEMO_UNI;
      if (!fees) fees = DEMO_FEES;
      if (!uni) return res.status(404).json({ error: 'Not found' });
      return res.json({ university: uni, fees });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed' });
    }
  }
  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } })
      if (!uni) return res.status(404).json({ error: 'Not found' })
      const fees = await prisma.fee.findMany({ where: { university_id: uni.id }, orderBy: { year: 'asc' } })
      return res.json({ university: uni, fees })
    } catch (e) {
      // fall through to other sources
    }
  }
  if (supabase) {
    const { data: uni, error } = await supabase.from('universities').select('*').eq('slug', slug).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!uni) return res.status(404).json({ error: 'Not found' });
    const { data: fees, error: fErr } = await supabase.from('fees').select('year, tuition, hostel, misc, currency').eq('university_id', uni.id).order('year');
    if (fErr) return res.status(500).json({ error: fErr.message });
    return res.json({ university: uni, fees });
  }
  return res.status(404).json({ error: 'Not found' });
});

// Universities admin CRUD
app.post('/api/universities', requireAdmin, async (req, res) => {
  if (prisma) {
    try {
      const created = await prisma.university.create({ data: req.body })
      return res.json({ university: created })
    } catch (e) {}
  }
  if (!supabase) {
    const schema = Joi.object({
      slug: Joi.string().required(),
      name: Joi.string().required(),
      active: Joi.boolean().default(true),
      overview: Joi.string().allow(''),
      accreditation: Joi.array().items(Joi.string()),
      hero_image_url: Joi.string().uri().allow(''),
      logo_url: Joi.string().uri().allow(''),
      gallery_urls: Joi.array().items(Joi.string().uri()),
      duration_years: Joi.number().integer().min(1).max(8),
      intake_months: Joi.array().items(Joi.string()),
      eligibility: Joi.string().allow(''),
      hostel_info: Joi.string().allow(''),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    try {
      const uniPath = path.join(UNI_DATA_DIR, `${value.slug}.json`);
      fs.writeFileSync(uniPath, JSON.stringify(value, null, 2), 'utf8');
      return res.json({ university: value });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to create' });
    }
  }
  const schema = Joi.object({
    slug: Joi.string().required(),
    name: Joi.string().required(),
    active: Joi.boolean().default(true),
    overview: Joi.string().allow(''),
    accreditation: Joi.array().items(Joi.string()),
    hero_image_url: Joi.string().uri().allow(''),
    logo_url: Joi.string().uri().allow(''),
    gallery_urls: Joi.array().items(Joi.string().uri()),
    duration_years: Joi.number().integer().min(1).max(8),
    intake_months: Joi.array().items(Joi.string()),
    eligibility: Joi.string().allow(''),
    hostel_info: Joi.string().allow(''),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const { data, error: iErr } = await supabase.from('universities').insert(value).select('*').maybeSingle();
  if (iErr) return res.status(500).json({ error: iErr.message });
  res.json({ university: data });
});

app.put('/api/universities/:slug', requireAdmin, async (req, res) => {
  const slug = req.params.slug;
  if (prisma) {
    try {
      const updated = await prisma.university.update({ where: { slug }, data: req.body })
      return res.json({ university: updated })
    } catch (e) {}
  }
  if (!supabase) {
    try {
      const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
      if (!fs.existsSync(uniPath)) return res.status(404).json({ error: 'Not found' });
      const current = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
      const next = { ...current, ...req.body };
      fs.writeFileSync(uniPath, JSON.stringify(next, null, 2), 'utf8');
      return res.json({ university: next });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to update' });
    }
  }
  const { data, error } = await supabase.from('universities').update(req.body).eq('slug', slug).select('*').maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ university: data });
});

app.delete('/api/universities/:slug', requireAdmin, async (req, res) => {
  const slug = req.params.slug;
  if (prisma) {
    try {
      await prisma.university.delete({ where: { slug } })
      return res.json({ ok: true })
    } catch (e) {}
  }
  if (!supabase) {
    try {
      const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
      const feesPath = path.join(UNI_DATA_DIR, `${slug}.fees.json`);
      if (fs.existsSync(uniPath)) fs.unlinkSync(uniPath);
      if (fs.existsSync(feesPath)) fs.unlinkSync(feesPath);
      const galleryDir = path.join(UPLOAD_DIR, 'universities', slug, 'gallery');
      if (fs.existsSync(galleryDir)) {
        for (const f of fs.readdirSync(galleryDir)) {
          try { fs.unlinkSync(path.join(galleryDir, f)); } catch {}
        }
      }
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to delete' });
    }
  }
  const { error } = await supabase.from('universities').delete().eq('slug', slug);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Fees admin
app.post('/api/universities/:slug/fees', async (req, res) => {
  const slug = req.params.slug;
  if (!supabase && !prisma) {
    try {
      const schema = Joi.object({
        fees: Joi.array().items(Joi.object({
          year: Joi.number().integer().required(),
          tuition: Joi.number().required(),
          hostel: Joi.number().required(),
          misc: Joi.number().required(),
          currency: Joi.string().required(),
        })).min(1).required(),
        replace: Joi.boolean().default(true),
      });
      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const feesPath = path.join(UNI_DATA_DIR, `${slug}.fees.json`);
      let existing = [];
      if (fs.existsSync(feesPath)) existing = JSON.parse(fs.readFileSync(feesPath, 'utf8'));
      const next = value.replace ? value.fees : [...existing, ...value.fees];
      fs.writeFileSync(feesPath, JSON.stringify(next, null, 2), 'utf8');
      return res.json({ fees: next });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to save fees' });
    }
  }
  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } })
      if (!uni) return res.status(404).json({ error: 'University not found' })
      const feesArr = Array.isArray(req.body?.fees) ? req.body.fees : null
      if (feesArr && feesArr.length > 0) {
        if (req.body.replace) {
          await prisma.fee.deleteMany({ where: { university_id: uni.id } })
        }
        await prisma.fee.createMany({ data: feesArr.map(f => ({
          university_id: uni.id,
          year: Number(f.year),
          tuition: Number(f.tuition),
          hostel: Number(f.hostel),
          misc: Number(f.misc),
          currency: String(f.currency || 'USD'),
        })) })
        const saved = await prisma.fee.findMany({ where: { university_id: uni.id }, orderBy: { year: 'asc' } })
        return res.json({ fees: saved })
      }
      const created = await prisma.fee.create({ data: { 
        university_id: uni.id,
        year: Number(req.body.year),
        tuition: Number(req.body.tuition),
        hostel: Number(req.body.hostel),
        misc: Number(req.body.misc),
        currency: String(req.body.currency || 'USD'),
      } })
      return res.json({ fee: created })
    } catch (e) {
      // fall through when prisma fails
    }
  }
  if (supabase) {
    const { data: uni, error: uErr } = await supabase.from('universities').select('id').eq('slug', slug).maybeSingle();
    if (uErr) return res.status(500).json({ error: uErr.message });
    if (!uni) return res.status(404).json({ error: 'University not found' });
    const { data, error } = await supabase.from('fees').insert({ ...req.body, university_id: uni.id }).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ fee: data });
  }
  return res.status(500).json({ error: 'No database configured' });
});

// Delete fees (specific year or all) for a university
app.delete('/api/universities/:slug/fees', async (req, res) => {
  const slug = req.params.slug;
  const yearRaw = (req.body?.year ?? req.query?.year ?? '').toString();
  const all = !!(req.body?.all || req.query?.all);

  if (!supabase && !prisma) {
    try {
      const feesPath = path.join(UNI_DATA_DIR, `${slug}.fees.json`);
      if (!fs.existsSync(feesPath)) return res.status(404).json({ error: 'Fees not found' });
      const existing = JSON.parse(fs.readFileSync(feesPath, 'utf8')) || [];
      const next = all ? [] : existing.filter((f) => String(f.year) !== String(yearRaw));
      fs.writeFileSync(feesPath, JSON.stringify(next, null, 2), 'utf8');
      return res.json({ ok: true, fees: next });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to delete fees' });
    }
  }

  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      if (all) {
        await prisma.fee.deleteMany({ where: { university_id: uni.id } });
      } else {
        await prisma.fee.deleteMany({ where: { university_id: uni.id, year: Number(yearRaw) } });
      }
      const fees = await prisma.fee.findMany({ where: { university_id: uni.id }, orderBy: { year: 'asc' } });
      return res.json({ ok: true, fees });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to delete fees' });
    }
  }

  if (supabase) {
    const { data: uni, error: uErr } = await supabase.from('universities').select('id').eq('slug', slug).maybeSingle();
    if (uErr) return res.status(500).json({ error: uErr.message });
    if (!uni) return res.status(404).json({ error: 'University not found' });
    let delErr = null;
    if (all) {
      const { error } = await supabase.from('fees').delete().eq('university_id', uni.id);
      delErr = error;
    } else {
      const { error } = await supabase.from('fees').delete().eq('university_id', uni.id).eq('year', Number(yearRaw));
      delErr = error;
    }
    if (delErr) return res.status(500).json({ error: delErr.message });
    const { data: fees, error: fErr } = await supabase.from('fees').select('year, tuition, hostel, misc, currency').eq('university_id', uni.id).order('year');
    if (fErr) return res.status(500).json({ error: fErr.message });
    return res.json({ ok: true, fees });
  }

  return res.status(500).json({ error: 'No database configured' });
});

async function ensureDefaultFees() {
  const slug = DEMO_UNI.slug
  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } })
      if (!uni) return
      const count = await prisma.fee.count({ where: { university_id: uni.id } })
      if (count === 0) {
        const rows = [1,2,3,4,5,6].map(y => ({ university_id: uni.id, year: y, tuition: 1000, hostel: 1000, misc: 1000, currency: 'USD' }))
        await prisma.fee.createMany({ data: rows })
        console.log('Seeded default fees (Prisma)')
      }
      return
    } catch (e) {}
  }
  try {
    const feesPath = path.join(UNI_DATA_DIR, `${slug}.fees.json`)
    if (!fs.existsSync(feesPath)) {
      const rows = [1,2,3,4,5,6].map(y => ({ year: y, tuition: 1000, hostel: 1000, misc: 1000, currency: 'USD' }))
      fs.writeFileSync(feesPath, JSON.stringify(rows, null, 2), 'utf8')
      console.log('Seeded default fees (demo)')
    }
  } catch {}
}
ensureDefaultFees().catch(console.error)

// Admin: upload gallery images for a university (demo supported)
const uploadGallery = uploadImages.array('images', 20);
app.post('/api/admin/universities/:slug/gallery', uploadGallery, async (req, res) => {
  const slug = req.params.slug;
  const files = req.files || [];
  if (!Array.isArray(files) || files.length === 0) return res.status(400).json({ error: 'No files' });

  const allowed = ['image/jpeg','image/png','image/webp'];
  for (const f of files) {
    if (!allowed.includes(f.mimetype)) return res.status(400).json({ error: 'Images must be JPG/PNG/WEBP' });
  }

  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const urls = [];
      if (supabase) {
        for (const file of files) {
          const key = `universities/${slug}/gallery/${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
          const { error: upErr } = await supabase.storage.from('site-media').upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
          if (upErr) return res.status(500).json({ error: upErr.message });
          const { data: pub } = supabase.storage.from('site-media').getPublicUrl(key);
          urls.push(pub.publicUrl);
        }
      } else {
        const outDir = path.join(UPLOAD_DIR, 'universities', slug, 'gallery');
        fs.mkdirSync(outDir, { recursive: true });
        for (const file of files) {
          const fname = `${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
          const out = path.join(outDir, fname);
          fs.writeFileSync(out, file.buffer);
          urls.push(`${BASE_URL}/uploads/universities/${slug}/gallery/${fname}`);
        }
      }
      const next = Array.isArray(uni.gallery_urls) ? [...uni.gallery_urls, ...urls] : urls;
      const updated = await prisma.university.update({ where: { slug }, data: { gallery_urls: next } });
      return res.json({ university: updated, added: urls });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' });
    }
  }

  if (supabase) {
    try {
      const { data: uni, error: uErr } = await supabase.from('universities').select('id, gallery_urls').eq('slug', slug).maybeSingle();
      if (uErr) return res.status(500).json({ error: uErr.message });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const urls = [];
      for (const file of files) {
        const key = `universities/${slug}/gallery/${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
        const { error: upErr } = await supabase.storage.from('site-media').upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
        if (upErr) return res.status(500).json({ error: upErr.message });
        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(key);
        urls.push(pub.publicUrl);
      }
      const next = Array.isArray(uni.gallery_urls) ? [...uni.gallery_urls, ...urls] : urls;
      const { data, error } = await supabase.from('universities').update({ gallery_urls: next }).eq('id', uni.id).select('*').maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ university: data, added: urls });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' });
    }
  }

  try {
    const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
    let uni = null;
    if (fs.existsSync(uniPath)) uni = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
    if (!uni && slug === DEMO_UNI.slug) uni = { ...DEMO_UNI };
    if (!uni) return res.status(404).json({ error: 'University not found' });
    const outDir = path.join(UPLOAD_DIR, 'universities', slug, 'gallery');
    fs.mkdirSync(outDir, { recursive: true });
    const added = [];
    for (const file of files) {
      const fname = `${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
      const out = path.join(outDir, fname);
      fs.writeFileSync(out, file.buffer);
      added.push(`${BASE_URL}/uploads/universities/${slug}/gallery/${fname}`);
    }
    uni.gallery_urls = Array.isArray(uni.gallery_urls) ? [...uni.gallery_urls, ...added] : added;
    fs.writeFileSync(uniPath, JSON.stringify(uni, null, 2), 'utf8');
    return res.json({ university: uni, added });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upload failed' });
  }
});

// Admin: delete gallery images by URL
app.delete('/api/admin/universities/:slug/gallery', async (req, res) => {
  const slug = req.params.slug;
  const urls = Array.isArray(req.body?.urls) ? req.body.urls.filter(Boolean) : [];
  if (urls.length === 0) return res.status(400).json({ error: 'No urls provided' });

  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const current = Array.isArray(uni.gallery_urls) ? uni.gallery_urls : [];
      const next = current.filter(u => !urls.includes(u));
      // Attempt storage removal
      const objKeys = urls
        .map(u => {
          const idx = u.indexOf('/object/public/site-media/');
          return idx >= 0 ? u.slice(idx + '/object/public/site-media/'.length) : null;
        })
        .filter(Boolean);
      if (supabase && objKeys.length > 0) {
        await supabase.storage.from('site-media').remove(objKeys);
      }
      const prefix = `${BASE_URL}/uploads/universities/${slug}/gallery/`;
      for (const u of urls) {
        if (u.startsWith(prefix)) {
          const fname = u.slice(prefix.length).replace(/\?.*$/, '');
          const p = path.join(UPLOAD_DIR, 'universities', slug, 'gallery', fname);
          if (p.startsWith(path.join(UPLOAD_DIR, 'universities', slug, 'gallery'))) {
            if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch {}
          }
        }
      }
      const updated = await prisma.university.update({ where: { slug }, data: { gallery_urls: next } });
      return res.json({ university: updated, removed: urls });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Delete failed' });
    }
  }

  if (supabase) {
    try {
      const { data: uni, error: uErr } = await supabase.from('universities').select('id, gallery_urls').eq('slug', slug).maybeSingle();
      if (uErr) return res.status(500).json({ error: uErr.message });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const current = Array.isArray(uni.gallery_urls) ? uni.gallery_urls : [];
      const next = current.filter(u => !urls.includes(u));
      // Attempt to remove from storage when URL points to public site-media bucket
      const objKeys = urls
        .map(u => {
          const idx = u.indexOf('/object/public/site-media/');
          return idx >= 0 ? u.slice(idx + '/object/public/site-media/'.length) : null;
        })
        .filter(Boolean);
      if (objKeys.length > 0) {
        await supabase.storage.from('site-media').remove(objKeys);
      }
      const { data, error } = await supabase.from('universities').update({ gallery_urls: next }).eq('id', uni.id).select('*').maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ university: data, removed: urls });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Delete failed' });
    }
  }

  try {
    const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
    let uni = null;
    if (fs.existsSync(uniPath)) uni = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
    if (!uni && slug === DEMO_UNI.slug) uni = { ...DEMO_UNI };
    if (!uni) return res.status(404).json({ error: 'University not found' });
    const prefix = `${BASE_URL}/uploads/universities/${slug}/gallery/`;
    for (const u of urls) {
      if (u.startsWith(prefix)) {
        const fname = u.slice(prefix.length).replace(/\?.*$/, '');
        const p = path.join(UPLOAD_DIR, 'universities', slug, 'gallery', fname);
        if (p.startsWith(path.join(UPLOAD_DIR, 'universities', slug, 'gallery'))) {
          if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch {}
        }
      }
    }
    uni.gallery_urls = (Array.isArray(uni.gallery_urls) ? uni.gallery_urls : []).filter(u => !urls.includes(u));
    fs.writeFileSync(uniPath, JSON.stringify(uni, null, 2), 'utf8');
    return res.json({ university: uni, removed: urls });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Delete failed' });
  }
});

// Admin: upload display picture (hero or logo)
const uploadDp = uploadImages.single('image');
app.post('/api/admin/universities/:slug/dp', uploadDp, async (req, res) => {
  const slug = req.params.slug;
  const file = req.file;
  const typeRaw = (req.body.type || '').toString();
  const type = typeRaw === 'logo' ? 'logo' : 'hero';
  if (!file) return res.status(400).json({ error: 'No file' });
  if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) return res.status(400).json({ error: 'Image must be JPG/PNG/WEBP' });

  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      let url = '';
      if (supabase) {
        const key = `universities/${slug}/dp/${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
        const { error: upErr } = await supabase.storage.from('site-media').upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
        if (upErr) return res.status(500).json({ error: upErr.message });
        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(key);
        url = pub.publicUrl;
      } else {
        const outDir = path.join(UPLOAD_DIR, 'universities', slug, 'dp');
        fs.mkdirSync(outDir, { recursive: true });
        const fname = `${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
        const out = path.join(outDir, fname);
        fs.writeFileSync(out, file.buffer);
        url = `${BASE_URL}/uploads/universities/${slug}/dp/${fname}`;
      }
      const patch = type === 'logo' ? { logo_url: url } : { hero_image_url: url };
      const updated = await prisma.university.update({ where: { slug }, data: patch });
      return res.json({ university: updated });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' });
    }
  }

  if (supabase) {
    try {
      const { data: uni, error: uErr } = await supabase.from('universities').select('id').eq('slug', slug).maybeSingle();
      if (uErr) return res.status(500).json({ error: uErr.message });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const key = `universities/${slug}/dp/${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
      const { error: upErr } = await supabase.storage.from('site-media').upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
      if (upErr) return res.status(500).json({ error: upErr.message });
      const { data: pub } = supabase.storage.from('site-media').getPublicUrl(key);
      const patch = type === 'logo' ? { logo_url: pub.publicUrl } : { hero_image_url: pub.publicUrl };
      const { data, error } = await supabase.from('universities').update(patch).eq('id', uni.id).select('*').maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ university: data });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' });
    }
  }

  try {
    const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
    let uni = null;
    if (fs.existsSync(uniPath)) uni = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
    if (!uni && slug === DEMO_UNI.slug) uni = { ...DEMO_UNI };
    if (!uni) return res.status(404).json({ error: 'University not found' });
    const outDir = path.join(UPLOAD_DIR, 'universities', slug, 'dp');
    fs.mkdirSync(outDir, { recursive: true });
    const fname = `${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
    const out = path.join(outDir, fname);
    fs.writeFileSync(out, file.buffer);
    const url = `${BASE_URL}/uploads/universities/${slug}/dp/${fname}`;
    if (type === 'logo') uni.logo_url = url; else uni.hero_image_url = url;
    fs.writeFileSync(uniPath, JSON.stringify(uni, null, 2), 'utf8');
    return res.json({ university: uni });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upload failed' });
  }
});

// Admin: clear DP (hero/logo)
app.delete('/api/admin/universities/:slug/dp', async (req, res) => {
  const slug = req.params.slug;
  const type = (req.query.type || 'hero').toString() === 'logo' ? 'logo' : 'hero';

  if (prisma) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug } });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const patch = type === 'logo' ? { logo_url: '' } : { hero_image_url: '' };
      const updated = await prisma.university.update({ where: { slug }, data: patch });
      return res.json({ university: updated });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to clear' });
    }
  }

  if (supabase) {
    try {
      const { data: uni, error: uErr } = await supabase.from('universities').select('id, hero_image_url, logo_url').eq('slug', slug).maybeSingle();
      if (uErr) return res.status(500).json({ error: uErr.message });
      if (!uni) return res.status(404).json({ error: 'University not found' });
      const patch = type === 'logo' ? { logo_url: '' } : { hero_image_url: '' };
      const { data, error } = await supabase.from('universities').update(patch).eq('id', uni.id).select('*').maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ university: data });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed to clear' });
    }
  }

  try {
    const uniPath = path.join(UNI_DATA_DIR, `${slug}.json`);
    let uni = null;
    if (fs.existsSync(uniPath)) uni = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
    if (!uni && slug === DEMO_UNI.slug) uni = { ...DEMO_UNI };
    if (!uni) return res.status(404).json({ error: 'University not found' });
    if (type === 'logo') uni.logo_url = ''; else uni.hero_image_url = '';
    fs.writeFileSync(uniPath, JSON.stringify(uni, null, 2), 'utf8');
    return res.json({ university: uni });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed to clear' });
  }
});

// Apply form
app.post('/api/apply', upload.single('marksheet'), async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow(''),
    city: Joi.string().allow(''),
    preferred_university_slug: Joi.string().required(),
    preferred_year: Joi.number().integer().min(1).max(6).required(),
    neet_qualified: Joi.any(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  // Upload file (optional)
  let marksheetUrl = null;
  if (req.file) {
    if (!supabase) {
      // In demo mode, skip actual upload.
      marksheetUrl = 'https://example.com/demo/marksheet.pdf';
    } else {
      const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type' });
      }
      const path = `${Date.now()}_${req.file.originalname}`;
      const { error: upErr } = await supabase.storage.from('marksheets').upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
      if (upErr) return res.status(500).json({ error: upErr.message });
      const { data: pub } = supabase.storage.from('marksheets').getPublicUrl(path);
      marksheetUrl = pub.publicUrl;
    }
  }

  const lead = {
    name: value.name,
    phone: value.phone,
    email: value.email,
    city: value.city,
    preferred_university_slug: value.preferred_university_slug,
    preferred_year: value.preferred_year,
    neet_qualified: !!req.body.neet_qualified,
    marksheet_url: marksheetUrl,
    source: 'web',
  };
  if (prisma) {
    try {
      await prisma.lead.create({ data: lead })
    } catch (e) {
      // fallback paths below
      if (supabase) {
        const { error: insErr } = await supabase.from('leads').insert(lead);
        if (insErr) {
          try {
            const p = path.join(DATA_DIR, 'leads.json');
            let arr = [];
            if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
            const item = { id: Date.now().toString(), created_at: new Date().toISOString(), status: 'new', priority: 'normal', notes: '', ...lead };
            arr.push(item);
            fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
          } catch {}
        }
      } else {
        try {
          const p = path.join(DATA_DIR, 'leads.json');
          let arr = [];
          if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
          const item = { id: Date.now().toString(), created_at: new Date().toISOString(), status: 'new', priority: 'normal', notes: '', ...lead };
          arr.push(item);
          fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
        } catch {}
      }
    }
  } else if (supabase) {
    const { error: insErr } = await supabase.from('leads').insert(lead);
    if (insErr) {
      try {
        const p = path.join(DATA_DIR, 'leads.json');
        let arr = [];
        if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
        const item = { id: Date.now().toString(), created_at: new Date().toISOString(), status: 'new', priority: 'normal', notes: '', ...lead };
        arr.push(item);
        fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
      } catch {}
    }
  } else {
    try {
      const p = path.join(DATA_DIR, 'leads.json');
      let arr = [];
      if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
      const item = { id: Date.now().toString(), created_at: new Date().toISOString(), status: 'new', priority: 'normal', notes: '', ...lead };
      arr.push(item);
      fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
    } catch (e) {}
  }

  // CRM webhook
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      await fetch(process.env.CRM_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
    } catch (e) {
      console.warn('CRM webhook failed:', e?.message);
    }
  }

  res.json({ ok: true });
});

// ----- Site Settings (Hero Video) -----
// Public endpoint to read settings used by client Home page
app.get('/api/site-settings', async (req, res) => {
  // If Prisma is configured, prefer it
  if (prisma) {
    try {
      const data = await prisma.site_setting.findUnique({ where: { key: 'default' } })
      if (!data) return res.json({ settings: DEMO_SITE_SETTINGS })
      return res.json({ settings: data })
    } catch (e) {
      // fall through
    }
  }
  // If Supabase is configured, attempt to read DB record
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'default')
        .maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.json({ settings: DEMO_SITE_SETTINGS });
      return res.json({ settings: data });
    } catch (e) {
      return res.json({ settings: DEMO_SITE_SETTINGS });
    }
  }
  // Demo mode: read from local JSON file if present
  try {
    const p = path.join(DATA_DIR, 'site-settings.json');
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'));
      return res.json({ settings: json });
    }
  } catch {}
  return res.json({ settings: DEMO_SITE_SETTINGS });
});

// Admin upload/update settings (demo mode supported via local storage)
const uploadSiteMedia = uploadHero.fields([
  { name: 'hero_video_mp4', maxCount: 1 },
  { name: 'hero_video_webm', maxCount: 1 },
  { name: 'hero_poster', maxCount: 1 },
]);
app.post('/api/admin/site-settings', uploadSiteMedia, async (req, res) => {
  const title = (req.body.hero_title || '').toString();
  const subtitle = (req.body.hero_subtitle || '').toString();
  const bgCssRaw = (req.body.background_gradient_css || '').toString();
  const bgThemeIdRaw = (req.body.background_theme_id || '').toString();
  const resetBg = !!req.body.reset_background;

  // Prepare current settings baseline
  let current = DEMO_SITE_SETTINGS;
  try {
    const p = path.join(DATA_DIR, 'site-settings.json');
    if (fs.existsSync(p)) {
      current = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch {}

  // If Prisma is configured, persist to DB and optionally use Supabase storage for files
  if (prisma) {
    try {
      const updated = { ...current };
      updated.hero_title = title || current.hero_title;
      updated.hero_subtitle = subtitle || current.hero_subtitle;
      if (resetBg) {
        updated.background_theme_id = '';
        updated.background_gradient_css = '';
      } else {
        if (bgThemeIdRaw) updated.background_theme_id = bgThemeIdRaw;
        if (bgCssRaw) updated.background_gradient_css = bgCssRaw;
      }

      const files = req.files || {};
      const mp4 = Array.isArray(files.hero_video_mp4) ? files.hero_video_mp4[0] : null;
      const webm = Array.isArray(files.hero_video_webm) ? files.hero_video_webm[0] : null;
      const poster = Array.isArray(files.hero_poster) ? files.hero_poster[0] : null;

      const saveToBucket = async (file, folder) => {
        if (!supabase) return null;
        const pathKey = `${folder}/${Date.now()}_${file.originalname}`;
        const { error: upErr } = await supabase.storage.from('site-media').upload(pathKey, file.buffer, { contentType: file.mimetype, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(pathKey);
        return pub.publicUrl;
      };

      if (mp4) {
        if (!['video/mp4'].includes(mp4.mimetype)) return res.status(400).json({ error: 'MP4 file must be video/mp4' });
        const url = await saveToBucket(mp4, 'hero');
        if (url) updated.hero_video_mp4_url = url;
      }
      if (webm) {
        if (!['video/webm'].includes(webm.mimetype)) return res.status(400).json({ error: 'WEBM file must be video/webm' });
        const url = await saveToBucket(webm, 'hero');
        if (url) updated.hero_video_webm_url = url;
      }
      if (poster) {
        if (!['image/jpeg','image/png','image/webp'].includes(poster.mimetype)) return res.status(400).json({ error: 'Poster must be JPG/PNG/WEBP' });
        const url = await saveToBucket(poster, 'hero');
        if (url) updated.hero_video_poster_url = url;
      }

      const saved = await prisma.site_setting.upsert({
        where: { key: 'default' },
        create: { key: 'default', ...updated, updated_at: new Date() },
        update: { ...updated, updated_at: new Date() },
      })
      return res.json({ settings: saved })
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' })
    }
  }
  // If Supabase is configured, upload to storage bucket and persist to DB
  if (supabase) {
    try {
      const updated = { ...current };
      updated.hero_title = title || current.hero_title;
      updated.hero_subtitle = subtitle || current.hero_subtitle;
      // Background theme updates
      if (resetBg) {
        updated.background_theme_id = '';
        updated.background_gradient_css = '';
      } else {
        if (bgThemeIdRaw) updated.background_theme_id = bgThemeIdRaw;
        if (bgCssRaw) updated.background_gradient_css = bgCssRaw;
      }

      const files = req.files || {};
      const mp4 = Array.isArray(files.hero_video_mp4) ? files.hero_video_mp4[0] : null;
      const webm = Array.isArray(files.hero_video_webm) ? files.hero_video_webm[0] : null;
      const poster = Array.isArray(files.hero_poster) ? files.hero_poster[0] : null;

      // Helper to upload a file to Supabase Storage and get public URL
      const uploadToBucket = async (file, folder) => {
        const pathKey = `${folder}/${Date.now()}_${file.originalname}`;
        const { error: upErr } = await supabase.storage.from('site-media').upload(pathKey, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(pathKey);
        return pub.publicUrl;
      };

      if (mp4) {
        if (!['video/mp4'].includes(mp4.mimetype)) return res.status(400).json({ error: 'MP4 file must be video/mp4' });
        updated.hero_video_mp4_url = await uploadToBucket(mp4, 'hero');
      }
      if (webm) {
        if (!['video/webm'].includes(webm.mimetype)) return res.status(400).json({ error: 'WEBM file must be video/webm' });
        updated.hero_video_webm_url = await uploadToBucket(webm, 'hero');
      }
      if (poster) {
        if (!['image/jpeg','image/png','image/webp'].includes(poster.mimetype)) return res.status(400).json({ error: 'Poster must be JPG/PNG/WEBP' });
        updated.hero_video_poster_url = await uploadToBucket(poster, 'hero');
      }

      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key: 'default', ...updated, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select('*')
        .maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ settings: data });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Upload failed' });
    }
  }

  // Demo/local mode: save files locally under /server/uploads and persist JSON
  try {
    const updated = { ...current };
    if (title) updated.hero_title = title;
    if (subtitle) updated.hero_subtitle = subtitle;
    // Background theme updates (demo/local)
    if (resetBg) {
      updated.background_theme_id = '';
      updated.background_gradient_css = '';
    } else {
      if (bgThemeIdRaw) updated.background_theme_id = bgThemeIdRaw;
      if (bgCssRaw) updated.background_gradient_css = bgCssRaw;
    }

    const files = req.files || {};
    const mp4 = Array.isArray(files.hero_video_mp4) ? files.hero_video_mp4[0] : null;
    const webm = Array.isArray(files.hero_video_webm) ? files.hero_video_webm[0] : null;
    const poster = Array.isArray(files.hero_poster) ? files.hero_poster[0] : null;

    const saveLocal = (file) => {
      const fname = `${Date.now()}_${file.originalname}`.replace(/\s+/g, '_');
      const out = path.join(UPLOAD_DIR, 'hero', fname);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, file.buffer);
      return `${BASE_URL}/uploads/hero/${fname}`; // public URL served by express static
    };

    if (mp4) {
      if (!['video/mp4'].includes(mp4.mimetype)) return res.status(400).json({ error: 'MP4 file must be video/mp4' });
      updated.hero_video_mp4_url = saveLocal(mp4);
    }
    if (webm) {
      if (!['video/webm'].includes(webm.mimetype)) return res.status(400).json({ error: 'WEBM file must be video/webm' });
      updated.hero_video_webm_url = saveLocal(webm);
    }
    if (poster) {
      if (!['image/jpeg','image/png','image/webp'].includes(poster.mimetype)) return res.status(400).json({ error: 'Poster must be JPG/PNG/WEBP' });
      updated.hero_video_poster_url = saveLocal(poster);
    }

    const jsonPath = path.join(DATA_DIR, 'site-settings.json');
    fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), 'utf8');
    return res.json({ settings: updated });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upload failed' });
  }
});

app.get('/api/admin/leads', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage || '20', 10)));
  const q = (req.query.q || '').toString();
  const status = (req.query.status || '').toString();
  const uni = (req.query.university || '').toString();
  const year = parseInt((req.query.year || '').toString() || '0', 10);
  const assigned = (req.query.assigned || '').toString();
  if (prisma) {
    try {
      const where = {}
      if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }, { phone: { contains: q, mode: 'insensitive' } }]
      if (status) where.status = status
      if (uni) where.preferred_university_slug = uni
      if (year) where.preferred_year = year
      if (assigned) where.assigned_admin_id = assigned
      const total = await prisma.lead.count({ where })
      const data = await prisma.lead.findMany({ where, orderBy: { created_at: 'desc' }, skip: (page - 1) * perPage, take: perPage })
      return res.json({ data, total })
    } catch (e) {}
  }
  if (supabase) {
    try {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' });
      if (q) {
        const like = `%${q}%`;
        query = query.or(`name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
      }
      if (status) query = query.eq('status', status);
      if (uni) query = query.eq('preferred_university_slug', uni);
      if (year) query = query.eq('preferred_year', year);
      if (assigned) query = query.eq('assigned_admin_id', assigned);
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);
      const { data, count, error } = await query;
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data: data || [], total: count || 0 });
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed' });
    }
  }
  try {
    const p = path.join(DATA_DIR, 'leads.json');
    let arr = [];
    if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
    let filtered = arr;
    if (q) filtered = filtered.filter(x => (x.name || '').includes(q) || (x.email || '').includes(q) || (x.phone || '').includes(q));
    if (status) filtered = filtered.filter(x => x.status === status);
    if (uni) filtered = filtered.filter(x => x.preferred_university_slug === uni);
    if (year) filtered = filtered.filter(x => x.preferred_year === year);
    if (assigned) filtered = filtered.filter(x => (x.assigned_admin_id || '') === assigned);
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = filtered.sort((a,b) => (a.created_at > b.created_at ? -1 : 1)).slice(start, end);
    return res.json({ data, total });
  } catch (e) {
    return res.json({ data: [], total: 0 });
  }
});

app.get('/api/admin/leads/:id', async (req, res) => {
  const id = req.params.id;
  if (prisma) {
    try {
      const data = await prisma.lead.findUnique({ where: { id } })
      if (!data) return res.status(404).json({ error: 'Not found' })
      return res.json({ data })
    } catch (e) {}
  }
  if (supabase) {
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json({ data });
  }
  try {
    const p = path.join(DATA_DIR, 'leads.json');
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
    const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
    const item = arr.find(x => x.id === id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json({ data: item });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed' });
  }
});

app.patch('/api/admin/leads/:id', async (req, res) => {
  const id = req.params.id;
  const schema = Joi.object({
    status: Joi.string().valid('new','contacted','closed'),
    notes: Joi.string().allow(''),
    assigned_admin_id: Joi.string().allow(''),
    priority: Joi.string().valid('low','normal','high'),
    last_contacted_at: Joi.string().allow(''),
    next_action_at: Joi.string().allow(''),
  }).min(1);
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  if (prisma) {
    try {
      const data = await prisma.lead.update({ where: { id }, data: value })
      return res.json({ data })
    } catch (e) {}
  }
  if (supabase) {
    const { data, error: uErr } = await supabase.from('leads').update(value).eq('id', id).select('*').maybeSingle();
    if (uErr) return res.status(500).json({ error: uErr.message });
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json({ data });
  }
  try {
    const p = path.join(DATA_DIR, 'leads.json');
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
    const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const next = { ...arr[idx], ...value };
    arr[idx] = next;
    fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
    return res.json({ data: next });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed' });
  }
});

app.get('/api/admin/leads/metrics', async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDateKey = d => {
    const y = d.getUTCFullYear();
    const m = `${d.getUTCMonth()+1}`.padStart(2,'0');
    const day = `${d.getUTCDate()}`.padStart(2,'0');
    return `${y}-${m}-${day}`;
  };
  if (prisma) {
    try {
      const data = await prisma.lead.findMany({ where: { created_at: { gte: since } }, select: { status: true, created_at: true } })
      const byStatus = {}
      for (const x of data || []) byStatus[x.status || 'new'] = (byStatus[x.status || 'new'] || 0) + 1
      const daily = {}
      for (const x of data || []) {
        const k = toDateKey(new Date(x.created_at))
        daily[k] = (daily[k] || 0) + 1
      }
      return res.json({ byStatus, daily })
    } catch (e) {}
  }
  if (supabase) {
    const { data, error } = await supabase.from('leads').select('id,status,created_at').gte('created_at', since.toISOString());
    if (error) return res.status(500).json({ error: error.message });
    const byStatus = {};
    for (const x of data || []) byStatus[x.status || 'new'] = (byStatus[x.status || 'new'] || 0) + 1;
    const daily = {};
    for (const x of data || []) {
      const k = toDateKey(new Date(x.created_at));
      daily[k] = (daily[k] || 0) + 1;
    }
    return res.json({ byStatus, daily });
  }
  try {
    const p = path.join(DATA_DIR, 'leads.json');
    let arr = [];
    if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, 'utf8'));
    const recent = arr.filter(x => new Date(x.created_at) >= since);
    const byStatus = {};
    for (const x of recent) byStatus[x.status || 'new'] = (byStatus[x.status || 'new'] || 0) + 1;
    const daily = {};
    for (const x of recent) {
      const k = toDateKey(new Date(x.created_at));
      daily[k] = (daily[k] || 0) + 1;
    }
    return res.json({ byStatus, daily });
  } catch (e) {
    return res.json({ byStatus: {}, daily: {} });
  }
});

// Global error handler to ensure JSON responses (including multer errors)
app.use((err, req, res, next) => {
  if (err) {
    if (err.name === 'MulterError') {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
  next();
});

// Razorpay integration (optional)
const rzClient = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

app.post('/api/checkout/create-order', async (req, res) => {
  if (!rzClient) return res.status(400).json({ error: 'Razorpay not configured' });
  try {
    const order = await rzClient.orders.create({ amount: 49900, currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json({ order });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
