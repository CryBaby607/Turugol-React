import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno por si las necesitas aquí
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    // Eliminamos todo el bloque 'server: { proxy: ... }'
  };
});