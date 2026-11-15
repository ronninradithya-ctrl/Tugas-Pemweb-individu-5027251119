import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Saat `npm run dev`, request ke /products diteruskan ke backend Express (port 3000)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/products': 'http://localhost:3000' },
  },
});
