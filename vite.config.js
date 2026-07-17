import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // PORT is read by the build tool only. Only VITE_* variables are exposed to browser code.
  const env = loadEnv(mode, process.cwd(), 'PORT');
  const configuredPort = Number.parseInt(env.PORT, 10);
  const port = Number.isInteger(configuredPort) && configuredPort >= 1024 && configuredPort <= 65535
    ? configuredPort
    : 5173;

  return {
    plugins: [react()],
    server: { port, strictPort: true },
    preview: { port, strictPort: true },
  };
});
