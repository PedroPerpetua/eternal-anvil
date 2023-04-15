/* eslint import/no-extraneous-dependencies: 0 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';


export default defineConfig({
  plugins: [
    react(),
    eslint({ fix: true, lintOnStart: true }),
    checker({ typescript: true })],
});
