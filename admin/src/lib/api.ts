let cachedBase: string | null = null;

export async function resolveApiBase(): Promise<string> {
  if (cachedBase) return cachedBase;
  const envBase = (import.meta.env.VITE_SERVER_BASE_URL as string) || '';
  const candidates = [envBase, 'http://localhost:4000', 'http://localhost:4001']
    .filter(Boolean);
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/universities`, { method: 'GET' });
      if (res.ok) { cachedBase = base; return base; }
    } catch {}
  }
  // Fallback to env or 4000
  cachedBase = envBase || 'http://localhost:4000';
  return cachedBase;
}

