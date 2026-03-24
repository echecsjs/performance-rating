import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    'src/perfect.ts',
    'src/average.ts',
    'src/average-perfect.ts',
  ],
  format: 'esm',
  minify: true,
  outDir: 'dist',
  platform: 'neutral',
  sourcemap: 'hidden',
});
