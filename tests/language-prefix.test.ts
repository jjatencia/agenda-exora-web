import { beforeAll, afterAll, describe, expect, test } from 'vitest';
import next from 'next';
import { createServer } from 'http';
import type { AddressInfo } from 'net';

let server: any;
let baseUrl: string;

describe('language prefix handling', () => {
  beforeAll(async () => {
    process.env.NEXT_DISABLE_FONT_DOWNLOADS = '1';
    const app = next({ dev: true });
    const handle = app.getRequestHandler();
    await app.prepare();
    server = createServer((req, res) => handle(req, res));
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test(
    'unknown locale prefix returns 404',
    async () => {
      const res = await fetch(`${baseUrl}/en`);
      expect(res.status).toBe(404);
    },
    30000,
  );
});
