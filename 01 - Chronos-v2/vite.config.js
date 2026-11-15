import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pas de « base » personnalisée : Vercel sert le site à la racine.
export default defineConfig({
  plugins: [react()],
});
