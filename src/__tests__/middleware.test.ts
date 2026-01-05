import { describe, it, expect, vi } from 'vitest';
import { middleware } from '../middleware';
import { NextRequest, NextResponse } from 'next/server';

// Note: NextRequest/NextResponse in tests might need polyfills or simple mocks if not running in Edge runtime env
// But vitest with jsdom/node usually handles classes fine if imported from next/server

describe('Middleware', () => {
    it('should redirect unauthenticated users to login', () => {
        // Private route
        const req = {
            nextUrl: { pathname: '/dashboard' },
            url: 'http://localhost:3000/dashboard',
            cookies: {
                get: vi.fn().mockReturnValue(undefined), // No auth cookie
            }
        } as any;

        const res = middleware(req);

        // Check redirect
        expect(res.status).toBe(307); // or 302/308 depending on Next.js default, usually 307 for redirect()
        expect(res.headers.get('location')).toContain('/login');
    });

    it('should allow authenticated users to private routes', () => {
        const req = {
            nextUrl: { pathname: '/dashboard' },
            url: 'http://localhost:3000/dashboard',
            cookies: {
                get: vi.fn().mockReturnValue({ value: 'valid-token' }),
            }
        } as any;

        const res = middleware(req);

        // Check next() -> returns a response with status 200 (or the continuation signal)
        // NextResponse.next() typically returns a response with x-middleware-next header or similar
        // BUT checking against actual NextResponse implementation details is tricky. 
        // Usually it returns a 200 OK with no body for next()
        expect(res.status).toBe(200);
        expect(res.headers.get('x-middleware-next')).not.toBeNull(); // Often how next() is implemented
    });

    it('should allow public routes without auth', () => {
        const publicRoutes = ['/', '/login', '/registro'];

        publicRoutes.forEach(route => {
            const req = {
                nextUrl: { pathname: route },
                url: `http://localhost:3000${route}`,
                cookies: {
                    get: vi.fn().mockReturnValue(undefined),
                }
            } as any;

            const res = middleware(req);
            expect(res.status).toBe(200);
        });
    });
});
