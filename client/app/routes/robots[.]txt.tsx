import type { LoaderFunctionArgs } from '@remix-run/react';

export async function loader({}: LoaderFunctionArgs) {
  const body = `User-agent: *\nAllow: /\nSitemap: ${(import.meta.env.PUBLIC_APP_BASE_URL as string) || 'http://localhost:5173'}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}

export default function Robots() { return null; }

