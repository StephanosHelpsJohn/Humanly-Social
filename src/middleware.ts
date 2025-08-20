import { NextRequest, NextResponse } from 'next/server';

// These routes are publicly accessible and do not require authentication.
const publicRoutes = ['/', '/login', '/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || 'app.humanlysocial.ai';

  // --- Authentication Check ---
  // Check if the requested path is a public route.
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || (route !== '/' && pathname.startsWith(route + '/'))
  );

  const token = req.cookies.get('auth_token')?.value;

  // If the route is protected and no token is found, redirect to the login page.
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname); // Pass the intended destination for redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // --- Multi-Tenant Routing ---
  // This logic should run for all routes, including public ones, to handle subdomains.
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'app.humanlysocial.ai';

  // Let requests to the root domain (e.g., app.humanlysocial.ai) and admin subdomain pass through without rewrite.
  if (hostname.endsWith(appDomain)) {
    if (hostname === appDomain || hostname.startsWith('admin.')) {
      return NextResponse.next();
    }

    // It's a tenant subdomain. Rewrite the URL to include the slug as a path prefix.
    // e.g., `acme.app.humanlysocial.ai/dashboard` becomes `/acme/dashboard`
    const slug = hostname.replace(`.${appDomain}`, '');
    const newPath = `/${slug}${pathname}`;

    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  // Allow localhost and other environments (like Vercel previews) to pass through without subdomain rewriting.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
