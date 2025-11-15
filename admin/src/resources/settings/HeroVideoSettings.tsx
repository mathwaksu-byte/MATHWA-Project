import { useEffect, useRef, useState } from 'react';

type BgVariant = { id: string; name: string; gradient: string; note?: string };
const BG_VARIANTS: BgVariant[] = [
  // Existing three
  {
    id: 'brand-balanced',
    name: 'Balanced (Default)',
    gradient: [
      'radial-gradient(1200px 700px at 8% 0%, rgba(27,59,156,0.48), transparent 65%)',
      'radial-gradient(1200px 700px at 92% 100%, rgba(49,34,122,0.42), transparent 70%)',
      'radial-gradient(1000px 560px at 40% 45%, rgba(41,171,226,0.35), transparent 72%)',
      'radial-gradient(520px 300px at 95% 6%, rgba(245,179,1,0.35), transparent 74%)',
    ].join(', '),
    note: 'Royal blue + purple with cyan & gold accent',
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
    note: 'Stronger blues, subtle cyan & gold',
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
    note: 'Brighter feel with gold highlight',
  },
  // New variations
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

export default function HeroVideoSettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const envBase = import.meta.env.VITE_SERVER_BASE_URL as string | undefined;
    const primary = envBase ? envBase : 'http://localhost:4000';
    const secondary = envBase ? 'http://localhost:4000' : 'http://localhost:4001';
    fetch(`${primary}/api/site-settings`).then(async r => {
      if (r.ok) return r.json();
      return fetch(`${secondary}/api/site-settings`).then(r2 => r2.json());
    }).then(j => setPreview(j.settings)).catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Cache the form element immediately – React may pool the event and null out currentTarget later
    const form = e.currentTarget;
    setLoading(true);
    setMessage(null);
    const fd = new FormData(form);
    try {
      const envBase = import.meta.env.VITE_SERVER_BASE_URL as string | undefined;
      const primary = envBase ? envBase : 'http://localhost:4000';
      const secondary = envBase ? 'http://localhost:4000' : 'http://localhost:4001';
      let res = await fetch(`${primary}/api/admin/site-settings`, { method: 'POST', body: fd }).catch(() => null as any);
      if (!res || !res.ok) {
        res = await fetch(`${secondary}/api/admin/site-settings`, { method: 'POST', body: fd });
      }
      let j: any = null;
      try { j = await res.json(); }
      catch (parseErr) {
        const t = await res.text();
        throw new Error(t?.slice(0, 180) || 'Server returned non-JSON response');
      }
      if (!res.ok) throw new Error(j?.error || 'Failed');
      setMessage('Saved successfully');
      setPreview(j.settings);
      // Guard against pooled event nulls and ensure we reset the form safely
      if (form && typeof (form as any).reset === 'function') {
        (form as any).reset();
      }
    } catch (err: any) {
      setMessage(err?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '32px auto', padding: 16 }}>
      <h2>Hero Video Settings</h2>
      <p>Upload MP4/WEBM and an optional poster image. Update the title/subtitle shown over the hero video.</p>
      {message && <div style={{ margin: '8px 0', color: message.includes('Saved') ? 'green' : 'crimson' }}>{message}</div>}
      <form ref={formRef} onSubmit={onSubmit}>
        <label style={{ display: 'block', marginTop: 12 }}>Hero Title
          <input type="text" name="hero_title" defaultValue={preview?.hero_title || ''} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>Hero Subtitle
          <input type="text" name="hero_subtitle" defaultValue={preview?.hero_subtitle || ''} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
          <label>MP4 Video
            <input type="file" name="hero_video_mp4" accept="video/mp4" />
          </label>
          <label>WEBM Video
            <input type="file" name="hero_video_webm" accept="video/webm" />
          </label>
          <label>Poster Image
            <input type="file" name="hero_poster" accept="image/png,image/jpeg,image/webp" />
          </label>
        </div>

        {/* Hidden fields for background theme updates (filled when clicking Apply below) */}
        <input type="hidden" name="background_theme_id" defaultValue={preview?.background_theme_id || ''} />
        <input type="hidden" name="background_gradient_css" defaultValue={preview?.background_gradient_css || ''} />
        <input type="hidden" name="reset_background" defaultValue="" />

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '10px 16px' }}>
          {loading ? 'Saving…' : 'Save Settings'}
        </button>
      </form>

      {/* Background Theme Manager (locked) */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 8 }}>Background Theme</h3>
        <p style={{ color: '#475569', fontSize: 14 }}>The site background is locked to Emerald Teal. Other color selections have been removed.</p>
        {preview && (
          <div style={{ marginTop: 12, border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 84, backgroundImage: [
              'radial-gradient(1200px 700px at 8% 0%, rgba(0,128,128,0.44), transparent 65%)',
              'radial-gradient(1100px 640px at 92% 100%, rgba(27,59,156,0.35), transparent 70%)',
              'radial-gradient(900px 520px at 40% 45%, rgba(41,171,226,0.30), transparent 72%)'
            ].join(', '), backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 600 }}>Emerald Teal</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Locked site-wide</div>
            </div>
          </div>
        )}
        {preview && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>Current theme: {preview.background_theme_id || 'emerald-teal'}</div>
          </div>
        )}
      </div>

      {preview && (
        <div style={{ marginTop: 24 }}>
          <h3>Current Preview</h3>
          <video controls muted playsInline preload="metadata" poster={preview.hero_video_poster_url} style={{ width: '100%', borderRadius: 12 }}>
            {preview.hero_video_webm_url && <source src={preview.hero_video_webm_url} type="video/webm" />}
            {preview.hero_video_mp4_url && <source src={preview.hero_video_mp4_url} type="video/mp4" />}
          </video>
          <p><strong>Title:</strong> {preview.hero_title}</p>
          <p><strong>Subtitle:</strong> {preview.hero_subtitle}</p>
        </div>
      )}
    </div>
  );
}
