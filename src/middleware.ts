import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|static/|favicon.ico).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');

  if (!hostname) {
    // It's better to return a 400 Bad Request if the host header is missing.
    return new Response('Missing host header', { status: 400 });
  }

  // For local development, you can use something like `tenant1.localhost:3000`
  // This logic assumes the production domain is `app.humanlysocial.ai`
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'app.humanlysocial.ai';

  // Handle root domain and admin subdomain
  if (hostname.endsWith(appDomain)) {
    if (hostname === appDomain || hostname.startsWith('admin.')) {
      // This is the main marketing site or the super admin console, let it pass.
      return NextResponse.next();
    }

    // It's a tenant subdomain
    const slug = hostname.replace(`.${appDomain}`, '');

    // Rewrite the URL to be /<slug>/...
    // For example, `tenant1.app.humanlysocial.ai/dashboard` becomes `/tenant1/dashboard`
    const newPath = `/${slug}${url.pathname}`;

    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  // If the hostname does not end with appDomain, it could be a local dev environment
  // or a preview deployment. For now, we will just let it pass.
  // A more robust solution for local dev would be to check for 'localhost'
  // and extract slug from a query param or path.
  if (hostname.includes('localhost')) {
    // In local dev, we can't use subdomains easily, so we can use a path-based approach
    // e.g. localhost:3000/tenant1/dashboard. No rewrite needed.
    return NextResponse.next();
  }

  return NextResponse.next();
}
