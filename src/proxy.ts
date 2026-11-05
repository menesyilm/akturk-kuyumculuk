import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Eski yönetici giriş adresini güncel giriş sayfasına yönlendir.
  if (pathname === '/admin/giris') {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
