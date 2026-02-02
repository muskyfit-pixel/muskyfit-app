import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.SHEETS_URL': JSON.stringify(process.env.SHEETS_URL),
  }
});