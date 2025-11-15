import { Card, CardContent, CardHeader, Grid, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const nav = useNavigate();
  const apiBase = (import.meta.env.VITE_SERVER_BASE_URL as string) || 'http://localhost:4000';
  const [stats, setStats] = useState<{ count: number } | null>(null);
  const [settingsOk, setSettingsOk] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await fetch(`${apiBase}/api/universities`).then(r => r.json());
        setStats({ count: (u.universities || []).length });
      } catch {}
      try {
        const s = await fetch(`${apiBase}/api/site-settings`).then(r => r.json());
        setSettingsOk(!!s?.settings);
      } catch {}
    })();
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Quick Actions" />
          <CardContent>
            <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => nav('/university-fees')}>Edit Fees</Button>
            <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => nav('/university-gallery')}>Upload Gallery</Button>
            <Button fullWidth variant="contained" onClick={() => nav('/university-dp')}>Update Display Picture</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Universities" />
          <CardContent>
            <Typography>Count: {stats?.count ?? '—'}</Typography>
            <Button sx={{ mt: 1 }} variant="outlined" onClick={() => nav('/universities')}>View List</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Site Settings" />
          <CardContent>
            <Typography>Status: {settingsOk ? 'Configured' : 'Not Configured'}</Typography>
            <Button sx={{ mt: 1 }} variant="outlined" onClick={() => nav('/site-settings')}>Open Settings</Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

