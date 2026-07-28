import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/infra/server.ts'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  clean: true,
  sourcemap: true,
  noExternal: ['@shared/core'],
  external: ['#prisma', '@prisma/client', '@prisma/adapter-pg', 'pg'],
});
