import { AppBar } from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { resolveApiBase } from '../lib/api';

export default function MyAppBar(props: any) {
  const [apiBase, setApiBase] = useState<string>((import.meta.env.VITE_SERVER_BASE_URL as string) || 'http://localhost:4000');
  useEffect(() => { resolveApiBase().then(setApiBase).catch(() => {}); }, []);
  return (
    <AppBar {...props}>
      <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
        <Typography variant="h6">MATHWA Admin</Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`API: ${apiBase}`} color="default" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>
      </Box>
    </AppBar>
  );
}
