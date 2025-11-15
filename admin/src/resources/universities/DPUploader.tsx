import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardHeader, CardContent, Button, Typography, Divider } from '@mui/material';

export default function DPUploader() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [messageHero, setMessageHero] = useState('');
  const [messageLogo, setMessageLogo] = useState('');
  const [preview, setPreview] = useState<{ hero?: string; logo?: string }>({});
  const apiBase = (import.meta.env.VITE_SERVER_BASE_URL as string) || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${apiBase}/api/universities`).then(r => r.json()).then(j => {
      const list = (j.universities || []) as Array<any>;
      setUniversities(list.map(u => ({ slug: u.slug, name: u.name })));
      if (list.length > 0) setSlug(list[0].slug);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`${apiBase}/api/universities/${slug}`).then(r => r.json()).then(j => {
      const u = j.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
    }).catch(() => {});
  }, [slug]);

  const uploadHero = async () => {
    if (!slug || !heroFile) return;
    setUploadingHero(true);
    setMessageHero('');
    try {
      const fd = new FormData();
      fd.append('type', 'hero');
      fd.append('image', heroFile);
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/dp`, { method: 'POST', body: fd }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/dp`, { method: 'POST', body: fd });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageHero('Hero image updated');
      setHeroFile(null);
    } catch (e) {
      setMessageHero('Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const uploadLogo = async () => {
    if (!slug || !logoFile) return;
    setUploadingLogo(true);
    setMessageLogo('');
    try {
      const fd = new FormData();
      fd.append('type', 'logo');
      fd.append('image', logoFile);
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/dp`, { method: 'POST', body: fd }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/dp`, { method: 'POST', body: fd });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageLogo('Logo updated');
      setLogoFile(null);
    } catch (e) {
      setMessageLogo('Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const clearHero = async () => {
    if (!slug) return;
    setUploadingHero(true);
    setMessageHero('');
    try {
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/dp?type=hero`, { method: 'DELETE' }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/dp?type=hero`, { method: 'DELETE' });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageHero('Cleared');
    } catch (e) {
      setMessageHero('Clear failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const clearLogo = async () => {
    if (!slug) return;
    setUploadingLogo(true);
    setMessageLogo('');
    try {
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/dp?type=logo`, { method: 'DELETE' }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/dp?type=logo`, { method: 'DELETE' });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageLogo('Cleared');
    } catch (e) {
      setMessageLogo('Clear failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700}>University Display Pictures</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
        <Grid item>
          <Typography component="label">University</Typography>
        </Grid>
        <Grid item>
          <select value={slug} onChange={e => setSlug(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc' }}>
            {universities.map(u => (<option key={u.slug} value={u.slug}>{u.name}</option>))}
          </select>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Hero Image (16:9)" />
            <CardContent>
              <Box sx={{ aspectRatio: '16 / 9', borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.100' }}>
                {preview.hero && <img src={preview.hero} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setHeroFile(e.target.files?.[0] || null)} />
                <Button onClick={uploadHero} disabled={uploadingHero} variant="contained">{uploadingHero ? 'Uploading…' : 'Upload'}</Button>
                <Button onClick={clearHero} disabled={uploadingHero} variant="contained" color="error">Clear</Button>
                {messageHero && <Typography variant="body2" sx={{ opacity: 0.8 }}>{messageHero}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Logo (square)" />
            <CardContent>
              <Box sx={{ aspectRatio: '1 / 1', borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.100' }}>
                {preview.logo && <img src={preview.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                <Button onClick={uploadLogo} disabled={uploadingLogo} variant="contained">{uploadingLogo ? 'Uploading…' : 'Upload'}</Button>
                <Button onClick={clearLogo} disabled={uploadingLogo} variant="contained" color="error">Clear</Button>
                {messageLogo && <Typography variant="body2" sx={{ opacity: 0.8 }}>{messageLogo}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
