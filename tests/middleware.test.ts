import { describe, expect, test, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

beforeEach(() => {
  process.env.NEXTAUTH_SECRET = 'test-secret';
});

describe('middleware redirect', () => {
  test('redirects to login when accessing /agenda without token', async () => {
    const req = new NextRequest('http://localhost/agenda');
    const res = await middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(
      new URL('/login', req.nextUrl).toString() + '?callbackUrl=%2Fagenda'
    );
  });

  test('redirects to login when basePath is set', async () => {
    const req = new NextRequest('http://localhost/pref/agenda', {
      nextConfig: { basePath: '/pref' },
    });
    const res = await middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(
      new URL('/login', req.nextUrl).toString() + '?callbackUrl=%2Fagenda'
    );
  });
});
