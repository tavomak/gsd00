import { NextResponse } from 'next/server';
import { siteFromHost, sites } from '@/config/sites';

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|favicons).*)',
  ],
};

const MIGRATED = new Set(['/', '/about', '/contact', '/gallery', '/projects']);
const SITE_KEYS = new Set(Object.keys(sites));

function isMigrated(pathname) {
  if (MIGRATED.has(pathname)) return true;
  return [...MIGRATED].some((p) => p !== '/' && pathname.startsWith(`${p}/`));
}

export function proxy(req) {
  const host = req.headers.get('host') || '';
  const site = siteFromHost(host);
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith('/api/')) return NextResponse.next();

  const firstSegment = pathname.split('/')[1];
  if (SITE_KEYS.has(firstSegment)) {
    url.pathname = pathname.replace(/^\/[^/]+/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  if (isMigrated(pathname)) {
    url.pathname = `/${site}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
