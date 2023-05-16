/* eslint import/no-extraneous-dependencies: 0 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: "/eternal-anvil/",
  plugins: [
    react(),
    eslint({ fix: true, lintOnStart: true }),
    checker({ typescript: true })],
});
