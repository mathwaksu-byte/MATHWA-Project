import { useEffect, useState } from 'react';
import { Box, Button, Grid, ImageList, ImageListItem, ImageListItemBar, Typography, Divider } from '@mui/material';

export default function GalleryUploader() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
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
      setPreview(Array.isArray(u.gallery_urls) ? u.gallery_urls : []);
      setSelected({});
    }).catch(() => {});
  }, [slug]);

  const upload = async () => {
    if (!slug || !files || files.length === 0) return;
    setUploading(true);
    setMessage('');
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/gallery`, { method: 'POST', body: fd }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/gallery`, { method: 'POST', body: fd });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview(Array.isArray(u.gallery_urls) ? u.gallery_urls : []);
      setMessage('Gallery updated');
      setFiles(null);
    } catch (e) {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggle = (url: string) => setSelected(s => ({ ...s, [url]: !s[url] }));

  const removeSelected = async () => {
    const urls = Object.keys(selected).filter(u => selected[u]);
    if (urls.length === 0) return;
    setUploading(true);
    setMessage('');
    try {
      const body = JSON.stringify({ urls });
      let res = await fetch(`${apiBase}/api/admin/universities/${slug}/gallery`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body }).catch(() => null as any);
      if (!res || !res.ok) {
        const fallback = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';
        res = await fetch(`${fallback}/api/admin/universities/${slug}/gallery`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body });
      }
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const u = json.university || {};
      setPreview(Array.isArray(u.gallery_urls) ? u.gallery_urls : []);
      setSelected({});
      setMessage('Removed selected images');
    } catch (e) {
      setMessage('Delete failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700}>University Gallery</Typography>
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
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={e => setFiles(e.target.files)} />
        </Grid>
        <Grid item>
          <Button onClick={upload} disabled={uploading} variant="contained">{uploading ? 'Uploading…' : 'Upload Images'}</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => setSelected(Object.fromEntries(preview.map(u => [u, true])))} variant="outlined">Select All</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => setSelected({})} variant="outlined">Clear Selection</Button>
        </Grid>
        <Grid item>
          <Button onClick={removeSelected} disabled={uploading} variant="contained" color="error">Delete Selected</Button>
        </Grid>
        {message && (
          <Grid item>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{message}</Typography>
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: 3, maxHeight: 480, overflowY: 'auto' }}>
        <ImageList variant="masonry" cols={3} gap={12}>
          {preview.map((u) => (
            <ImageListItem key={u} onClick={() => toggle(u)} style={{ cursor: 'pointer' }}>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', outline: selected[u] ? '2px solid #ef4444' : 'none' }}>
                <Box sx={{ aspectRatio: '4 / 3', bgcolor: 'grey.100' }}>
                  <img src={u} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </Box>
              <ImageListItemBar position="below" title={<Typography variant="caption">Gallery</Typography>} />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}
