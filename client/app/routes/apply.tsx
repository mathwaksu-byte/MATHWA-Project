import type { ActionFunctionArgs, MetaFunction } from '@remix-run/react';
import { Form, useActionData } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';

type ActionData = { ok: boolean; message?: string } | undefined;

export const meta: MetaFunction = () => ([
  { title: 'Apply — Official Admissions via MATHWA' },
  { name: 'description', content: 'Submit your application through MATHWA — Official Partner of I. Arabaev Kyrgyz State University.' },
]);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const envBase = (import.meta.env.PUBLIC_SERVER_BASE_URL as string | undefined);
  const primary = envBase ? envBase : 'http://localhost:4000';
  const secondary = envBase ? 'http://localhost:4000' : 'http://localhost:4001';
  try {
    let res = await fetch(`${primary}/api/apply`, { method: 'POST', body: formData }).catch(() => null as any);
    if (!res || !res.ok) {
      res = await fetch(`${secondary}/api/apply`, { method: 'POST', body: formData }).catch(() => null as any);
    }
    if (!res || !res.ok) {
      return { ok: false, message: 'Failed to submit application' } as ActionData;
    }
    return { ok: true } as ActionData;
  } catch {
    return { ok: false, message: 'Network error. Please try again.' } as ActionData;
  }
}

export default function Apply() {
  const result = useActionData<ActionData>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState('');
  const phoneMasked = useMemo(() => {
    // simple mask: keep digits and format as +XX XXXXX XXXXX if possible
    const digits = phone.replace(/[^0-9+]/g, '');
    const d = digits.replace(/^\+?/, '+');
    // Return as-is, light normalization
    return d;
  }, [phone]);

  useEffect(() => {
    if (result?.ok && typeof window !== 'undefined') {
      try {
        // dataLayer for tracking if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer?.push({ event: 'apply_form_submit', phone: phoneMasked });
      } catch {}
    }
  }, [result, phoneMasked]);
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-royalBlue">Official Admissions Application</h1>
      <p className="mt-2 text-slate-700">Fill the form below. The official admissions team (MATHWA) will contact you shortly.</p>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white">1</span>
        <span>Personal</span>
        <span className="text-slate-400">→</span>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white">2</span>
        <span>Academic</span>
        <span className="text-slate-400">→</span>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-royalBlue text-white">3</span>
        <span>Preference</span>
        <span className="text-slate-400">→</span>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white">✓</span>
        <span>Submit</span>
      </div>
      {result?.ok && (
        <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700">
          Application submitted successfully! We will contact you via WhatsApp.
          <div className="mt-2">
          <a href="https://wa.me/" className="px-3 py-2 rounded-md bg-green-600 text-white">WhatsApp Admissions</a>
          </div>
        </div>
      )}
      {result && !result.ok && (
        <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700">{result.message}</div>
      )}

      <Form method="post" encType="multipart/form-data" className="mt-6 grid gap-6">
        {/* Step 1: Personal Info */}
        <div className="glass p-6 rounded-lg">
          <div className="font-semibold">Personal Info</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm text-slate-600" htmlFor="name">Full Name<span className="text-red-500"> *</span></label>
              <input
                id="name"
                name="name"
                required
                placeholder="ex: John Doe"
                className="mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'error-name' : undefined}
                onBlur={(e) => {
                  const v = e.currentTarget.value.trim();
                  setErrors((prev) => ({ ...prev, name: v ? '' : 'Name is required' }));
                }}
              />
              {errors.name && <p id="error-name" role="alert" className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600" htmlFor="phone">Phone<span className="text-red-500"> *</span></label>
              <input
                id="phone"
                name="phone"
                required
                placeholder="ex: +91 98765 43210"
                inputMode="tel"
                pattern="^[+0-9\s-]{10,}$"
                value={phoneMasked}
                onChange={(e) => setPhone(e.currentTarget.value)}
                className="mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'error-phone' : undefined}
                onBlur={(e) => {
                  const v = e.currentTarget.value.replace(/[^0-9]/g, '');
                  setErrors((prev) => ({ ...prev, phone: v.length >= 10 ? '' : 'Enter a valid phone number' }));
                }}
              />
              {errors.phone && <p id="error-phone" role="alert" className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              <p className="text-xs text-slate-500 mt-1">We use WhatsApp to contact you.</p>
            </div>
            <div>
              <label className="text-sm text-slate-600" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="ex: you@example.com" className="mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue" />
            </div>
            <div>
              <label className="text-sm text-slate-600" htmlFor="city">City</label>
              <input id="city" name="city" placeholder="ex: Mumbai" className="mt-1 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-royalBlue" />
            </div>
          </div>
        </div>

        {/* Step 2: Academic Info */}
        <div className="glass p-6 rounded-lg">
          <div className="font-semibold">Academic Info</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="neet_qualified" aria-label="NEET Qualified" /> NEET Qualified
            </label>
            <div>
              <label className="text-sm text-slate-600" htmlFor="marksheet">Upload Marksheet</label>
              <input id="marksheet" name="marksheet" type="file" accept="application/pdf,image/*" className="mt-1 block" />
              <p className="text-xs text-slate-500 mt-1">PDF/JPG/PNG up to 10MB.</p>
            </div>
          </div>
        </div>

        {/* Step 3: Preference */}
        <div className="glass p-6 rounded-lg">
          <div className="font-semibold">Preference</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm text-slate-600" htmlFor="preferred_university_slug">Preferred University</label>
              <select id="preferred_university_slug" name="preferred_university_slug" className="mt-1 border rounded-md px-3 py-2 w-full">
                <option value="kyrgyz-state-university">Kyrgyz State University (Arabaev University)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600" htmlFor="preferred_year">Starting Year</label>
              <select id="preferred_year" name="preferred_year" className="mt-1 border rounded-md px-3 py-2 w-full">
                {[1,2,3,4,5,6].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 4: Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 rounded-md bg-royalBlue text-white">Submit (Official)</button>
          <a href="https://wa.me/" className="px-4 py-2 rounded-md bg-green-600 text-white">WhatsApp Admissions</a>
        </div>
      </Form>
    </div>
  );
}
