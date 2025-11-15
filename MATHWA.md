Build a full-stack responsive webapp named MATHWA, which serves as the official admission partner web platform for MBBS admissions abroad.
The current partner is Kyrgyz State University (Arabaev University) — https://arabaevksu.edu.kg/en/
 — but the webapp must be designed to easily add more universities later without code-level changes.
 The webapp should be compabtible for desktops and well as mobile devices.

🎯 Core Goal

Convert Indian students and parents interested in MBBS Abroad (Kyrgyzstan, Kazakhstan, etc.) into verified leads by building trust, showcasing transparency, and simplifying the admission process.

🌍 Webapp Pages & Structure

1. Home Page

Hero section with background video or animated gradient banner.

Main tagline: “Study MBBS Abroad with MATHWA — Official Partner of Kyrgyz State University.”

Sub tagline: “Your trusted gateway to affordable medical education in Kyrgyzstan.”

CTA buttons: “Apply Now”, “Get Free Counseling”, “WhatsApp Us”.

Display trust badges: “Government Accredited”, “Official Partner”, “100% Visa Support”, “NEET Eligible”.

Animated stats counters (Students Sent, Years of Partnership, etc.)

2. About Page

Story of MATHWA and its official partnership with Kyrgyz State University.

Mission and credibility section (photos of MoU signing, faculty, campus, etc.).

Option to dynamically add new partner universities (cards with logos, brief intro, and “View Details” button).

3. University Pages (Dynamic)

Each university (e.g., Kyrgyz State University) has its own page:

Hero image/banner of the university.

Overview + Accreditation badges.

Gallery (image carousel + campus videos).

Course details (MBBS duration, intake months, eligibility, hostel info).

Year-wise Fee Structure Table (editable via admin panel).

“Apply Now” and “Book Counseling” buttons.

4. Apply Page

Multi-step form (progress bar):
Step 1: Personal Info (name, phone, email, city).
Step 2: Academic Info (NEET qualified? marksheet upload).
Step 3: Preferred University & Year.
Step 4: Submit -> Confirmation screen + WhatsApp CTA.

Form data stored securely in database + email + CRM webhook.

5. Admin (different repo)

Add/Edit/Delete Universities (name, description, photos, fee structure, intake info).

Edit pricing dynamically (year-wise).

Manage leads (view/export).

Update FAQs, testimonials, and gallery.

6. Additional Sections

Testimonials (video + quote).

Blog / Articles (“Why Study MBBS in Kyrgyzstan”, “Visa Process Explained”).

FAQ (expandable).

Contact / Map + WhatsApp widget + Helpline.

💎 Design & UI

Apple-level sleek design, futuristic glowing effects, soft gradients, parallax banners.

Use Tailwind CSS + Framer Motion for smooth animations.

Responsive across all devices.

Trust-focused UI: Indian flag + Kyrgyzstan flag in header, partner logos, real photos.

Sticky header with quick “Apply / WhatsApp / Call” buttons.

Use card layout with subtle hover effects and light-glow shadows.

⚙️ Tech Stack

Frontend (client): Remix (react) + Tailwind CSS + Framer Motion for animations.
Frontend (admin): React + Tailwind CSS + React Admin for CRUD operations.

Backend: Node.js + Express API routes.

Database: supabase.

Storage: supabase.

Auth: Admin login (supabase).
user login (supabase).
Deployment: cloudflare + Railway/Render (backend).

💬 Integrations

WhatsApp Click-to-Chat (Gupshup / Twilio / WhatsApp Business API).

Payment Gateway (Razorpay) for seat booking or counseling fee.

CRM webhook (HubSpot/Zoho) for storing leads.

Google Analytics (GA4) + Meta Pixel for ad tracking.

💡 Features to Build for Marketing Conversion

Smart popup: “Get Free Counselling” appears after 15s or scroll-depth trigger.

Lead magnet: “Download MBBS in Kyrgyzstan Fee Guide” (requires email/phone).

Floating WhatsApp & Call icons.

Trust badges: “Official Partner of Kyrgyz State University”, “MATHWA Verified”.

Sticky CTA buttons (Apply / WhatsApp / Call).

Student review carousel with real photos.

🔐 Security

Secure backend with JWT auth for admin routes.

File validation for uploads (passport, marksheet).

HTTPS / SSL + environment variables for credentials.

🧭 SEO Optimizations

Dynamic meta tags (per university page).

Schema markup for universities & FAQs.

Sitemap.xml + robots.txt auto-generation.

Fast loading (Lighthouse > 90 score).

📱 Future Scalability

Easily add new university cards with logo, hero image, fee structure, and intake info from admin panel.

Admin can toggle “active/inactive” universities.

Fees editable by year and currency.

Ability to duplicate existing university pages as templates for new partners.

🤖 AI Agent Integration (optional)

Add an AI chatbot on every page (e.g., “Ask MATHWA Bot”) that answers student questions about eligibility, fees, documents, visa process, etc.

Chatbot powered by a fine-tuned model or external API.

✅ Deliverables

Complete front + backend code with admin dashboard.

Responsive and SEO-ready site deployed on Vercel/Render.

Demo admin credentials + database seed for Kyrgyz State University.

Code structured for easy addition of new universities.

Visuals and components optimized for marketing conversion.

Design priority: Attractive, professional, trustworthy, conversion-optimized.
Primary goal: Every visitor should feel confident to apply or give contact details.

Website name: MATHWA — Official MBBS Admission Partner for Kyrgyz State University
Brand colors: use a mix of royal blue + white + golden accents.
Include glowing blue gradient backgrounds, soft shadows, and smooth motion transitions.

Build the full working code + deploy instructions.....