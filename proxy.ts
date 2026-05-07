import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret');

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: string; username: string; role: string };
  } catch {
    return null;
  }
}

function dashboardUrl(role: string, baseUrl: string) {
  if (role === 'admin') return new URL('/admin/dashboard', baseUrl);
  if (role === 'donee') return new URL('/donee/activity/search', baseUrl);
  if (role === 'platform_management') return new URL('/pr/dashboard', baseUrl);
  return new URL('/dashboard', baseUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(dashboardUrl(session.role, request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' || pathname === '/donee/account/login') {
    if (session) {
      return NextResponse.redirect(dashboardUrl(session.role, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/donee') && session.role !== 'donee') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/pr') && session.role !== 'platform_management') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
