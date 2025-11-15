import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcher: true,
        v3_relativeSplatPath: true,
        v3_routeConvention: true,
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: false,
  }
});
