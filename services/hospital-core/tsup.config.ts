import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/infra/server.ts'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  clean: true,
  sourcemap: true,
  // empacota o pacote de workspace no bundle (fica self-contained):
  noExternal: ['@shared/core'],
  // o client Prisma gerado (WASM) fica EXTERNO via subpath import #prisma,
  // resolvido em runtime pelo Node — não empacotado pelo esbuild:
  external: ['#prisma', '@prisma/client'],
});
