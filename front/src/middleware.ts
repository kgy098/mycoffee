import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const refreshToken = req.cookies.get('refresh_token');
//   const isAuthenticated = !!refreshToken;
  
//   // Debug logging
//   console.log('Middleware:', {
//     // pathname,
//     // hasRefreshToken: !!refreshToken,
//     req,
//     refreshToken,
//     // allCookies: req.cookies.getAll(),
//   });

//   // Public routes that don't require authentication
//   const publicRoutes = [
//     '/auth/login', 
//     '/auth/register', 
//     '/auth/find-id', 
//     '/auth/forgot-password', 
//     '/auth/login-select',
//     '/auth/register/success',
//     '/auth/forgot-password/reset-password',
//     '/auth/forgot-password/success'
//   ];
//   const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

//   if (!isAuthenticated && !isPublicRoute) {
//     return NextResponse.redirect(new URL('/auth/login', req.url));
//   }

//   if (isAuthenticated && isPublicRoute) {
//     return NextResponse.redirect(new URL('/home', req.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

