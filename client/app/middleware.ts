// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('accessToken')

//   if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/auth/signin', request.url))
//   }

//   if (token && request.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/auth/:path*'],
// }
